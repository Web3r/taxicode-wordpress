<template>
    <div>
        <the-biq-search-form
            :api-public-key="this.appSettings.biq_pk"
            :api-places-lookup="`${appSettings.biq_api_host}${appConfig.PLACES_URI}`"
            :api-quotes-from="`${appSettings.biq_api_host}${appConfig.QUOTE_URI}`"
            :search-on-load="searchOnLoad"
            :debugging="debugging"
            :use-buttons="appConfig.useButtons" 
            @biqQuotesSearched="onQuotesSearched"
            @biqQuotesError="onQuotesError"
            @biqZeroQuotes="onZeroQuotes"
        ></the-biq-search-form>
        
        <the-biq-search-results v-if="showResults" 
            :display-results-type="appSettings.quote_type"
            :debugging="debugging"
            :use-buttons="appConfig.useButtons" 
            @biqQuoteBookNow="onBookNowClicked"
        >
            <template #loading-quotes>
                <div class="row">
                    Generating Quotes...
                </div>
            </template>
            <template #zero-quotes="{ error }">
                <p>{{error.message}}</p>
            </template>
        </the-biq-search-results>

        <!-- use the modal component, pass in the prop -->
        <modal v-if="showRecommendedUpgrade" 
            :header-text="recommended_upgrade_header"
            @cancel="onCancelModal"
            @confirm="onConfirmModal"
            cancel-action-text="Don't Upgrade"
            confirm-action-text="Upgrade"
        >
            <!-- you can use custom content here to overwrite default content -->
            <p slot="body">{{recommended_upgrade_description}}</p>
        </modal>

    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/TheSearchForm.vue';
    import TheSearchResults from 'BIQ/TheSearchResults.vue';
    // import the popup dialog component for the recommended quote upgrade
    import BasicConfirmModal from '@/components/BasicConfirmModal.vue';
    // import the recommended quote upgrade calculator
    import QuotesRecommendedUpgradeCalculator from '@/common/BIQ/QuotesRecommendedUpgradeCalculator';

    export default {
        name: 'HomePage',

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
            'the-biq-search-results' : TheSearchResults,
            'modal' : BasicConfirmModal
        },

        props: {
            searchFormData : {
                type : Object,
                default : function() { 
                    return {};
                }
            },

            searchOnLoad : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
                selected : {
                    id : '',
                    vehicle : 0,
                    data : {}
                },
                show_upgrade : false,
                recommended_upgrade_header : 'No Upgrade',
                recommended_upgrade_description : 'No Upgrade',
                quotesRecommendedUpgrade : new QuotesRecommendedUpgradeCalculator(
                    () => this.journeyQuotes, 
                    () => this.journeyDetails, 
                    this.debugging
                )
            };
        },

        created() {
            if(this.searchOnLoad) {
                // overwrite the search form details state with any POSTed values from 
                // the server side generation, this will
                this.$store.commit('searchingQuotesFor', this.searchFormPropData());
            }
            // make sure that is the search display state can still be used
            if(this.displayType !== this.appSettings.quote_type && this.hasSearchResults) {
                // change the quote results display type & trigger the display results to be 
                // recalculated based on the new display type
                this.changeDisplayType(this.appSettings.quote_type);
            }
        },

        computed : {
            ...mapGetters([
            // BIQ Quote Search state
                'hasSearchResults',
                'displayType',
            // BIQ Quoting state
                'loadingQuotes', 
                'quotesError', 
                'quotesLoaded', 
                'journeyID', 
                'journeyDetails', 
                'journeyQuotes', 
            // BIQ Book Now Checkout state
                'quoteID',
                'vehicleIndex'
            ]),

            showResults : function() {
                return (this.loadingQuotes || this.quotesError || this.quotesLoaded);
            },

            showRecommendedUpgrade : function() {
                return (this.appSettings.recommend_upgrade && this.show_upgrade);
            }
        },

        methods : {
            ...mapActions([
            // BIQ Quote Search state
                'searchedQuotes', 
                'changeDisplayType', 
            // BIQ Quoting state
                'apiQuotesError', 
            // BIQ Book Now Checkout state
                'bookNow'
            ]),

            searchFormPropData : function() {
                if(this.debugging) {
                    console.log('BIQ Search Form POST prop data', this.searchFormData);
                }
                const journey_details = {
                    journey_type : (typeof(this.searchFormData.journey_type) != 'undefined')
                        ? this.searchFormData.journey_type 
                        : '',
                    pickup : (typeof(this.searchFormData.pickup) != 'undefined')
                        ? this.searchFormData.pickup 
                        : '',
                    vias : (typeof(this.searchFormData.via) != 'undefined')
                        ? [this.searchFormData.via] 
                        : [],
                    destination : (typeof(this.searchFormData.destination) != 'undefined')
                        ? this.searchFormData.destination 
                        : '', 
                    // @todo check that the date is in the future & adjust if not
                    date : (typeof(this.searchFormData.date) != 'undefined')
                        ? this.searchFormData.date 
                        : '', 
                    // @todo check that the date and time is in the future & adjust if not
                    time : (typeof(this.searchFormData.time) != 'undefined')
                        ? this.searchFormData.time 
                        : '', 
                    people : (typeof(this.searchFormData.people) != 'undefined')
                        ? this.searchFormData.people 
                        : '1'
                };
                let return_date = '';
                let return_time = '';
                if(typeof(this.searchFormData.return_date) != 'undefined') {
                // @todo check that the date is in the future and after the outbound date 
                // & adjust if not
                    return_date = this.searchFormData.return_date;
                    if(typeof(this.searchFormData.return_time) != 'undefined') {
                    // @todo check that the date and time is in the future and after the 
                    // outbound date time & adjust if not
                        return_time = this.searchFormData.return_time;
                    }
                }
                journey_details.returning = {
                    date : return_date, 
                    time : return_time, 
                };
                return journey_details;
            },

            onQuotesSearched : function(event) {
                if(this.debugging) {
                    console.group('BIQ Quotes Searched');
                    console.log(event);
                }
                // update the quotes search state with the results
                this.updateSearchState(event.data);
                if(this.debugging) {
                    console.groupEnd();
                }
                // not for this release, too much extra is needed to function
                // push the journey ID on to the URL so it can be directly linked to
                // this.$router.push({ 
                //     name : 'HomePageSearched', 
                //     params : { 
                //         journey : this.journeyID 
                //     } 
                // });
            },

            onZeroQuotes : function(event) {
                if(this.debugging) {
                    console.group('BIQ Quotes Search Zero Results');
                    console.log(event);
                }
                // log the error
                console.error(event.data.error);
                // update the quotes search state with the results
                this.updateSearchState(event.data);
                if(this.debugging) {
                    console.groupEnd();
                }
            },

            onQuotesError : function(event) {
                if(this.debugging) {
                    console.group('BIQ Quotes Search Error');
                    console.log(event);
                    console.groupEnd();
                }
                // make sure the error has a message
                const message = event.data.error.message || 'Unknown BIQ Quotes API Error';
                console.error(event.data.error);
                // update the quotes state with the API error
                this.apiQuotesError(message);
            },

            onBookNowClicked : function(event) {
                if(this.debugging) {
                    console.group('BIQ Quote Book Now Clicked');
                    console.log(event);
                }
                event.preventDefault();
                const { 
                    quoteID, 
                    selectedVehicleIndex 
                } = event.data;
                if(this.debugging) {
                    console.log('Quote ID', quoteID);
                    console.log('Vehicle Index', selectedVehicleIndex);
                    console.log('Quote', this.journeyQuotes[quoteID]);
                    console.log('Vehicle', this.journeyQuotes[quoteID].vehicles[selectedVehicleIndex]);
                    console.groupEnd();
                }
                // set the selected quote details
                const selected = {
                    id : quoteID,
                    vehicle : selectedVehicleIndex,
                    data : this.journeyQuotes[quoteID]
                };
                // check if there is a recommended quote upgrade available being offered
                if(!this.recommendAvailableUpgrade(selected)) {
                // no quote upgrade to offer
                    // we're done, next page
                    return this.gotoCheckout();
                }
            },

            onCancelModal : function(event) {
                if(this.debugging) {
                    console.log('Cancel Modal Event', event);
                }
                // the upgrade offer was declined, use the selected quote and ...
                // we're done, next page
                this.gotoCheckout();
                // flag the modal popup to close
                this.show_upgrade = false;
            },

            onConfirmModal : function(event) {
                if(this.debugging) {
                    console.log('Confirm Modal Event', event);
                }
                // get the recommended upgrade 
                const upgrade = this.quotesRecommendedUpgrade.getRecommendedUpgrade();
                if(this.debugging) {
                    console.group('Quote Upgrade Recommendation Accepted');
                    console.log('quoteUpgradeOption', upgrade);
                    console.groupEnd();
                }
                // the upgrade offer was accepted, so ...
                // set the upgrade quote as the selected quote and ...
                this.selected = {
                    id : upgrade.upgradeQuoteId,
                    vehicle : upgrade.upgradeVehicleIndex,
                    data : upgrade.upgradeQuote
                };
                // we're done, next page
                this.gotoCheckout();
                // flag the modal popup to close
                this.show_upgrade = false;
            },

            recommendAvailableUpgrade : function(selected) {
                if(!this.appSettings.recommend_upgrade) {
                // recommended upgrade is not being used but the selected still needs to be set
                    // set the selected quote
                    this.selected = selected;
                    return false;
                }
                // see if there is an quote avalaible for upgrade recommendation
                this.quotesRecommendedUpgrade.makeRecommendationFor(selected.data, selected.vehicle);
                // get the recommended upgrade
                const quoteRecommendedUpgrade = this.quotesRecommendedUpgrade.getRecommendedUpgrade();
                if(this.debugging) {
                    console.group('Book Now Upgrade Recommendation');
                    console.log('quoteUpgradeOption', quoteRecommendedUpgrade);
                    console.log('props', quoteRecommendedUpgrade.props());
                    console.groupEnd();
                }
                // set the selected quote
                this.selected = selected;
                // determine if to offer the quote vehicle upgrade recommendation
                if(!quoteRecommendedUpgrade.exists) {
                // no quote upgrade to offer
                    return false;
                }
                // there is a quote upgrade recommendation to offer
                const upgradeProps = quoteRecommendedUpgrade.props();
                this.recommended_upgrade_header = upgradeProps.title;
                this.recommended_upgrade_description = upgradeProps.description;
                // flag the modal popup to display the recommended upgrade offer
                this.show_upgrade = true;
                return this.show_upgrade;
            },

            gotoCheckout : function() {
                // update the state with the selected journey quote & vehicle
                this.bookNow({
                    quote : this.selected.id, 
                    vehicle : this.selected.vehicle,
                    quote_data : this.selected.data
                });
                // move to the checkout page to book the selected journey quote using the state bound values
                this.$router.push({ 
                    name : 'CheckoutPage', 
                    params : { 
                        journey : this.journeyID, 
                        quote : this.quoteID, 
                        vehicle : this.vehicleIndex 
                    }
                });
            }, 

            updateSearchState : function(data) {
                if(this.debugging) {
                    console.group('BIQ Quotes Search State Updated');
                    console.log('Search data', data);
                    console.log('Quote type', this.appSettings.quote_type);
                    console.groupEnd();
                }
                // update the search state with the quote search results so the display 
                // results can be calculated & the results changed
                this.searchedQuotes({ 
                    ...data,
                    display_type : this.appSettings.quote_type 
                });
            }
        }
    };
</script>

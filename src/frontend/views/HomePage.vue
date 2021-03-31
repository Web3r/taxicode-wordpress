<template>
    <div>
        <the-biq-search-form
            :biq-public-key="appSettings.biq_pk"
            :biq-places-lookup="`${appSettings.biq_api_host}${appConfig.biq.PLACES_URI}`"
            :biq-quotes-from="`${appSettings.biq_api_host}${appConfig.biq.QUOTE_URI}`"
            :search-on-load="searchOnLoad"
            :debugging="debugging"
            :use-buttons="appConfig.biq.useButtons" 
            @biqQuotesSearched="onQuotesSearched"
            @biqZeroQuotes="onZeroQuotes"
            @biqQuotesError="onQuotesError"
            layout="column"
        ></the-biq-search-form>
        
        <the-biq-search-results v-if="showResults" 
            :display-results-type="appSettings.quote_type"
            :debugging="debugging"
            :use-buttons="appConfig.biq.useButtons" 
            @biqQuoteBookNow="onBookNowClicked"
        >
            <template #loading-quotes>
                <div class="row">
                    Generating Quotes...
                </div>
            </template>
        </the-biq-search-results>

        <biq-quote-upgrade-offer-modal v-if="showRecommendedUpgrade" 
            :journey="selected.journey"
            :quote="selected.quote.id"
            :vehicle="selected.quote.vehicle"
            :debugging="debugging"
            @unavailable="onUpgradeUnavailable"
            @cancel="onUpgradeModalCancel"
            @confirm="onUpgradeModalConfirm"
        >
            <!-- you can use custom content here to overwrite default content -->
            <template #body="slotProps">
                <p>{{slotProps.upgrade.description}}</p>
            </template>
        </biq-quote-upgrade-offer-modal>

    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/Search/TheSearchForm.vue';

    export default {
        name: 'HomePage',

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
            'the-biq-search-results' : () => import(/* webpackChunkName: "BIQSearchResults", webpackPrefetch: true */ 'BIQ/TheSearchResults.vue'),
            'biq-quote-upgrade-offer-modal' : () => import(/* webpackChunkName: "BIQQuoteUpgradeOffer", webpackPrefetch: true */ 'BIQ/QuoteUpgradeOfferModal.vue')
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
                    journey : '',
                    quote : {
                        id : '',
                        vehicle : 0
                    }
                },
                show_upgrade : false
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

            onQuotesSearched : function(evt) {
                if(this.debugging) {
                    console.group('BIQ Quotes Searched');
                    console.log(evt);
                }
                // update the quotes search state with the results
                this.updateSearchState(evt.data);
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

            onZeroQuotes : function(evt) {
                if(this.debugging) {
                    console.group('BIQ Quotes Search Zero Results');
                    console.log(evt);
                }
                // log the error
                console.error(evt.data.error);
                // update the quotes search state with the results
                this.updateSearchState(evt.data);
                if(this.debugging) {
                    console.groupEnd();
                }
            },

            onQuotesError : function(evt) {
                if(this.debugging) {
                    console.group('BIQ Quotes Search Error');
                    console.log(evt);
                    console.groupEnd();
                }
                // make sure the error has a message
                const message = evt.data.error.message || 'Unknown BIQ Quotes API Error';
                console.error(evt.data.error);
                // update the quotes state with the API error
                this.apiQuotesError(message);
            },

            onBookNowClicked : function(evt) {
                if(this.debugging) {
                    console.group('BIQ Quote Book Now Clicked');
                    console.log(evt);
                }
                evt.preventDefault();
                const { 
                    quoteID, 
                    selectedVehicleIndex 
                } = evt.data;
                if(this.debugging) {
                    console.log('Quote ID', quoteID);
                    console.log('Vehicle Index', selectedVehicleIndex);
                    console.log('Quote', this.journeyQuotes[quoteID]);
                    console.log('Vehicle', this.journeyQuotes[quoteID].vehicles[selectedVehicleIndex]);
                    console.groupEnd();
                }
                // set the selected quote details
                const selected = {
                    journey : this.journeyID,
                    quote : {
                        id : quoteID,
                        vehicle : selectedVehicleIndex
                    }
                };
                // set the selected quote
                this.selected = selected;
                if(this.appSettings.recommend_upgrade) {
                // the recommended quote upgrade offer is going to be shown
                    // flag the modal popup to display the recommended upgrade offer & return to 
                    // prevent going directly to the checkout page
                    return this.show_upgrade = true;
                }
                // we're done, next page
                return this.gotoCheckout();
            },

            onUpgradeUnavailable : function(evt) {
                if(this.debugging) {
                    console.log('No Quote Upgrade Available Event', evt);
                }
                // flag the modal popup to close
                this.show_upgrade = false;
                // the upgrade offer was declined, use the selected quote and ...
                // we're done, next page
                this.gotoCheckout();
            },

            onUpgradeModalCancel : function(evt) {
                if(this.debugging) {
                    console.log('Cancel Upgrade Modal Event', evt);
                }
                // flag the modal popup to close
                this.show_upgrade = false;
                // the upgrade offer was declined, use the selected quote and ...
                // we're done, next page
                this.gotoCheckout();
            },

            onUpgradeModalConfirm : function(evt) {
                if(this.debugging) {
                    console.log('Confirm Modal Event', evt);
                }
                // get the recommended upgrade 
                const recommendedUpgrade = evt.recommendedUpgrade;
                if(this.debugging) {
                    console.group('Quote Upgrade Recommendation Accepted');
                    console.log('recommendedUpgrade', recommendedUpgrade);
                    console.groupEnd();
                }
                // flag the modal popup to close
                this.show_upgrade = false;
                // the upgrade offer was accepted, so ...
                // set the upgrade quote as the selected quote and ...
                this.selected.quote = {
                    id : recommendedUpgrade.upgradeQuoteId,
                    vehicle : recommendedUpgrade.upgradeVehicleIndex
                };
                // we're done, next page
                this.gotoCheckout();
            },

            gotoCheckout : function() {
                // update the state with the selected journey quote & vehicle
                this.bookNow({
                    quote : this.selected.quote.id, 
                    vehicle : this.selected.quote.vehicle,
                    quote_data : this.journeyQuotes[this.selected.quote.id]
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

<style scoped>
    ::v-deep .modal-container {
        width: 55% !important;
    }
</style>

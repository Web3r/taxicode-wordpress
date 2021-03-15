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
            @c2aClick="onBookNowClicked"
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
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/TheSearchForm.vue';
    import TheSearchResults from 'BIQ/TheSearchResults.vue';
    // import the Stripe elements card form payment handler
    import QuotesRecommendedUpgrade from '@/common/BIQ/QuotesRecommendedUpgrade';

    export default {
        name: 'HomePage',

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
            'the-biq-search-results' : TheSearchResults
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
                quotesRecommendedUpgrade : new QuotesRecommendedUpgrade(
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
                // @todo determine if to offer the quote vehicle upgrade recommendation
                const quoteUpgradeOption = this.quotesRecommendedUpgrade.getRecommendationFor(this.journeyQuotes[quoteID], selectedVehicleIndex);
                if(this.debugging) {
                    console.group('Quote Upgrade Recommendation');
                    console.log('quoteUpgradeOption', quoteUpgradeOption);
                    console.log('props', quoteUpgradeOption.props());
                    console.groupEnd();
                }
                // update the state with the selected journey quote & vehicle
                this.bookNow({
                    quote : quoteID, 
                    vehicle : selectedVehicleIndex,
                    quote_data : this.journeyQuotes[quoteID]
                });
                // move to the checkout page to book the selected journey quote
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

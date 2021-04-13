<template>
    <div id="biq-home-page">
        <the-biq-search-form
            :biq-public-key="appSettings.biq_pk"
            :biq-places-lookup="placesLookup"
            :biq-quotes-from="quotesFrom"
            :search-on-load="searchOnLoad"
            :debugging="debugging"
            @submit="onQuotesSearchSubmit"
            @biqQuotesSearched="onQuotesSearched"
            @biqZeroQuotes="onZeroQuotes"
            @biqQuotesError="onQuotesError"
            layout="column"
        ></the-biq-search-form>

        <the-biq-search-results v-if="showResults" 
            :display-results-type="appSettings.quote_type"
            :debugging="debugging"
            @biqQuoteBookNow="onBookNowClicked"
        >
            <template #loading-quotes>
                <div class="d-flex">
                    <div class="spinner-border"></div>&nbsp;Generating&nbsp;Quotes...
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
            <template #body="{ upgrade }">
                <p>{{upgrade.description}}</p>
            </template>
        </biq-quote-upgrade-offer-modal>
    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that defines the common Page route Components
    import PagesMixin from 'mixins/PagesMixin';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/Search/TheSearchForm.vue';
    
    // define the Home Page component properties 
    // (inherits props from PagesMixin)
    const props = {
    };
    // define the Home Page component computed property methods 
    // (inherits computed property methods from PagesMixin)
    const computed = {
        ...mapGetters([
        // BIQ Quote Search state
            'searchOnLoad',
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

        placesLookup : function() {
            return `${this.appSettings.biq_api_host}${this.appConfig.biq.PLACES_URI}`;
        },

        quotesFrom : function() {
            return `${this.appSettings.biq_api_host}${this.appConfig.biq.QUOTE_URI}`;
        },

        showResults : function() {
            return (this.loadingQuotes || this.quotesError || this.quotesLoaded);
        },

        showRecommendedUpgrade : function() {
            return (this.appSettings.recommend_upgrade && this.show_upgrade);
        }
    };
    // define the Home Page component methods 
    // (inherits methods from PagesMixin)
    const methods = {
        ...mapActions([
        // BIQ Quote Search state
            'searchedQuotes', 
            'changeDisplayType', 
        // BIQ Quoting state
            'apiQuotesError', 
        // BIQ Book Now Checkout state
            'bookNow'
        ]),

        onQuotesSearchSubmit : function(evt) {
            const {
                validate,
                searchApiQuotes
            } = evt.data;
            // run the form validation & get the quotes if able
            if(validate()) {
                searchApiQuotes();
            }
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
            const recommendedUpgrade = evt.data.recommendedUpgrade;
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
    };

    export default {
        name: 'HomePage',
        props,
        computed,
        methods,

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
            'the-biq-search-results' : () => import(/* webpackChunkName: "BIQSearchResults", webpackPrefetch: true */ 'BIQ/TheSearchResults.vue'),
            'biq-quote-upgrade-offer-modal' : () => import(/* webpackChunkName: "BIQQuoteUpgradeOffer", webpackPrefetch: true */ 'BIQ/QuoteUpgradeOfferModal.vue')
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
            if(this.hasSearchResults) {
                // @todo validate that the cached state search results haven't expired
                // make sure that the search display state can still be used
                if(this.displayType !== this.appSettings.quote_type) {
                    // change the quote results display type & trigger the display results to be 
                    // recalculated based on the new display type
                    this.changeDisplayType(this.appSettings.quote_type);
                }
            }
        }
    };
</script>

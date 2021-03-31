<template>
    <div id="biq-vue-app">
        <router-view v-if="initialised" 
            :app-config="appConfig"
            :app-settings="appSettings" 
            :appRESTBase="appURL"
            :debugging="appDebugEnabled"
        ></router-view>
    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import AppsMixin from 'mixins/AppsMixin';
    // import the BIQ static config just in case and the settings formatter
    import { DEFAULT_STRIPE_CARD_STYLE, biqConf, biqSettings } from 'BIQ/config';

    export default {
        name : 'BIQApp',
        version : '1.0.1',

        mixins : [
            AppsMixin
        ],

        props : {
            biqAppConfig : {
                type : Object,
                required : true,
                default : function() { 
                    return {
                        biq : biqConf,
                        BOOKING_DETALS_URI : 'booking-details/?booking_ref='
                    };
                }
            }
        },

        data() {
            return {
                settings : {
                    biq_api_host : this.biqAppConfig.biq.LIVE_API_HOST,
                    biq_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : DEFAULT_STRIPE_CARD_STYLE,
                    booking_test_mode : false,
                    quote_type : '',
                    recommend_upgrade : false,
                    complete_page_text : ''
                }
            };
        },

        created() {
            // get the app settings from the backend
            this.getAppSettings();
        },

        computed : {
            ...mapGetters([
            // BIQ Quote Search state
                'searchDetails',
                'hasSearchResults',
                'displayType',
                'displayQuotes',
            // BIQ Quoting state
                'loadingQuotes', 
                'quotesError', 
                'quotesLoaded', 
                'zeroQuotes', 
                'journeyID', 
                'journeyDetails', 
                'journeyDate', 
                'journeyTime', 
                'journeyHasReturn', 
                'journeyReturnDate', 
                'journeyReturnTime', 
                'journeyHasVias', 
                'journeyQuotes',
            // BIQ Book Now Checkout state
                'processed',
                'processing',
                'basket',
                'quoteID',
                'vehicleIndex',
                'price',
                'quoteData',
                'quoteVehicleData',
                'bookingRef'
            ]),

            appConfig : function() {
                return { ...this.biqAppConfig };
            }
        },

        methods : {
            ...mapActions([
            // BIQ Quote Search state
                'resetSearch',
                'searchingQuotes', 
                'searchedQuotes',
                'changeDisplayType',
            // BIQ Quoting state
                'resetQuotes',
                'quoting', 
                'apiQuotesError',
                'quoted',
            // BIQ Book Now Checkout state
                'resetCheckout',
                'bookNow',
                'booking',
                'bookingFailed',
                'booked'
            ]),

            appSettingsUpdated : function(new_settings) {
                if(this.appDebugEnabled) {
                    console.group('Updating BIQ App Settings');
                    console.log('BIQ App Settings', {...this.settings});
                    console.log('New BIQ Settings', new_settings);
                }
                const settings = biqSettings(new_settings, this.appDebugEnabled);
                this.settings = settings;
                if(this.appDebugEnabled) {
                    console.info('Updated Settings');
                    console.log('Settings', settings);
                    console.log('BIQ App Settings', {...this.settings});
                    console.groupEnd();
                }
            }
        }
    };
</script>

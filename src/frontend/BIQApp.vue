<template>
    <div id="biq-vue-app">
        <router-view v-if="initialised" 
            :app-config="appConfig"
            :app-settings="appSettings" 
            :appRESTBase="appURL"
            :appAssetURL="appAssetURL"
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
    import { DEFAULT_STRIPE_CARD_STYLE, biqConf, updateAppSettings } from 'BIQ/config';

    // define the BIQ Frontend App release constants values
    const APP_VERSION = '1.0.1';
    const APP_NAME = 'BIQApp';
    const APP_TITLE = `Booking Instant Quotes v${APP_VERSION}`;

    // define the main BIQ Frontend App component properties 
    // (inherits props from AppsMixin)
    const props = {
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
    };
    // define the main BIQ Frontend App component computed property methods 
    // (inherits computed property methods from AppsMixin)
    const computed = {
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
    };
    // define the main BIQ Frontend App component methods 
    // (inherits methods from AppsMixin)
    const methods = {
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

        appSettingsUpdated : updateAppSettings
    };

    export default {
        name : APP_NAME,
        version : APP_VERSION,
        props,
        computed,
        methods,

        mixins : [
            AppsMixin
        ],

        data() {
            // need to extract the mixin data as this method destroys that object
            const mixinData = AppsMixin.data.call(this);
            return {
                // include the mixin data
                ...mixinData,
                // override the empty settings structure from the mixin
                settings : {
                    biq_api_host : this.biqAppConfig.biq.LIVE_API_HOST,
                    biq_pk : '',
                    mapbox_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : DEFAULT_STRIPE_CARD_STYLE,
                    booking_test_mode : false,
                    quote_type : '',
                    recommend_upgrade : false,
                    complete_page_text : ''
                },
                // component specific data
                app_title : APP_TITLE
            };
        },

        created() {
            // get the app settings from the backend
            this.getAppSettings();
        }
    };
</script>

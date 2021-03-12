<template>
    <div id="biq-vue-app">
        <router-view v-if="initialised" 
            :app-config="appConfig"
            :app-settings="appSettings" 
            :appRESTBase="biqAppURL"
            :debugging="biqAppDebugEnabled"
        ></router-view>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name : 'BIQApp',
        version : '1.0.1',

        props : {
            biqAppURL : {
                type : String,
                required : true,
                default : '//'
            },

            biqAppConfig : {
                type : Object,
                required : true,
                default : function() { 
                    return {
                        PLACES_URI : 'places/',
                        AUTH_URI : 'auth/',
                        QUOTE_URI : 'booking/quote/',
                        JOURNEY_URI : 'booking/journey/?id=',
                        CLIENT_SECRET_URI : 'booking/client_gateway_secret/',
                        PAYMENT_URI : 'booking/pay/',
                        BOOKING_DETALS_URI : 'booking-details/?booking_ref=',
                        PGH_CONF            : {
                            hidePostalCode  : true
                        },
                        useButtons : true
                    };
                }
            },

            biqAppDebugEnabled : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
                initialised : false,
                settings : {
                    biq_api_host : 'https://api.taxicode.com/',
                    biq_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : {
                        base : {
                            fontFamily : "'Muli', sans-serif",
                            fontSize : '14px',
                            color : '#333'
                        },
                        invalid : {
                            color : 'red'
                        }
                    },
                    quote_type : '',
                    complete_page_text : '',
                    custom_css : '',
                    booking_test_mode : false
                },
                config : this.biqAppConfig
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
                return { ...this.config };
            },

            appSettings : function() {
                return { ...this.settings };
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

            getAppSettings : function() {
                const app = this;
                const biq_app_settings_url = `${this.biqAppURL}settings-get/`;
                if(this.biqAppDebugEnabled) {
                    console.group(`Loading BIQ App Settings from '${biq_app_settings_url}'`);
                }
                axios.get(biq_app_settings_url)
                .then(response => {
                    if(app.biqAppDebugEnabled) {
                        console.log(response);
                        console.log({...app.settings});
                        // this is a string from the REST & doesn't parse to JSON well :(
                        // but the echoed string inside the script tag to be supplied as a prop to the
                        // Checkout Page view via the global window variable is an object.
                        // It's dirty, but needs must for now 2021
                        console.info(typeof(stripe_cardform_style));
                        console.log(stripe_cardform_style);
                        console.info(typeof(response.data.stripe_cardform_style));
                        console.log(response.data.stripe_cardform_style);
                        try {
                            console.log(JSON.parse(response.data.stripe_cardform_style));
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    const settings = {
                        biq_pk : response.data.taxicode_public,
                        biq_api_host : response.data.biq_api_host,
                        paypal_pk : response.data.paypal_public,
                        stripe_pk : response.data.stripe_public,
                        // this is a string from the REST & doesn't parse to JSON well :(
                        // but the echoed string inside the script tag to be supplied as a prop to the
                        // Checkout Page view via the global window variable is an object.
                        // It's dirty, but needs must for now 2021
                        stripe_cardform_style : app.stripe_cardform_style,
                        quote_type : response.data.quote_type,
                        complete_page_text : response.data.complete_page_text,
                        custom_css : response.data.custom_css,
                        booking_test_mode : (response.data.test_mode == '1')
                    };
                    // make sure the api host ends in a /
                    if(settings.biq_api_host.slice(-1) !== '/') {
                        settings.biq_api_host = settings.biq_api_host + '/';
                    }
                    app.settings = settings;
                    app.initialised = true;
                    if(app.biqAppDebugEnabled) {
                        console.info('Loaded Settings');
                        console.log({...app.settings});
                        console.groupEnd();
                    }
                })
                .catch(error => {
                    if(app.biqAppDebugEnabled) {
                        console.info('Settings Load Error');
                        console.log(error);
                        console.groupEnd();
                    }
                    console.error(error);
                });
            }
        }
    };
</script>

<template>
  <div id="biq-vue-app">
    <router-view v-if="initialised" 
        :debugging=biq_app_debug_enabled
        :appConfig=appConfig 
        :appSettings=appSettings 
        :appRESTBaseURL=biq_app_url
    />
  </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name : 'BIQApp',
        version : '1.0.1',

        props : {
            biq_app_debug_enabled : {
                type : Boolean,
                default : false
            },

            biq_app_url : {
                type : String,
                default : ''
            },

            biq_config : {
                type : Object,
                default : {
                    PLACES_URI : '/places/',
                    AUTH_URI : '/auth/',
                    QUOTE_URI : '/booking/quote/',
                    JOURNEY_URI : '/booking/journey/?id=',
                    CLIENT_SECRET_URI : '/booking/client_gateway_secret/',
                    PAYMENT_URI : '/booking/pay/',
                }
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

                config : {
                    PLACES_URI : '/places/?term=',
                    AUTH_URI : '/auth/',
                    QUOTE_URI : '/booking/quote/',
                    JOURNEY_URI : '/booking/journey/?id=',
                    CLIENT_SECRET_URI : '/booking/client_gateway_secret/',
                    PAYMENT_URI : '/booking/pay/',
                    BOOKING_DETALS_URI : 'booking-details/?booking_ref='
                }

            }
        },

        created() {
            this.getAppSettings();
            this.config = this.biq_config;
        },

        computed : {
            ...mapGetters([
            // BIQ Quote Search state
                'searchDetails',
                'displayQuotes',
            // BIQ Quoting state
                'loadingQuotes', 
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
            // BIQ Quoting state
                'resetQuotes',
                'quoting', 
                'apiQuotesError',
                'quoted',
            // BIQ Book Now Checkout state
                'resetCheckout',
                'bookNow',
                'booked'
            ]),

            getAppSettings : function() {
                const app = this;
                const biq_app_settings_url = `${this.biq_app_url}settings-get/`;
                if(this.biq_app_debug_enabled) {
                    console.info(`Loading BIQ App Settings from '${biq_app_settings_url}'`);
                }
                axios.get(biq_app_settings_url)
                .then(response => {
                    if(app.biq_app_debug_enabled) {
                        console.group("Loaded Settings");
                        console.info({...app.settings});
                        console.info({...response.data});
                        // this is a string from the REST & doesn't parse to JSON well :(
                        // but the echoed string inside the script tag to be supplied as a prop to the
                        // Checkout Page view via the global window variable is an object.
                        // It's dirty, but needs must for now 2021
                        console.log(typeof(stripe_cardform_style));
                        console.log(stripe_cardform_style);
                        console.log(typeof(response.data.stripe_cardform_style));
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
                    app.settings = settings;
                    app.initialised = true;
                    if(app.biq_app_debug_enabled) {
                        console.info({...settings});
                        console.info({...app.settings});
                        console.groupEnd();
                    }
                })
                .catch(error => {
                    let message = 'Unknown Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.info({...error});
                });
            }
        }
    };
</script>

<style scoped>

</style>

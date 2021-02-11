<template>
  <div id="biq-vue-app">
    <router-view v-if="initialised" 
        :debugging=biq_app_debug_enabled
        :appRESTBaseURL=biq_app_url
        :appConfig=appConfig 
        :appSettings=appSettings 
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
            biq_app_url : {
                type : String,
                default : ''
            },

            biq_app_debug_enabled : {
                type : Boolean,
                default : false
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
            },

            stripe_cardform_style : {
                type : Object,
                default : {
                    base : {
                        fontFamily : "'Muli', sans-serif",
                        fontSize : '14px',
                        color : '#333'
                    },
                    invalid : {
                        color : 'red'
                    }
                 }
            },
            
            paypal_client_token : {
                type : String,
                default : ''
            }
        },

        data() {
            return {
                initialised : false,

                settings : {
                    biq_api_host : 'https://api.taxicode.com/',
                    tc_pk : '',
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
                    PLACES_URI : '/places/',
                    AUTH_URI : '/auth/',
                    QUOTE_URI : '/booking/quote/',
                    JOURNEY_URI : '/booking/journey/?id=',
                    CLIENT_SECRET_URI : '/booking/client_gateway_secret/',
                    PAYMENT_URI : '/booking/pay/'
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
                'searchingQuotes', 
                'searchedQuotes',
            // BIQ Quoting state
                'quoting', 
                'quoted',
            // BIQ Book Now Checkout state
                'bookNow',
                'booked'
            ]),

            getAppSettings : function() {
                const app = this;
                const biq_app_settings_url = `${this.biq_app_url}settings-get/`;
                axios.get(biq_app_settings_url)
                .then(response => {
                    if(app.biq_app_debug_enabled) {
                        console.group(`Loading BIQ App Settings from '${biq_app_settings_url}'`);
                        console.info({...app.settings});
                        console.info({...response.data});
                        console.log(response.data.stripe_cardform_style);
                        console.log(typeof(response.data.stripe_cardform_style));
                        try {
                            // this is a string from the REST & doesn't parse to JSON well :(
                            console.log(response.data.stripe_cardform_style);
                            console.log(typeof(response.data.stripe_cardform_style));
                            console.log(JSON.parse(response.data.stripe_cardform_style));
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    const settings = {
                        tc_pk : response.data.taxicode_public,
                        biq_api_host : response.data.biq_api_host,
                        paypal_pk : response.data.paypal_public,
                        stripe_pk : response.data.stripe_public,
                        // this is a string from the REST & doesn't parse to JSON well :(
                        // so use the supplied prop version which is an object
                        stripe_cardform_style : app.stripe_cardform_style,
                        quote_type : response.data.quote_type,
                        complete_page_text : response.data.complete_page_text,
                        custom_css : response.data.custom_css,
                        booking_test_mode : response.data.test_mode
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

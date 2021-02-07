<template>
  <div id="biq-vue-app">
    <router-view />
  </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'BIQApp',

        props: {
            biq_app_settings_url : {
                type : String,
                default : ''
            },
            biq_config : {
                type : Object,
                default : {
                    PLACES_URI          : 'places/',
                    QUOTE_URI           : 'booking/quote/',
                    JOURNEY_URI         : 'booking/journey/?id=',
                    CLIENT_SECRET_URI   : 'booking/client_gateway_secret/',
                    PAYMENT_URI         : 'booking/pay/',
                }
            }
        },

        data () {
            return {
                settings : {
                    tc_pk : '',
                    paypal_public : '',
                    stripe_pk : '',
                    stripe_cardform_css : '',
                    quote_type : '',
                    complete_page_text : '',
                    custom_css : '',
                    booking_test_mode : false
                },

                config : {
                    PLACES_URI          : 'places/',
                    QUOTE_URI           : 'booking/quote/',
                    JOURNEY_URI         : 'booking/journey/?id=',
                    CLIENT_SECRET_URI   : 'booking/client_gateway_secret/',
                    PAYMENT_URI         : 'booking/pay/',
                }
            }
        },

        created() {
            this.getAppSettings();
            this.config = this.biq_config;
        },

        computed: mapGetters([
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
        // BIQ Quoted Journey state
        // Book Now Quote Checkout state
            'basket',
            'quoteID',
            'vehicleIndex',
            'price',
            'quoteData',
            'quoteVehicleData',
        ]),

        methods: {
            ...mapActions([
            // BIQ Quote Search state
                'searchingQuotes', 
                'searchedQuotes',
            // BIQ Quoting state
                'quoting', 
                'quoted',
                // Journey quoting state
                // Book Now Checkout state
                'bookNow',
                'booked'
            ]),

            getAppSettings : function() {
                const app = this;
                axios.get(this.biq_app_settings_url)
                .then(response => {
                    console.group(`Loading BIQ App Settings from ${app.biq_app_settings_url}`);
                    console.info({...app.settings});
                    console.info({...response.data});
                    const settings = {
                        tc_pk : response.data.taxicode_public,
                        paypal_public : response.data.paypal_public,
                        stripe_pk : response.data.stripe_public,
                        stripe_cardform_css : response.data.stripe_cardform_css,
                        quote_type : response.data.quote_type,
                        complete_page_text : response.data.complete_page_text,
                        custom_css : response.data.custom_css,
                        booking_test_mode : response.data.test_mode
                    };
                    app.settings = settings;
                    console.info({...settings});
                    console.info({...app.settings});
                    console.groupEnd();
                })
                .catch(error => {
                    console.error(error);
                });
            }
        }
    };
</script>

<style scoped>

</style>

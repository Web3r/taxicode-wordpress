<template src="./templates/Checkout.html"></template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';
    import StripeCardFormHandler from '@/common/StripeCardFormHandler.js';
    import JourneyDetails from '@/components/BIQ/JourneyDetails.vue';

    let cardFormHandler = null;

    export default {
        name : "Checkout",

        components : {
            'BIQ-JourneyDetails' : JourneyDetails,
        },

        props : {
            debugging : {
                type : Boolean,
                default : false
            },

            appConfig : {
                type : Object,
                required : true,
                default : null
            },

            appSettings : {
                type : Object,
                required : true,
                default : null
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
                name : '',
                email : '',
                telephone : '',
                flight_number : null,
                cardholder_name : '',
                billing_postcode : '',
                payment_method : 'Pay with Card',
                payment_options : [
                    'Pay with Card', 
                    'Pay with Paypal'
                ],
                loading : false,
                posterror : false,
                errors : {
                    name : false,
                    email : false,
                    telephone : false,
                },
            }
        },

        mounted() {
            this.setupStripe();
            cardFormHandler.mountElement();
        },

        computed: mapGetters([
        // BIQ Quoting state
            'journeyID', 
        // BIQ Book Now Checkout state
            'basket',
            'quoteID',
            'vehicleIndex',
            'price'
        ]),

        methods: {
            ...mapActions([
            // BIQ Quoting state
                'quoting', 
                'quoted',
            // BIQ Book Now Checkout state
                'bookNow'
            ]),

            isCardPayment : function() {
                return (this.payment_method == 'Pay with Card');
            },

            validate : function() {
                // reset the common validation error flags
                this.errors = {
                    name : false,
                    email : false,
                    telephone : false
                }
                // just keep a track of any errors
                let errors = 0;
                // check the required fields for invalid input
                if(this.name == '') {
                    this.errors.name = 'Booking name must be set';
                    errors++;
                }
                if(this.email == '') {
                    this.errors.email='Email location must be set';
                    errors++;
                }
                if(this.telephone == '') {
                    this.errors.telephone = 'Telephone must be set';
                    errors++;
                }
                if(this.isCardPayment()) {
                // card payment transactions have additional fields to validate
                    // set / reset / add the validation error flags for the addition field names
                    this.errors.cardholder_name = false;
                    this.errors.billing_postcode = false;
                    // check the required fields for invalid input
                    if(this.cardholder_name == '') {
                        this.errors.cardholder_name = 'Cardholder name must be set';
                        errors++;
                    }
                    if(this.billing_postcode == '') {
                        this.errors.billing_postcode = 'Billing address postcode must be set';
                        errors++;
                    }
                    
                }
                // only valid if no errors encountered
                return (errors == 0);
            },

            logFormValidateError : function(log_title, errors) {
                if(this.debugging) {
                    console.group(log_title);
                    console.info({...errors});
                    console.groupEnd();
                }
            },

            onMethodChanged : function() {
                if(this.isCardPayment()) {
                    this.$nextTick(function() {
                        cardFormHandler.mountElement();
                    });
                } else {
                    cardFormHandler.unmountElement();
                }
            },

            onPaypalSubmit : function(payload) {
                if(this.validate()) {
                    this.posterror = false;
                    // set the flag to indicate the booking checkout transaction is in progress
                    this.loading = 1;
                    this.makeBooking(payload.nonce, 'paypal');
                } else {
                    this.logFormValidateError("BIQCheckoutForm Paypal Validation Error", this.errors);
                }
            },

            onPaypalError : function(error) {
                let message = 'BIQCheckoutForm Unknown Paypal Error';
                if(error.hasOwnProperty('message') && error.message) {
                    message = error.message;
                }
                console.error(message);
                console.info({...error});
            },

            onPaypalLoadFail : function(error) {
                let message = 'BIQCheckoutForm Unknown Paypal Loading Error';
                if(error.hasOwnProperty('message') && error.message) {
                    message = error.message;
                }
                console.error(message);
                console.info({...error});
            },

            onStripeSubmit : function() {
                if(this.validate()) {
                    this.posterror = false;
                    this.loading = 1;
                    // the card form handler has a success & error callback set (see the created method)
                    cardFormHandler.getSourceCardToken(
                        this.appSettings.biq_pk, 
                        this.quoteID, 
                        this.vehicleIndex, 
                        this.cardholder_name, 
                        this.billing_postcode
                    );
                } else {
                    this.logFormValidateError("BIQCheckoutForm Stripe Validation Error", this.errors);
                }
            },

            setupStripe : function() {
                const page = this;
                /** create a new stripe card form payment option */
                cardFormHandler = new StripeCardFormHandler(
                /** The Stripe public key */
                        this.appSettings.stripe_pk,
                /** The transaction success handler */
                        function(handler, paymentIntent) {
                            page.makeBooking(paymentIntent.id, handler.getHandlerName(), function(formData) {
                                if(page.debugging) {
                                    console.log(paymentIntent);
                                }
                                // add the API field values for additional payment related data
                                formData.append('card_cardholder', page.cardholder_name);
                                // @todo Add the additional card field values from the 
                                // payment intent response
                                // - card_type
                                // - card_number (xxxxxxxxxxxx1234)
                                // - card_expiry
                                // - card_address1 (if available?)
                                formData.append('postcode', page.billing_postcode);
                                // - city (if available?)
                            });
                        },
                /** The transaction failed handler */
                        function(handler, error) {
                            let message = 'Unknown Stripe Error';
                            if(error.hasOwnProperty('message') && error.message) {
                                message = error.message;
                            }
                            console.error(message);
                            console.info({...error});
                            page.loading = 0;
                            page.hasCardErrors = true;
                            page.posterror = message;
                            // Forcing the DOM to update so the Stripe Element can update.
                            page.$forceUpdate();
                        },
                /** The URI to get the client secret from */
                        `${this.appSettings.biq_api_host}${this.appConfig.CLIENT_SECRET_URI}`
                    );
                cardFormHandler.setAmount(this.price, "Taxi Journey");
                cardFormHandler.initialise(
                    this.$refs.card.id, 
                    this.stripe_cardform_style, 
                    this.appConfig.PGH_CONF.hidePostalCode
                );
            },

            makeBooking : function(token, method, formdataAppend) {
                const page = this;
                // this is a bit annoying - our API can't handle standard axios requests on POST
                // for some reason, so I've had to abandon my form class and hand crank this
                // request.
                const formData = new FormData();
                formData.append('key', this.appSettings.biq_pk);
                formData.append('quote', this.quoteID);
                formData.append('vehicle', this.vehicleIndex);
                formData.append('new_pay', true);
                formData.append('email', this.email);
                formData.append('name', this.name);
                formData.append('telephone', this.telephone);
                formData.append('payment_token', token);
                formData.append('method', method);
                if(typeof(formdataAppend) == 'function') {
                // allow the calling method to add payment method specific fields to the API call
                    formdataAppend(formData);
                }
                if(this.appSettings.booking_test_mode) {
                // make the booking in test mode
                    formData.append('test', '1');
                }
                const apiCheckoutURL = `${this.appSettings.biq_api_host}${this.appConfig.PAYMENT_URI}`;
                if(this.debugging) {
                    console.info(`BIQ Checkout transaction attempt to API '${apiCheckoutURL}'`);
                }
                axios.post(apiCheckoutURL, formData, {
                    headers: {
                        'Content-Type': 'application/application/x-www-form-urlencoded',
                    }
                })
                .then(response => {
                    if(response.data.status == 'OK') {
                        page.$router.push({ 
                            name: 'Complete', 
                            params: { 
                                booking_ref: response.data.reference 
                            } 
                        });
                    } else {
                        page.posterror = response.data.error;
                        page.loading = 0;
                    }
                })
                .catch(function (error) {
                    let message = 'Unknown BIQ Checkout API Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.info({...error});
                    page.loading = 0;
                });
            }
        }
    };
</script>

<style scoped>
    .stripe-card-container {
        font-size : 1.6rem !important;
        letter-spacing: -0.015em !important;
        padding: 8px !important;
    }
</style>

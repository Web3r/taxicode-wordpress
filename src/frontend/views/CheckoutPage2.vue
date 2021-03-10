<template src="./templates/CheckoutPage.html"></template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the component to display the journey details being booked
    import PassengerDetailsForm from 'BIQ/Forms/PassengerDetailsForm.vue';
    // import the component to display the journey details being booked
    import TheCheckoutForm from 'BIQ/Forms/TheCheckoutForm.vue';
    // import the component to display the journey details being booked
    import StripeCardPayment from 'BIQ/Forms/Payment/StripeCardPayment.vue';
    // import the component to display the journey details being booked
    import QuotedJourneyDetails from 'BIQ/QuotedJourneyDetails.vue';
    // import the component to disply the 1-click-processing form submit button
    import ProcessFormSubmit from 'BIQ/Forms/ProcessFormSubmit.vue';

    const PAYMENT_METHOD_OPTION_CARD = 'Pay with Card';
    const PAYMENT_METHOD_OPTION_PAYPAL = 'Pay with Paypal';

    export default {
        name : 'CheckoutPage',

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-checkout-form' : TheCheckoutForm,
            'biq-passenger-details-form-section' : PassengerDetailsForm,
            'stripe-card-payment' : StripeCardPayment,
            'biq-process-form-submit' : ProcessFormSubmit,
            'biq-quoted-journey-details' : QuotedJourneyDetails
        },

        props : {
            stripe_cardform_style : {
                type : Object,
                required : true,
                default : function() { 
                    return {
                        base : {
                            fontFamily : "'Muli', sans-serif",
                            fontSize : '14px',
                            color : '#333'
                        },
                        invalid : {
                            color : 'red'
                        }
                    };
                 }
            },
            
            paypalClientToken : {
                type : String,
                required : true,
                default : ''
            }
        },

        data() {
            return {
                payment_options : [
                    PAYMENT_METHOD_OPTION_CARD, 
                    PAYMENT_METHOD_OPTION_PAYPAL
                ],
                payment_method : PAYMENT_METHOD_OPTION_CARD,
                paypal_setup : {
                    flow :'checkout',
                    amount : this.price,
                    currency : 'GBP'
                },
                loading : false,
                posterror : false,
                errors : {}
            };
        },

        computed: {
            ...mapGetters([
            // BIQ Quoting state
                'journeyID', 
            // BIQ Book Now Checkout state
                'processing',
                'basket',
                'quoteID',
                'vehicleIndex',
                'price'
            ]),

            isCardPayment : function() {
                return (this.payment_method == PAYMENT_METHOD_OPTION_CARD);
            },

            isPaypalPayment : function() {
                return (this.payment_method == PAYMENT_METHOD_OPTION_PAYPAL);
            }
        },

        methods: {
            ...mapActions([
            // BIQ Quoting state
                'quoting', 
                'quoted',
            // BIQ Book Now Checkout state
                'bookNow'
            ]),

            validate : function() {
                // reset the common validation error flags
                let errors = 0;
                let validation_errors = {};
                // validate the passenger details form section
                if(!this.$refs.passengerForm.validate()) {
                    validation_errors = {
                        ...validation_errors,
                        ...this.$refs.passengerForm.validationErrors()
                    }
                    errors++;
                }
                // validate the card payment form section
                if(this.isCardPayment) {
                    if(!this.$refs.card.validate()) {
                        validation_errors = {
                            ...validation_errors,
                            ...this.$refs.card.validationErrors()
                        }
                        errors++;
                    }
                }
                // set any validation errors
                this.errors = validation_errors;
                // only valid if no errors encountered
                return (errors == 0);
            },

            logFormValidateError : function(log_title, errors) {
                if(this.debugging) {
                    console.group(log_title);
                    console.log({...errors});
                    console.groupEnd();
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
                console.log({...error});
            },

            onPaypalLoadFail : function(error) {
                let message = 'BIQCheckoutForm Unknown Paypal Loading Error';
                if(error.hasOwnProperty('message') && error.message) {
                    message = error.message;
                }
                console.error(message);
                console.log({...error});
            },

            onStripeSubmit : function(event) {
                if(this.validate()) {
                    this.posterror = false;
                    this.loading = 1;
                    const cardDetails = this.$refs.card.inputValues();
                    const { paymentHandler } = event.data;
                    // the card form handler has a success & error callback set 
                    // (see the created method)
                    paymentHandler.getSourceCardToken(
                        this.appSettings.biq_pk, 
                        this.quoteID, 
                        this.vehicleIndex, 
                        cardDetails.cardholder_name, 
                        cardDetails.billing_postcode
                    );
                } else {
                    this.logFormValidateError("BIQCheckoutForm Stripe Validation Error", this.errors);
                }
            },

            onStripeSuccess : function(event) {
                const { paymentHandler, paymentIntent } = event.data;
                const page = this;
                this.makeBooking(paymentIntent.id, paymentHandler.getHandlerName(), function(formData) {
                    if(page.debugging) {
                        console.log({...paymentIntent});
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

            onStripeError : function(event) {
                const { error } = event.data;
                const page = this;
                console.error(error.message);
                console.log({...error});
                page.loading = 0;
                page.hasCardErrors = true;
                page.posterror = error.message;
                // Forcing the DOM to update so the Stripe Element can update.
                page.$forceUpdate();
            },

            makeBooking : function(token, method, formdataAppend) {
                const page = this;
                const formData = this.assembleData(token, method, formdataAppend);
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
                        page.$router.replace({ 
                            name: 'CompletePage', 
                            params: { 
                                booking_ref: response.data.reference 
                            } 
                        });
                    } else {
                        page.posterror = response.data.error;
                        page.loading = 0;
                    }
                })
                .catch(error => {
                    let message = 'Unknown BIQ Checkout API Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.log({...error});
                    page.loading = 0;
                });
            },

            assembleData : function(token, method, formdataAppend) {
                // this is a bit annoying - our API can't handle standard axios requests on POST
                // for some reason, so I've had to abandon my form class and hand crank this
                // request.
                const formData = new FormData();
                const passengerDetails = this.$refs.passengerForm.inputValues();
                console.log(passengerDetails);
                formData.append('key', this.appSettings.biq_pk);
                formData.append('quote', this.quoteID);
                formData.append('vehicle', this.vehicleIndex);
                formData.append('new_pay', true);
                formData.append('email', passengerDetails.email);
                formData.append('name', passengerDetails.name);
                formData.append('telephone', passengerDetails.telephone);
                formData.append('payment_token', token);
                formData.append('method', method);
                if(typeof(formdataAppend) == 'function') {
                // allow the calling method to add payment method specific fields to the API call
                    formdataAppend(formData);
                }
                if(passengerDetails.flight_number) {
                    formData.append('flight_number', passengerDetails.flight_number);
                }
                if(this.appSettings.booking_test_mode) {
                // make the booking in test mode
                    formData.append('test', '1');
                }
                return formData;
            }
        }
    };
</script>

<style scoped>
    ::v-deep .stripe-card-container {
        font-size : 1.6rem !important;
        letter-spacing: -0.015em !important;
        padding: 8px !important;
    }
</style>

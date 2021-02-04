<template src="./templates/Checkout.html"></template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';
    import StripeCardFormHandler from 'common/StripeCardFormHandler';

    export default {
        name: "Checkout",
        props: {
            cardFormHandler : {
                type : Object,
                default : null
            }
        },
        data() {
            return {
                name: '',
                email: '',
                telephone: '',
                flight_number: null,
                cardholder_name: '',
                billing_postcode: '',
                errors: {
                    name: false,
                    email: false,
                    telephone: false,
                },
                test_mode: 0,
                loading: false,
                payment_method: 'Pay with card',
                payment_options: ['Pay with card','Pay with Paypal'],
                posterror: false,
            }
        },

        created() {
            const checkout = this;
            //paypayl token and test mode are set in page JS
            // before vue load, and imported here
            this.paypal_token = paypal_token;
            this.test_mode = test_mode;
            axios.get(config.JOURNEY_URL+this.journeyID+'&include_quote=true')
            .then(function(response) {
                console.log(response.data);
                checkout.journey_data = response.data.journey;
            }.bind(this));
            /** create a new stripe card form payment option */
            this.cardFormHandler = new StripeCardFormHandler(
            /** The Stripe public key */
                    // Stripe public key is set in the page JS 
                    // before vue load, and imported here
                    gateway_api_key,
            /** The transaction success handler */
                    function(handler, paymentIntent) {
                        checkout.makeBooking(paymentIntent.id, handler.getHandlerName(), function(formData) {
                            console.log(paymentIntent);
                            // add the API field values for additional payment related data
                            formData.append('card_cardholder', checkout.cardholder_name);
                            // @todo Add the additional card field values from the 
                            // payment intent response
                            // - card_type
                            // - card_number (xxxxxxxxxxxx1234)
                            // - card_expiry
                            // - card_address1 (if available?)
                            formData.append('postcode', checkout.billing_postcode);
                            // - city (if available?)
                        });
                    },
            /** The transaction failed handler */
                    function(handler, error) {
                        checkout.loading = 0;
                        checkout.hasCardErrors = true;
                        checkout.posterror = error.message;
                        checkout.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                    },
            /** The URI to get the client secret from */
                    config.CLIENT_SECRET_URL
                );
            this.cardFormHandler.initialise(this.$refs.card.id, stripe_cardform_css, config.PGH_CONF.hidePostalCode);
            console.log("created");
        },

        mounted: function () {
            this.cardFormHandler.setAmount(this.price, "Taxi journey");
            this.cardFormHandler.mountElement();
            console.log("mounted");
        },

        computed: mapGetters([
            // Journey quoting state
            'loadingQuotes', 
            'quotesLoaded', 
            'zeroQuotes', 
            'journeyID', 
            'journeyDetails', 
            'journeyQuotes',
            'displayQuotes',
            // Book Now Checkout state
            'basket',
            'quoteID',
            'vehicleIndex',
            'price',
            'quoteData',
            'quoteVehicleData',
        ]),

        methods: {
            ...mapActions([
                // Journey quoting state
                'quoting', 
                'quoted',
                // Book Now Checkout state
                'bookNow'
            ]),

            isCardPayment : function() {
                return (this.payment_method == 'Pay with card');
            },

            validate: function() {
                // reset the common validation error flags
                this.errors = {
                    name: false,
                    email: false,
                    telephone: false
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

            onMethodChanged : function() {
                if(this.isCardPayment()) {
                    const self = this;
                    this.$nextTick(function() {
                        self.cardFormHandler.mountElement();
                    });
                } else {
                    this.cardFormHandler.unmountElement();
                }
            },

            onPaypalSubmit: function(payload) {
                if(this.validate()) {
                    this.posterror = false;
                    this.loading = 1;
                    this.makeBooking(payload.nonce, 'paypal')
                }
            },

            onPaypalError: function(error) {
                console.error(error);
            },

            onLoadFail: function(error){
                console.error(error);
            },

            onStripeSubmit: function() {
                if(this.validate()) {
                    this.posterror = false;
                    this.loading = 1;
                    // the card form handler has a success & error callback set (see the created method)
                    this.cardFormHandler.getSourceCardToken(tc_public_key, this.quoteID, this.vehicleIndex, this.cardholder_name, this.billing_postcode);
                }
            },

            makeBooking: function(token, method, formdataAppend) {
                // this is a bit annoying - our API can't handle standard axios requests on POST
                // for some reason, so I've had to abandon my form class and hand crank this
                // request.
                const self = this;
                const formData = new FormData();
                formData.append('key',tc_public_key);
                formData.append('quote', this.quoteID);
                formData.append('vehicle', this.vehicleIndex);
                formData.append('test', this.test_mode);
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
                axios.post(config.PAYMENT_URL,formData,{
                    headers: {
                        'Content-Type': 'application/application/x-www-form-urlencoded',
                    }
                }).then(function(response) {
                    if(response.data.status == 'OK') {
                        this.$router.push( { name: 'Complete', params: { booking_ref: response.data.reference } })
                    } else {
                        this.posterror = response.data.error;
                        this.loading=0;
                    }
                }.bind(this))
                .catch(function (error) {
                    this.loading = 0;
                }.bind(this));
            }
        }
    }
</script>

<style scoped>

</style>

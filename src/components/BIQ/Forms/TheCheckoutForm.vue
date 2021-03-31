<template>
    <div>
        <form id="purchaseform">
            <biq-passenger-details-form-section
                ref="passengerForm"
                :debugging="debugging"
            ></biq-passenger-details-form-section>

            <div class="row">
                <div class="col">
                    <h4 id="tc_plugin-payment-heading">{{payment_heading}}</h4>
                </div>
            </div>

            <div class="row">
                <div 
                    :id="fields.method.id" 
                    class="col"
                >{{fields.method.label}}</div>
                <div class="col">
                    <b-form-select 
                        v-model="fields.method.selected" 
                        :options="fields.method.options" 
                        :disabled="processing"
                    ></b-form-select>
                </div>
            </div>
            
            <stripe-card-payment v-if="isCardPayment"
                ref="cardForm"
                :app-config="appConfig"
                :app-settings="appSettings" 
                :processing="processing"
                :amount="price"
                :descriptor="transaction_descriptor"
                :stripe-card-form-style="stripeCardFormStyle"
                :debugging="debugging"
                @submit="onSubmit"
                @transactionSuccess="onTransactionSuccess"
                @transactionError="onTransactionError"
                id="tcplugin-stripe-card-details"
                label="Card Details"
            ></stripe-card-payment>

            <paypal-payment v-else-if="isPaypalPayment"
                ref="paypalForm"
                :authorization="paypalClientToken"
                :processing="processing"
                :amount="price"
                :descriptor="transaction_descriptor"
                :debugging="debugging"
                :useButtons="appConfig.useButtons"
                @submit="onSubmit"
                @transactionSuccess="onTransactionSuccess"
                @transactionError="onTransactionError"
                id="tcplugin-paypal-plugin"
                label="Or Pay With Paypal"
            ></paypal-payment>

            <div v-else
                class="row"
            >
                <div class="col"></div>
                <div class="col"></div>
            </div>
        </form>

        <div v-if="has_errors" 
            class="row"
        >
            <slot 
                name="checkout-error" 
                :error="{ message : error_message }"
            >
                <div 
                    id="tcplugin-payment-error" 
                    class="col"
                >{{error_message}}</div>
            </slot>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';
    // import the component for the passenger details form section of the checkout
    import PassengerDetailsForm from 'BIQ/Forms/PassengerDetailsForm.vue';
    // import the component to handle stripe card element transaction payment method form section of the checkout
    import StripeCardPayment from 'BIQ/Forms/Payment/StripeCardPayment.vue';
    // import the component to handle paypal transaction payment method form section of the checkout
    import PaypalPayment from 'BIQ/Forms/Payment/PaypalPayment.vue';

    const PAYMENT_TYPE_CARD = 'Pay with Card';
    const PAYMENT_TYPE_PAYPAL = 'Pay with Paypal';

    // define the list of events the component emits & can be listened for on the checkout form
    const emitEvents = {
        // when the BIQ Checkout form is submitted
        biqCheckoutSubmit : {
            name : 'biqCheckoutSubmit'
        },
        // when the BIQ Checkout process completes successfully & the booking is made
        biqCheckoutComplete : {
            name : 'biqCheckoutComplete'
        },
        // when the BIQ Checkout process fails (transaction error or BIQ API Booking error)
        biqCheckoutError : {
            name : 'biqCheckoutError'
        }
    };

    export default {
        name : 'TheCheckoutForm',

        mixins : [
            ValidatesMixin
        ],

        components : {
            'biq-passenger-details-form-section' : PassengerDetailsForm,
            'stripe-card-payment' : StripeCardPayment,
            'paypal-payment' : PaypalPayment
        },

        props : {
            appConfig : {
                type : Object,
                required : true,
                default : function() { 
                    return null;
                }
            },

            appSettings : {
                type : Object,
                required : true,
                default : function() { 
                    return null;
                }
            },
            
            stripeCardFormStyle : {
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
            },
            
            processing : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
                payment_heading : 'Payment Details',
                transaction_descriptor : 'Taxi Journey',
                has_errors : false,
                error_message : '',
                validation_errors : {},
                fields : {
                    method : {
                        selected : PAYMENT_TYPE_CARD,
                        options : [
                            PAYMENT_TYPE_CARD, 
                            PAYMENT_TYPE_PAYPAL
                        ],
                        label : 'Select Payment Method:',
                        errorMsg : 'Cardholder name must be set',
                        id : 'tcplugin-payament-select'
                    }
                }
            };
        },

        computed: {
            ...mapGetters([
            // BIQ Quoting state
                'journeyID', 
            // BIQ Book Now Checkout state
                'processed',
                'basket',
                'quoteID',
                'vehicleIndex',
                'price'
            ]),

            isCardPayment : function() {
                return (this.fields.method.selected === PAYMENT_TYPE_CARD);
            },

            isPaypalPayment : function() {
                return (this.fields.method.selected === PAYMENT_TYPE_PAYPAL);
            },

            formSections : function() {
                // define the common form sections used
                const sections = ['passengerForm'];
                // determine which payment form section is being used
                // Paypal doesn't have additional fields or a validate method
                switch(this.fields.method.selected) {
                    case PAYMENT_TYPE_CARD : 
                        sections.push('cardForm');
                    break;
                }
                // return the list of form section refs
                return sections;
            }
        },

        methods : {
            ...mapActions([
            // BIQ Quoting state
                'quoting', 
                'quoted',
            // BIQ Book Now Checkout state
                'bookNow',
                'booking',
                'booked',
                'bookingFailed'
            ]),

            onSubmit : function(event) {
                // just make sure no double submit
                if(this.processing) {
                    return;
                }
                // update the processing state flags
                this.booking();
                // validate the checkout form
                if(!this.validate()) {
                    if(this.debugging) {
                        console.group(`BIQ CheckoutForm '${event.data.source}' Validation Error`);
                        console.log(event);
                        console.log(this.validation_errors);
                        console.groupEnd();
                    }
                    // update the processing state flags
                    this.bookingFailed();
                    return false;
                }
                if(this.debugging) {
                    console.group(`BIQ CheckoutForm '${event.data.source}' Submit Event`);
                    console.log(event);
                    console.groupEnd();
                }
                this.error_message = '';
                this.validation_errors = {};
                this.has_errors = false;
                let setup = null;
                // determine which payment handler was used
                switch(event.data.source) {
                    case 'paypal' :
                        // yeah, paypal only get's this far is it has the money lol so just
                        // add the success event so the event flow is consistent again
                        setup = { 
                            ...event 
                        };
                        // the payment handler has a success & error event callbacks assigned
                        // (see the component for details)
                        return event.data.paymentHandler.getTransactionToken(
                            this.appSettings.biq_pk, 
                            this.quoteID, 
                            this.vehicleIndex, 
                            setup
                        );
                    case 'stripe' : 
                    // hook in & get the stripe client secret for the backend created payment intent
                    // to allow the front end client to SCA the transaction
                        setup = { 
                            ...this.$refs.cardForm.inputValues() 
                        };
                        // the payment handler has a success & error event callbacks assigned
                        // (see the component for details)
                        return event.data.paymentHandler.getTransactionToken(
                            this.appSettings.biq_pk, 
                            this.quoteID, 
                            this.vehicleIndex, 
                            setup
                        );
                    default :
                    // just allow the event to bubble
                        // trigger the submit event to allow for full form validation
                        return this.$emit(emitEvents.biqCheckoutSubmit.name, event);
                }
            },
            
            onTransactionSuccess : function(event) {
                const { 
                    paymentHandler, 
                    paymentIntent, 
                    formdataAppend 
                } = event.data;
                // we have all the details now to make the booking through the API pay method
                this.makeBooking(paymentIntent.id, paymentHandler.getHandlerName(), formdataAppend)
            },

            onTransactionError : function(event) {
                this.error_message = event.data.error.message;
                this.has_errors = true;
                // never got as far as trying to make the booking
                event.data.booking = null;
                // update the processing state flags to allow another attempt
                this.bookingFailed();
                // trigger the checkout error event so the page can inform the user
                this.$emit(emitEvents.biqCheckoutError.name, event);
            },

            validate : function() {
                // reset the common validation error flags
                let errors = 0;
                let validation_errors = {};
                // validate the BIQ Checkout form sections
                this.formSections.forEach(section => {
                    if(!this.$refs[section].validate()) {
                        validation_errors = {
                            ...validation_errors,
                            ...this.$refs[section].validationErrors()
                        }
                        errors++;
                    }
                });
                // set any validation errors
                this.validation_errors = validation_errors;
                // only valid if no errors encountered
                return (errors == 0);
            },

            makeBooking : function(token, method, formdataAppend) {
                const self = this;
                // create the form data payload for the API pay call
                const formData = this.assembleData(token, method, formdataAppend);
                const apiCheckoutURL = `${this.appSettings.biq_api_host}${this.appConfig.PAYMENT_URI}`;
                if(this.debugging) {
                    console.info(`BIQ Checkout transaction attempt to API '${apiCheckoutURL}'`);
                }
                // make the API pay request
                axios.post(apiCheckoutURL, formData, {
                    headers: {
                        'Content-Type': 'application/application/x-www-form-urlencoded',
                    }
                })
                .then(response => {
                    if(response.data.status != 'OK') {
                    // throw new error event & let the catch() handle creating the event
                        // there's nothing usable in the response except the error
                        throw new ErrorEvent(response.data.status, {
                            error : new Error('BIQ API Checkout Error'),
                            message : response.data[response.data.status.toLowerCase()]
                        });
                    }
                    // checkout is complete & the journey booked
                    self.checkoutComplete(response.data);
                })
                .catch(error => {
                    self.has_errors = true;
                    self.error_message = error.message || 'Unknown BIQ API Checkout Error';
                    // update the processing state flags
                    this.bookingFailed();
                    // create the error event data
                    const event = {
                        data : {
                            type : 'booking',
                            booking : {
                                URL : apiCheckoutURL,
                                refunded : false, 
                                token, 
                                method, 
                                formData
                            },
                            error
                        }
                    };
                    // trigger the checkout error event, a refund will be needed
                    self.$emit(emitEvents.biqCheckoutError.name, event);
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
            },

            checkoutComplete : function(data) {
                // get a local reference to be used in the function attached to the event 
                // being triggered to allow the listener to update the state after leaving 
                // the checkout & keeping the submit button disabled until the last second
                const bookedState = this.booked;
                // create an event object
                const event = {
                    // define an on route complete function to trigger the 'booked' state change and 
                    // reset the checkout data to reduce possibility of accidental double checkout.
                    updateCheckoutState : () => bookedState({ booking_ref : data.reference }),
                    data : {
                        booking_ref : data.reference,
                        status : data.status
                    }
                };
                // trigger the checkout complete success event so the checkout page can move 
                // to the complete page & update the booked state of the checkout
                this.$emit(emitEvents.biqCheckoutComplete.name, event);
            }
        }
    };
</script>

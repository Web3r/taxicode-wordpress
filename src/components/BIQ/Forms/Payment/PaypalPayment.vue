<template>
    <div class="row">
        <div class="col"></div>
        
        <div 
            :id="id" 
            class="col"
        >
            <div class="form-group">
                <label 
                    for="paypal" 
                    class="control-label"
                >{{label}}</label>

                <v-braintree
                    :authorization="authorization"
                    :paypal="setup"
                    @success="onTransactionSuccess"
                    @error="onTransactionError"
                    @loadFail="onLoadFail"
                >
                    <template #button="slotProps">
                        <div class="form-group">
                            <biq-process-form-submit 
                                :processing="processing"
                                @click.prevent="slotProps.submit"
                                style-class="btn-primary"
                                label="Book Now"
                            ></biq-process-form-submit>
                        </div>
                    </template>
                </v-braintree>
            </div>
        </div>
    </div>
</template>

<script>
    // import the list of events the component emits & can be listened for on the payment form
    import { paymentEvents as emitEvents } from '@/common/BIQ/QuoteCheckout';
    // import the Stripe elements card form payment handler
    import PaypalHandler from '@/common/BIQ/PaymentHandlers/PaypalHandler';
    // import the component to disply the 1-click-processing form submit button
    import ProcessFormSubmit from 'BIQ/Forms/ProcessFormSubmit.vue';

    // component explicitly implements the "mixins/ValidatesMixin" interface as it differs somewhat
    export default {
        name : 'PaypalPayment',

        components : {
            'biq-process-form-submit' : ProcessFormSubmit
        },

        props : {
            authorization : {
                type : String,
                required : true,
                default : ''
            },
            
            processing : {
                type : Boolean,
                default : false
            },
            
            amount : {
                type : Number,
                required : true,
                default : 0
            },

            descriptor : {
                type : String,
                default : ''
            },

            id : {
                type : String,
                default : 'biq-paypal-plugin'
            },

            name : {
                type : String,
                default : 'paypal'
            },

            label : {
                type : String,
                default : 'Pay With Paypal'
            },

            debugging : {
                type : Boolean,
                default : false
            },

            useButtons : {
                type : Boolean,
                default : true
            }
        },

        data() {
            return {
                setup : {
                    flow :'checkout',
                    amount : this.amount,
                    currency : 'GBP'
                },
                // create a new paypal payment option handler
                paymentHandler : new PaypalHandler(
                    this.onHandlerSuccess,
                    this.onHandlerError,
                    this.debugging
                ),
                error : false,
                error_message : ''
            };
        },

        mounted() {
            // set the transaction amount
            this.paymentHandler.setAmount(
                this.amount, 
                this.descriptor
            );
        },

        methods: {
            onHandlerSuccess : function(paymentHandler, paymentIntent) {
                // add the success event data, including the completed payment intent transaction
                // we have the money, but no booking created yet!
                const event = {
                    data : {
                        source : this.name,
                        type : 'transaction',
                        paymentHandler,
                        paymentIntent,
                        formdataAppend : (formData) => formData
                    }
                };
                // trigger the transaction success event
                this.$emit(emitEvents.transactionSuccess.name, event);
            },

            onHandlerError : function(paymentHandler, error) {
                // make sure the error has a message
                if(!error.hasOwnProperty('message') || !error.message) {
                    error.message = 'Unknown Paypal Error';
                }
                // add the error event data
                const event = {
                    data : {
                        source : this.name,
                        type : 'transaction',
                        paymentHandler,
                        error
                    }
                };
                 // trigger the error event
                this.$emit(emitEvents.transactionError.name, event);
            },

            onTransactionSuccess : function(event) {
                // @todo this is automatically called by the braintree component, but our form
                //       validation hasn't been run yet
                if(this.debugging) {
                    console.group('Paypal transaction succeeded event');
                    console.log(event);
                    console.groupEnd();
                }
                // just make sure no double submit
                if(this.processing) {
                    return;
                }
                // reset the error flags
                this.card_error = false;
                this.card_error_message = '';
                // add the data structure needed for the form submit event to be triggered & consitent
                // flow restored
                event.data = {
                    source : this.name,
                    paymentHandler : this.paymentHandler.getPublicHandler(),
                };
                // trigger the submit event to allow for full form validation & flow consistency
                this.$emit(emitEvents.submit.name, event);
            },

            onTransactionError : function(error) {
                // @todo this is automatically called by the braintree component, but our form
                //       validation hasn't been run yet.
                // just pass the responsibility to the error handler to setup & trigger the 
                // consistent error event
                if(this.debugging) {
                    console.group('Paypal transaction error event');
                    console.log(error);
                    console.groupEnd();
                }
                this.onHandlerError(this.paymentHandler.getPublicHandler(), error);
            },

            onLoadFail : function(error) {
                if(this.debugging) {
                    console.group('Paypal loading error event');
                    console.log(error);
                    console.groupEnd();
                }
                if(!error.hasOwnProperty('message') || !error.message) {
                    error.message = 'Unknown Paypal Loading Error';
                }
                const event = {
                    data : {
                        source : this.name,
                        type : 'loading',
                        paymentHandler : this.paymentHandler.getPublicHandler(),
                        error
                    }
                };
                 // trigger the error event
                this.$emit(emitEvents.transactionError.name, event);
            },
        }
    };
</script>

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
                                :use-buttons="useButtons"
                                @click.prevent="slotProps.submit"
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
    // import the Stripe elements card form payment handler
    import PaypalHandler from '@/common/BIQ/PaymentHandlers/PaypalHandler';
    // import the component to disply the 1-click-processing form submit button
    import ProcessFormSubmit from 'BIQ/Forms/ProcessFormSubmit.vue';

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
                // create a new paypal payment option element
                paymentHandler : new PaypalHandler(
                    this.onTransactionSuccess,
                    this.onTransactionError,
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
            onSubmit(event) {
                console.log(event);
            },

            onTransactionSuccess : function(event) {
                console.log(event);
                // just make sure no double submit
                if(this.processing) {
                    return;
                }
                // reset the error flags
                this.card_error = false;
                this.card_error_message = '';
                // add the source name so data can be accessed correctly
                event.data = {
                    source : this.name,
                    paymentHandler : this.paymentHandler,
                    paymentIntent : {
                        // set the paypal transaction token ID
                        id : event.nonce
                    },
                    formdataAppend : (formData) => formData
                };
                // trigger the submit event to allow for full form validation
                this.$emit('submit', event);
            },

            onTransactionError : function(error) {
                // @todo check if the onSubmit validation event needs to be triggered
                console.log(error);
                if(!error.hasOwnProperty('message') || !error.message) {
                    error.message = 'Unknown Paypal Error';
                }
                const event = {
                    data : {
                        source : this.name,
                        type : 'transaction',
                        error
                    }
                };
                 // trigger the error event
                this.$emit('transactionError', event);
            },

            onLoadFail : function(error) {
                console.log(error);
                if(!error.hasOwnProperty('message') || !error.message) {
                    error.message = 'Unknown Paypal Loading Error';
                }
                const event = {
                    data : {
                        source : this.name,
                        type : 'loading',
                        error
                    }
                };
                 // trigger the error event
                this.$emit('transactionError', event);
            },
        }
    };
</script>

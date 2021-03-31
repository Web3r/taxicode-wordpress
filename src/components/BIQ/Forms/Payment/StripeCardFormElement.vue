<template>
    <div 
        :id="id" 
        class="col"
    >
        <div class="form-group">
            <label 
                :for="mount_on" 
                class="control-label"
            >{{label}}</label>
            <div 
                ref="card" 
                :id="mount_on" 
                :class="errorStateClass"
                class="form-control stripe-card-container"
            ></div>
        </div>
        <div class="form-group">
            <biq-process-form-submit 
                :processing="processing"
                :use-buttons="useButtons"
                @click="onSubmit"
                label="Book Now"
            ></biq-process-form-submit>
        </div>
    </div>
</template>

<script>
    // import default Stripe card elements style config object just in case
    import { DEFAULT_STRIPE_CARD_STYLE } from 'BIQ/config';
    // import the list of events the component emits & can be listened for on the payment form
    import { paymentEvents as emitEvents } from '@/common/BIQ/QuoteCheckout';
    // import the Stripe elements card form payment handler
    import StripeElementsHandler from '@/common/BIQ/PaymentHandlers/StripeElementsHandler';
    // import the component to disply the 1-click-processing form submit button
    import ProcessFormSubmit from 'BIQ/Forms/ProcessFormSubmit.vue';

    // component explicitly implements the "mixins/ValidatesMixin" interface as it differs somewhat
    export default {
        name : 'StripeCardFormElement',

        components : {
            'biq-process-form-submit' : ProcessFormSubmit
        },

        props : {
            biqClientSecretFrom : {
                type : String,
                required : true,
                default : '//booking/client_gateway_secret/'
            },

            stripePublicKey : {
                type : String,
                required : true,
                default : ''
            },
            
            stripeCardFormStyle : {
                type : Object,
                required : true,
                default : function() { 
                    return DEFAULT_STRIPE_CARD_STYLE;
                 }
            },

            hidePostalCode : {
                type : Boolean,
                default : false
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
                default : 'biq-stripe-card-details'
            },

            label : {
                type : String,
                default : 'Card Details'
            },

            validClass : {
                type : String,
                default : ''
            },

            errorClass : {
                type : String,
                default : 'is-invalid'
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
                mount_on : 'stripe-card-form',
                validation_run : false,
                has_errors : false,
                // create a new stripe card form payment option element
                paymentHandler : new StripeElementsHandler(
                    this.onHandlerSuccess,
                    this.onHandlerError,
                    this.debugging
                )
            };
        },

        computed: {
            errorStateClass : function() {
                // check if any validation styles need applying first
                return (this.validation_run)
                    ? this.has_errors
                        ? this.errorClass
                        : this.validClass
                    : '';
            }
        },

        created() {
            // initialise the Stripe Element & bind it to the mount point
            this.paymentHandler.initialise(
                this.stripePublicKey,
                this.biqClientSecretFrom,
                this.mount_on, 
                this.stripeCardFormStyle, 
                this.hidePostalCode
            );
        },

        mounted() {
            // set the transaction amount
            this.paymentHandler.setAmount(
                this.amount, 
                this.descriptor
            );
            // mount the Stripe Element for display
            this.paymentHandler.mountElement();
        },

        methods : {
            onSubmit : function(event) {
                // just make sure no double submit
                if(this.processing) {
                    return;
                }
                // add the card form handler to allow for the transaction to 
                // be initiated if everything else validates
                event.data = {
                    paymentHandler : this.paymentHandler.getPublicHandler()
                };
                // trigger the submit event with the public payment handler to allow for form 
                // validation and later transaction initiation
                this.$emit(emitEvents.submit.name, event);
            },
            
            onHandlerSuccess : function(paymentHandler, paymentIntent) {
                // add the success event data, including the completed payment intent transaction
                // we have the money, but no booking created yet!
                const event = {
                    data : {
                        paymentHandler,
                        paymentIntent
                    }
                };
                // trigger the transaction success event
                this.$emit(emitEvents.transactionSuccess.name, event);
            },

            onHandlerError : function(paymentHandler, error) {
                // make sure the error has a message
                if(!error.hasOwnProperty('message') || !error.message) {
                    error.message = 'Unknown Stripe Error';
                }
                // add the error event data
                const event = {
                    data : {
                        paymentHandler,
                        error
                    }
                };
                 // trigger the error event
                this.$emit(emitEvents.transactionError.name, event);
            },

            validate : function() {
                // set the flag to allow the valid / error style classes to be applied
                this.validation_run = true;
                const classList = this.$refs.card.classList;
                // if the card container contains any of the styles it's invalid
                this.has_errors = (classList.contains('StripeElement--invalid') || classList.contains('StripeElement--empty'));
                // if it doesn't have card errors, it's valid to continue
                return !this.has_errors;
            }
        }
    };
</script>

<template>
    <div class="row">
        <div id="tcplugin-cardholder-details" class="col">
            <div class="form-group">
                <label 
                    :for="fields.cardholder_name.id"
                >{{fields.cardholder_name.label}}</label>
                <input 
                    v-model="fields.cardholder_name.value" 
                    :id="fields.cardholder_name.id" 
                    :placeholder="fields.cardholder_name.placeholder"
                    :required="fields.cardholder_name.required"
                    :class="errorStateClass('cardholder_name')" 
                    type="text" 
                    class="form-control" 
                />
            </div>
            <div class="form-group">
                <label 
                    :for="fields.billing_postcode.id"
                >{{fields.billing_postcode.label}}</label>
                <input 
                    v-model="fields.billing_postcode.value" 
                    :id="fields.billing_postcode.id" 
                    :placeholder="fields.billing_postcode.placeholder"
                    :required="fields.billing_postcode.required"
                    :class="errorStateClass('billing_postcode')" 
                    type="text" 
                    class="form-control"
                />
            </div>
        </div>
        <stripe-card-form-element
            ref="card"
            :api-client-secret-from="`${appSettings.biq_api_host}${appConfig.CLIENT_SECRET_URI}`"
            :stripe-public-key="appSettings.stripe_pk"
            :amount="amount"
            :stripe-card-form-style="stripeCardFormStyle"
            :hide-postal-code="appConfig.PGH_CONF.hidePostalCode"
            :processing="processing"
            :id="id"
            :label="label"
            :descriptor="descriptor"
            :debugging="debugging"
            :use-buttons="appConfig.useButtons"
            @submit="onSubmit"
            @transactionSuccess="onTransactionSuccess"
            @transactionError="onTransactionError"
        ></stripe-card-form-element>
    </div>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';
    // import the component to display the journey details being booked
    import StripeCardFormElement from 'BIQ/Forms/Payment/StripeCardFormElement.vue';

    export default {
        name : 'StripeCardPayment',

        mixins : [
            ValidatesMixin
        ],

        components : {
            'stripe-card-form-element' : StripeCardFormElement
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

            values : {
                type : Object,
                default : function() { 
                    return {
                        cardholder_name : '',
                        billing_postcode : ''
                    };
                }
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

            name : {
                type : String,
                default : 'stripe'
            },

            label : {
                type : String,
                default : 'Card Details'
            }
        },

        data() {
            return {
                fields : {
                    cardholder_name : {
                        value : '',
                        label : 'Cardholder Name',
                        required : true,
                        error : false,
                        errorMsg : 'Cardholder name must be set',
                        id : 'card-holder-name',
                        placeholder : 'Cardholder Name'
                    },
                    billing_postcode : {
                        value : '',
                        label : 'Billing Postcode',
                        required : true,
                        error : false,
                        errorMsg : 'Billing address postcode must be set',
                        id : 'billing-postcode',
                        placeholder : 'Billing Postcode'
                    }
                },
                card_error : false,
                card_error_message : ''
            };
        },

        methods : {
            onSubmit : function(event) {
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
                    ...event.data
                };
                // trigger the submit event to allow for full form validation
                this.$emit('submit', event);
            },
            
            onTransactionSuccess : function(event) {
                const { 
                    cardholder_name, 
                    billing_postcode 
                } = this.fields;
                // add the source name so data can be accessed correctly
                event.data = {
                    source : this.name,
                    ...event.data,
                    formdataAppend : (formData) => {
                        if(this.debugging) {
                            console.log(event.data.paymentIntent);
                        }
                        // add the API field values for additional payment related data
                        formData.append('card_cardholder', cardholder_name.value);
                        // @todo Add the additional card field values from the 
                        // payment intent response
                        // - card_type
                        // - card_number (xxxxxxxxxxxx1234)
                        // - card_expiry
                        // - card_address1 (if available?)
                        formData.append('postcode', billing_postcode.value);
                        // - city (if available?)
                        return formData;
                    }
                };
                // trigger the transaction success event
                this.$emit('transactionSuccess', event);
            },

            onTransactionError : function(event) {
                this.card_error = true;
                this.card_error_message = event.data.error.message;
                // add the source name so data can be accessed correctly
                event.data = {
                    source : this.name,
                    type : 'transaction',
                    ...event.data
                };
                // trigger the error event
                this.$emit('transactionError', event);
            },

            specialValidationErrors : function() {
            // allow this method to be overridden while leaving the
            // reusable validation errors method usable & calling this method 
            // to allowing adding none mixins based fieldname validation errors to the return data
                const errors = {};
                if(this.$refs.card.has_errors) {
                    errors.card = (this.card_error) 
                        ? this.card_error_message 
                        : 'Please provide valid card details'
                }
                return { ...errors };
            },

            validate : function() {
                // just keep a track of any errors
                let errors = 0;
                if(!this.$refs.card.validate()) {
                    errors++;
                }
                // make sure any other "special validations" have been run before this
                 if(!this.validateValues()) {
                    errors++;
                }
                // only valid if no errors encountered
                return (errors == 0);
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

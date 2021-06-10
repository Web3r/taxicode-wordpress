<template>
    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.paypal_public.id"
                    >{{fields.paypal_public.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.paypal_public.value" 
                        :id="fields.paypal_public.id" 
                        :placeholder="fields.paypal_public.placeholder" 
                        :required="fields.paypal_public.required"
                        :class="errorStateClass('paypal_public')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="paypal_publicHelp" 
                    />
                    <br />
                    <small 
                        id="paypal_publicHelp" 
                        class="form-text text-muted"
                    >{{fields.paypal_public.help}}</small>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.stripe_public.id"
                    >{{fields.stripe_public.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.stripe_public.value" 
                        :id="fields.stripe_public.id" 
                        :placeholder="fields.stripe_public.placeholder" 
                        :required="fields.stripe_public.required"
                        :class="errorStateClass('stripe_public')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="stripe_publicHelp" 
                    />
                    <br />
                    <small 
                        id="stripe_publicHelp" 
                        class="form-text text-muted"
                    >{{fields.stripe_public.help}}</small>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.stripe_cardform_style.id"
                    >{{fields.stripe_cardform_style.label}}</label>
                </th>
                <td>
                    <textarea 
                        v-model="fields.stripe_cardform_style.value" 
                        :id="fields.stripe_cardform_style.id" 
                        :placeholder="fields.stripe_cardform_style.placeholder" 
                        :required="fields.stripe_cardform_style.required"
                        :class="errorStateClass('stripe_cardform_style')" 
                        class="regular-text code" 
                        aria-describedby="stripe_cardform_styleHelp" 
                        rows="10" 
                        cols="50"
                    ></textarea>
                    <br />
                    <small 
                        id="stripe_cardform_styleHelp" 
                        class="form-text text-muted"
                    >
                        See <a 
                            :href="stripe_style_guide_docs_url" 
                            title="Stripe JS Card Element Style Object" 
                            target="_blank"
                        >Stripe JS Card Element Style Object</a> for details of valid options.
                    </small>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';
    // import the BIQ static config
    import { STRIPE_STYLE_GUIDE_DOCS_URL } from 'BIQ/config';

    // define the component properties
    const props = {
        values : {
            type : Object,
            // @todo add a validator to make sure that all the fieldname keys are supplied
            default : function() { 
                return {
                    paypal_public : '',
                    stripe_public : '',
                    stripe_cardform_style : ''
                };
            }
        }
    };
    
    /**
     * Generate the list of field name = data form field structure for passenger details form
     * @param {String} idp A string to prefix the fields ID attribute with
     * @returns Object
     */
    const fF = idp => {
        return {
            paypal_public : {
                value : '',
                label : 'Paypal Client ID',
                required : true,
                error : null,
                errorMsg : 'Value required for Paypal Client ID',
                id : `${idp}paypal_public`,
                placeholder : 'Enter the Paypal Client ID',
                help : 'The public Paypal Client ID assigned to you.'
            },
            stripe_public : {
                value : '',
                label : 'Stripe Public API Key',
                required : true,
                error : null,
                errorMsg : 'Value required for Stripe Public API Key',
                id : `${idp}stripe_public`,
                placeholder : 'Enter the Stripe Public API Key',
                help : 'The Stripe Public API Key assigned to you.'
            },
            stripe_cardform_style : {
                value : '',
                label : 'Stripe Cardform Custom Style',
                required : false,
                error : null,
                errorMsg : '',
                id : `${idp}stripe_cardform_style`,
                placeholder : '',
                help : ''
            }
        }
    };

    export default {
        name : 'SettingsPaymentForm',
        props,

        mixins : [
            ValidatesMixin
        ],

        data() {
            return {
                fields : fF(''),
                stripe_style_guide_docs_url : STRIPE_STYLE_GUIDE_DOCS_URL
            };
        },

        mounted() {
            // populate the settings form from the supplied values
            this.setFieldValues();
        }
    };
</script>

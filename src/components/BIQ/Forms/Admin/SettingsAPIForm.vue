<template>
    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.taxicode_public.id"
                    >{{fields.taxicode_public.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.taxicode_public.value" 
                        :id="fields.taxicode_public.id" 
                        :placeholder="fields.taxicode_public.placeholder" 
                        :required="fields.taxicode_public.required"
                        :class="errorStateClass('taxicode_public')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="taxicode_publicHelp" 
                    />
                    <br />
                    <small 
                        id="taxicode_publicHelp" 
                        class="form-text text-muted"
                    >{{fields.taxicode_public.help}}</small>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.taxicode_private.id"
                    >{{fields.taxicode_private.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.taxicode_private.value" 
                        :id="fields.taxicode_private.id" 
                        :placeholder="fields.taxicode_private.placeholder" 
                        :required="fields.taxicode_private.required"
                        :class="errorStateClass('taxicode_private')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="taxicode_privateHelp" 
                    />
                    <br />
                    <small 
                        id="taxicode_privateHelp" 
                        class="form-text text-muted"
                    >{{fields.taxicode_private.help}}</small>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.biq_api_host.id"
                    >{{fields.biq_api_host.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.biq_api_host.value" 
                        :id="fields.biq_api_host.id" 
                        :placeholder="fields.biq_api_host.placeholder" 
                        :required="fields.biq_api_host.required"
                        :class="errorStateClass('biq_api_host')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="biq_api_hostHelp" 
                    />
                    <br />
                    <small 
                        id="biq_api_hostHelp" 
                        class="form-text text-muted"
                    >{{fields.biq_api_host.help}}</small>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';

    // define the component properties
    const props = {
        values : {
            type : Object,
            // @todo add a validator to make sure that all the fieldname keys are supplied
            default : function() { 
                return {
                    taxicode_public : '',
                    taxicode_private : '',
                    biq_api_host : 'https://api.taxicode.com/'
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
            taxicode_public : {
                value : '',
                label : 'Taxicode Public API Key',
                required : true,
                error : null,
                errorMsg : 'Value required for Taxicode Public API Key',
                id : `${idp}taxicode_public`,
                placeholder : 'Enter your Public Taxicode API Key',
                help : 'The Taxicode affiliate API public key assigned to your account.'
            },
            taxicode_private : {
                value : '',
                label : 'Taxicode Private API Key',
                required : true,
                error : null,
                errorMsg : 'Value required for Taxicode Private API Key',
                id : `${idp}taxicode_private`,
                placeholder : 'Enter your Private Taxicode API Key',
                help : 'The Taxicode affiliate API Private key assigned to your account, do not share your key with anyone else.'
            },
            biq_api_host : {
                value : '',
                label : 'Taxicode BIQ API Host',
                required : true,
                error : null,
                errorMsg : 'Value required for Taxicode BIQ API Host',
                id : `${idp}biq_api_host`,
                placeholder : 'The Taxicode API host address',
                help : 'The hostname of the Taxicode API to use e.g. "https://api.taxicode.com/"'
            }
        }
    };

    export default {
        name : 'SettingsAPIForm',
        props,

        mixins : [
            ValidatesMixin
        ],

        data() {
            return {
                fields : fF('')
            };
        },

        mounted() {
            // populate the settings form from the supplied values
            this.setFieldValues();
        }
    };
</script>

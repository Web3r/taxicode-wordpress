<template src="./templates/Settings.html"></template>

<script>
    import Form from "../../common/Form";
    import axios from 'axios';

    export default {
        name: 'Settings',

        props: {
            biq_app_settings_url : {
                type : String,
                default : ''
            },
            biq_save_app_settings_url : {
                type : String,
                default : ''
            },
            tc_private_key : {
                type : String,
                default : ''
            }
        },

        data () {
            return {
                message_class : '',
                message : '',
                form : new Form({
                    taxicode_public : '',
                    taxicode_private : '',
                    stripe_public : '',
                    stripe_cardform_css : '',
                    paypal_public : '',
                    complete_page_text : '',
                    quote_type : '',
                    custom_css : '',
                    test_mode : 0,
                    preserve_on_submit : true
                })
            };
        },

        created() {
            this.getAppSettings();
            // passed as a prop because it's a private key & shouldn't be returned with the app settings
            this.form.taxicode_private = this.tc_private_key;
        },

        methods: {
            getAppSettings : function() {
                const page = this;
                // get the app settings from the backend REST server
                axios.get(this.biq_app_settings_url)
                .then(response => {
                    // set the app settings from the backend to the settings form
                    page.form.taxicode_public = response.data.taxicode_public;
                    page.form.stripe_public = response.data.stripe_public;
                    page.form.stripe_cardform_css = response.data.stripe_cardform_css;
                    page.form.paypal_public = response.data.paypal_public;
                    page.form.quote_type = response.data.quote_type;
                    page.form.complete_page_text = response.data.complete_page_text;
                    page.form.custom_css = response.data.custom_css;
                    page.form.test_mode = response.data.test_mode;
                })
                .catch(error => {
                // yeah, something went wrong
                    console.error(error);
                    this.message_class = 'alternate';
                    this.message = 'Failed to load settings';
                });
            },

            onReloadSettings : function() {
                this.getAppSettings();
            },

            onSaveSettings : function() {
                console.log(this.form.data());
                this.form.post(this.biq_save_app_settings_url)
                .then(response => {
                    this.message_class = 'updated';
                    this.message = 'Settings Updated';
                })
                .catch(error => {
                    this.message_class = 'alternate';
                    this.message = 'Failed to update settings!';
                });
            }
        }
    };
</script>

<style scoped>

</style>

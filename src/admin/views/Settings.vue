<template src="./templates/Settings.html"></template>

<script>
    import Form from "@/common/Form";

    export default {
        name : 'Settings',

        props : {
            appSettings : {
                type : Object,
                required : true,
                default : null
            },

            appRESTBaseURL : {
                type : String,
                default : '//'
            },
            
            debugging : {
                type : Boolean,
                default : false
            },
            
            biq_sk : {
                type : String,
                default : ''
            }

        },

        data() {
            return {
                message : '',
                message_extra : '',
                message_class : '',
                form : new Form({
                    taxicode_public : '',
                    taxicode_private : '',
                    biq_api_host : 'https://api.taxicode.com/',
                    stripe_public : '',
                    stripe_cardform_style : '',
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
            this.propogateSettingsToFormData();
            // passed as a prop because it's a private key & shouldn't be returned with the app settings
            this.form.taxicode_private = this.biq_sk;
        },

        methods : {
            onReloadSettings : function() {
                this.propogateSettingsToFormData();
            },

            propogateSettingsToFormData : function() {
                this.form.taxicode_public = this.appSettings.biq_pk;
                this.form.biq_api_host = this.appSettings.biq_api_host;
                this.form.paypal_public = this.appSettings.paypal_pk;
                this.form.stripe_public = this.appSettings.stripe_pk;
                // this is a string from the REST & doesn't parse to JSON well :(
                this.form.stripe_cardform_style = this.appSettings.stripe_cardform_style;
                this.form.quote_type = this.appSettings.quote_type;
                this.form.complete_page_text = this.appSettings.complete_page_text;
                this.form.custom_css = this.appSettings.custom_css;
                this.form.test_mode = this.appSettings.booking_test_mode;
            },

            onSaveSettings : function() {
                const page = this;
                const biq_save_app_settings_url = `${this.appRESTBaseURL}settings-save/`;
                if(this.debugging) {
                    console.info(`Updating BIQ App Settings to '${biq_save_app_settings_url}'`);
                    console.info({...this.form.data()});
                    console.groupEnd();
                }
                // update the app settings from the form data
                this.form.post(biq_save_app_settings_url)
                .then(response => {
                    page.message_class = 'updated';
                    page.message = 'Settings Updated';
                    page.$emit("appSettingsUpdated", { ...response,  });
                })
                .catch(error => {
                // yeah, something went wrong
                    page.message_class = 'error';
                    page.message = 'Failed to update settings!';
                    if(error.hasOwnProperty('message') && error.message) {
                        page.message_extra = error.message;
                    }
                    console.error(page.message_extra);
                    console.info({...error});
                })
                .finally(() => {
                // always get rid of the message after x seconds
                    setTimeout(() => { 
                        page.message = '' 
                        page.message_extra = '';
                        page.message_class = '' 
                    }, 5000);
                });
            }
        }

    };
</script>

<style scoped>

</style>

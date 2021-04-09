<template src="./templates/SettingsPage.html"></template>

<script>
    // import the form handler
    import Form from '@/common/Form';
    // import the flash message to display messages about updating the settings
    import FlashMessage from '@/components/FlashMessage.vue';
    // import the setting form section components
    import SettingsAPIForm from 'BIQ/Forms/Admin/SettingsAPIForm.vue';
    import SettingsPaymentForm from 'BIQ/Forms/Admin/SettingsPaymentForm.vue';

    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the app settings from the form are successfully updated on the backend
        appSettingsUpdated : {
            name : 'appSettingsUpdated'
        },
        // when there is an error on the backend
        updateSettingsError : {
            name : 'updateSettingsError'
        }
    };

    export default {
        name : 'SettingsPage',

        components : {
            'flash-message' : FlashMessage,
            'biq-api-settings-form-section' : SettingsAPIForm,
            'biq-payment-settings-form-section' : SettingsPaymentForm
        },

        props : {
            adminNonce : {
                type : String,
                default : ''
            },
            
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
            },
            
            custom_css : {
                type : String,
                default : ''
            },
            
            search_target_permalink : {
                type : String,
                default : '/booking-instant-quotes/'
            }

        },

        data() {
            return {
                page_title : 'Settings',
                flash_message : false,
                flash_message_timeout : 5000,
                form_sections : [
                    'apiSettingsForm',
                    'paymentSettingsForm'
                ],
                validation_error_class : 'error',
                validation_errors : {
                    search_target_permalink : false
                },
                // passed as a prop because it's a private key & shouldn't be 
                // returned with the app settings, but is a mutatable form input value
                taxicode_private : this.biq_sk,
                // passed as a prop because it's external to the app & isn't returned 
                // with the app settings, but is a mutatable form input value
                custom_styles : this.custom_css,
                form : new Form({
                    search_target_permalink : this.search_target_permalink,
                    test_mode : 0,
                    quote_type : 'all',
                    recommend_upgrade : 0,
                    complete_page_text : '',
                    custom_css : this.custom_css,
                    preserve_on_submit : true
                })
            };
        },

        created() {
            this.propogateSettingsToFormData();
            this.taxicode_private = this.biq_sk;
        },

        computed: {
            apiSettingsValues : function() {
                // return the values object for the BIQ API settings form section to populate with
                return {
                    taxicode_public : this.appSettings.biq_pk,
                    taxicode_private : this.taxicode_private,
                    biq_api_host : this.appSettings.biq_api_host
                };
            },

            paymentSettingsValues : function() {
                // return the values object for the BIQ Payment settings form section to populate with
                return {
                    paypal_public : this.appSettings.paypal_pk,
                    stripe_public : this.appSettings.stripe_pk,
                    // this is a string from the REST & doesn't parse to JSON well :(
                    stripe_cardform_style : this.appSettings.stripe_cardform_style
                };
            }
        },

        methods : {
            onReloadSettings : function() {
                // keep the display form & the settings in sync
                this.propogateSettingsToFormData();
            },

            propogateSettingsToFormData : function() {
                // convert to number for ease then to string for radio input value
                this.form.test_mode = (this.appSettings.booking_test_mode) ? 1 : 0;
                this.form.quote_type = this.appSettings.quote_type;
                // convert to number for ease then to string for radio input value
                this.form.recommend_upgrade = (this.appSettings.recommend_upgrade) ? 1 : 0;
                this.form.complete_page_text = this.appSettings.complete_page_text;
                this.form.custom_css = this.custom_styles;
                //this.form.search_target_permalink = this.search_target_permalink;
            },

            onSaveSettings : function(event) {
                // validate the combined settings forms
                if(!this.validate()) {
                    if(this.debugging) {
                        console.group('BIQ App Settings Validation Error');
                        console.log(event);
                        console.log(this.validation_errors);
                        console.groupEnd();
                    }
                    // display a validation error message
                    this.flashMessage('Failed to update settings!', 'Please check the form for errors', 'error', this.flash_message_timeout);
                    // don't bother trying to update
                    return false;
                }
                // just grab a self reference
                const self = this;
                // set the URL to post the updated settings to update the backend values
                const biq_save_app_settings_url = `${this.appRESTBaseURL}settings/`;
                if(this.debugging) {
                    console.group(`Updating BIQ App Settings to '${biq_save_app_settings_url}'`);
                }
                // define the object to hold the form sections values
                let settingsFormSectionsData = {};
                // get the BIQ settings form section values
                this.form_sections.forEach(section => {
                    // merge the sections values with the previous section (if any)
                    settingsFormSectionsData = {
                        ...settingsFormSectionsData,
                        ...this.$refs[section].inputValues()
                       
                    }
                });
                // create a new form to post
                const form = new Form({
                    ...settingsFormSectionsData,
                    ...this.form.data()
                })
                if(this.debugging) {
                    console.log('BIQ Form Sections Data', {...settingsFormSectionsData});
                    console.log('Form Data', {...this.form.data()});
                    console.log('Post Form Data', {...form.data()});
                    console.groupEnd();
                }
                // update the app settings from the form data
                form.post(biq_save_app_settings_url, { headers : { "X-WP-Nonce" : self.adminNonce } })
                .then(response => {
                    // set the update success notice message
                    self.flashMessage('Settings Updated', '', 'updated', self.flash_message_timeout);
                    // keep the value in sync with the property & the form value
                    self.taxicode_private = form.taxicode_private;
                    self.custom_styles = form.custom_css;
                    // create the update success response event data
                    const event = {
                        ...response
                    };
                    // trigger the settings updated event
                    self.$emit(emitEvents.appSettingsUpdated.name, event);
                })
                .catch(error => {
                // well that's not good
                    // set a error details encountered an error while updating the settings
                    self.flashMessage('Failed to update settings!', '', 'error', self.flash_message_timeout);
                    // create the error event data
                    const event = {
                        data : {
                            form : {...form.data()},
                            URL : biq_save_app_settings_url,
                            error
                        }
                    };
                    // trigger the update error error event
                    self.$emit(emitEvents.updateSettingsError.name, event);
                    if(self.debugging) {
                        console.info('Update Settings Error');
                        console.log('Update Event', event);
                        console.groupEnd();
                    }
                });
            },

            validate : function() {
                // reset the common validation error flags
                let errors = 0;
                let validation_errors = {
                    search_target_permalink : false
                };
                // validate the BIQ settings form sections
                this.form_sections.forEach(section => {
                    if(!this.$refs[section].validate()) {
                        validation_errors = {
                            ...validation_errors,
                            ...this.$refs[section].validationErrors()
                        }
                        errors++;
                    }
                });
                if(this.form.search_target_permalink == '') {
                    validation_errors.search_target_permalink = 'Permalink to a page to display the search results & booking checkout is required.'
                }
                // set any validation errors
                this.validation_errors = validation_errors;
                // only valid if no errors encountered
                return (errors == 0);
            },

            flashMessage : function(heading, message, style_class, timeout) {
                this.flash_message = {
                    heading,
                    message,
                    class : style_class
                };
                // clear the message after x seconds
                return setTimeout(() => { 
                    this.flash_message = false;
                }, timeout);
            }
        }

    };
</script>

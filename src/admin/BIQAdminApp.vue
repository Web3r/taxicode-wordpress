<template>
  <div id="biq-admin-vue-app">
    <h1>Taxicode Booking Instant Quotes Admin</h1>
    <router-view v-if="initialised" 
        :debugging=biq_app_debug_enabled
        :appSettings=appSettings 
        :appRESTBaseURL=biq_app_url
        @appSettingsUpdated=appSettingsUpdated 
    />
  </div>
</template>

<script>
    export default {
        name : 'BIQAdminApp',
        version : '1.0.1',
        
        props : {
            biq_app_url : {
                type : String,
                default : '',
            },

            biq_app_debug_enabled : {
                type : Boolean,
                default : false
            }

        },

        data() {
            return {
                initialised : false,
                settings : {
                    biq_api_host : 'https://api.taxicode.com/',
                    biq_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : {
                        base : {
                            fontFamily : "'Muli', sans-serif",
                            fontSize : '14px',
                            color : '#333'
                        },
                        invalid : {
                            color : 'red'
                        }
                    },
                    quote_type : '',
                    complete_page_text : '',
                    custom_css : '',
                    booking_test_mode : false
                }
            }
        },

        created() {
            this.getAppSettings();
        },

        computed : {
            appSettings : function() {
                return { ...this.settings };
            }

        },

        methods : {
            getAppSettings : function() {
                const app = this;
                const biq_app_settings_url = `${this.biq_app_url}settings-get/`;
                axios.get(biq_app_settings_url)
                .then(response => {
                    if(app.biq_app_debug_enabled) {
                        console.info(`Loading BIQ App Settings from '${biq_app_settings_url}'`);
                    }
                    app.appSettingsUpdated(response.data);
                    app.initialised = true;
                })
                .catch(error => {
                    let message = 'Unknown Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.info({...error});
                });
            },

            appSettingsUpdated : function(new_settings) {
                if(this.biq_app_debug_enabled) {
                    console.group('Updating BIQ App Settings');
                    console.info({...this.settings});
                    console.info({...new_settings});
                    try {
                        // this is a string from the REST & doesn't parse to JSON well :(
                        console.log(new_settings.stripe_cardform_style);
                        console.log(typeof(new_settings.stripe_cardform_style));
                        console.log(JSON.parse(new_settings.stripe_cardform_style));
                    } catch(e) {
                        console.error(e);
                    }
                }
                const settings = {
                    biq_pk : new_settings.taxicode_public,
                    biq_api_host : new_settings.biq_api_host,
                    paypal_pk : new_settings.paypal_public,
                    stripe_pk : new_settings.stripe_public,
                    // this is a string from the REST & doesn't parse to JSON well :(
                    stripe_cardform_style : new_settings.stripe_cardform_style,
                    quote_type : new_settings.quote_type,
                    complete_page_text : new_settings.complete_page_text,
                    custom_css : new_settings.custom_css,
                    booking_test_mode : new_settings.test_mode
                };
                this.settings = settings;
                if(this.biq_app_debug_enabled) {
                    console.info({...settings});
                    console.info({...this.settings});
                    console.groupEnd();
                }
            }

        }

    };
</script>

<style scoped>

</style>

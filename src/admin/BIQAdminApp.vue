<template>
  <div id="biq-admin-vue-app">
    <h1>{{app_title}}</h1>
    <router-view v-if="initialised" 
        :debugging="biqAppDebugEnabled"
        :app-settings="appSettings"
        :appRESTBaseURL="biqAppURL"
        @appSettingsUpdated="appSettingsUpdated" 
    ></router-view>
  </div>
</template>

<script>
    export default {
        name : 'BIQAdminApp',
        version : '1.0.1',
        
        props : {
            biqAppURL : {
                type : String,
                required : true,
                default : '//',
            },

            biqAppDebugEnabled : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
                app_title : 'Taxicode Booking Instant Quotes Admin',
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
                    booking_test_mode : false,
                    quote_type : '',
                    recommend_upgrade : false,
                    complete_page_text : ''
                }
            }
        },

        created() {
            // get the app settings from the backend
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
                const biq_app_settings_url = `${this.biqAppURL}settings-get/`;
                if(this.biqAppDebugEnabled) {
                    console.group(`Loading BIQ App Settings from '${biq_app_settings_url}'`);
                }
                axios.get(biq_app_settings_url)
                .then(response => {
                    app.appSettingsUpdated(response.data);
                    app.initialised = true;
                })
                .catch(error => {
                    if(app.biqAppDebugEnabled) {
                        console.info('Updated Settings');
                        console.log(error);
                    }
                    console.error(error);
                })
                .finally(() => {
                    if(app.biqAppDebugEnabled) {
                        console.groupEnd();
                    }
                });
            },

            appSettingsUpdated : function(new_settings) {
                if(this.biqAppDebugEnabled) {
                    console.group('Updating BIQ App Settings');
                    console.log('App Settings', {...this.settings});
                    console.log('New Settings', new_settings);
                    // this is a string from the REST & doesn't parse to JSON well :(
                    // but the echoed string inside the script tag to be supplied as a prop to the
                    // Checkout Page view via the global window variable is an object.
                    // It's dirty, but needs must for now 2021
                    console.log('stripe_cardform_style', new_settings.stripe_cardform_style);
                    console.info('type', typeof(new_settings.stripe_cardform_style));
                    try {
                        console.log('parse attempt', JSON.parse(new_settings.stripe_cardform_style));
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
                    // convert to boolean for ease
                    booking_test_mode : (new_settings.test_mode == '1'),
                    quote_type : new_settings.quote_type,
                    // convert to boolean for ease
                    recommend_upgrade : (new_settings.recommend_upgrade == '1'),
                    complete_page_text : new_settings.complete_page_text
                };
                this.settings = settings;
                if(this.biqAppDebugEnabled) {
                    console.info('Updated Settings');
                    console.log('Settings', settings);
                    console.log('App Settings', {...this.settings});
                    console.groupEnd();
                }
            }
        }
    };
</script>

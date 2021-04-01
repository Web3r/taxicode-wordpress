<template>
  <div id="biq-admin-vue-app">
    <h1>{{app_title}}</h1>
    <router-view v-if="initialised" 
        :debugging="appDebugEnabled"
        :app-settings="appSettings"
        :appRESTBaseURL="appURL"
        @appSettingsUpdated="appSettingsUpdated" 
    ></router-view>
  </div>
</template>

<script>
    // import the mixin that sets values & validates field values
    import AppsMixin from 'mixins/AppsMixin';
    // import the BIQ static config just in case and the settings formatter
    import { DEFAULT_STRIPE_CARD_STYLE, biqConf, biqSettings } from 'BIQ/config';

    // define the BIQ Admin App release constants values
    const APP_VERSION = '1.0.1';
    const APP_NAME = 'BIQAdminApp';
    const APP_TITLE = 'Taxicode Booking Instant Quotes Admin';
    
    // define the main BIQ Admin App component properties (inherits props from AppsMixin)
    const props = {};
    // define the main BIQ Admin App component computed property methods (inherits computed property methods from AppsMixin)
    const computed = {};
    // define the main BIQ Admin App component methods (inherits methods from AppsMixin)
    const methods = {
        appSettingsUpdated : function(new_settings) {
            if(this.appDebugEnabled) {
                console.group('Updating BIQ App Settings');
                console.log('BIQ App Settings', {...this.settings});
                console.log('New BIQ Settings', new_settings);
            }
            const settings = biqSettings(new_settings, this.appDebugEnabled);
            this.settings = settings;
            if(this.appDebugEnabled) {
                console.info('Updated Settings');
                console.log('Settings', settings);
                console.log('BIQ App Settings', {...this.settings});
                console.groupEnd();
            }
        }
    };

    export default {
        name : APP_NAME,
        version : APP_VERSION,
        mixins : [AppsMixin],
        props,
        computed,
        methods,

        data() {
            return {
                app_title : APP_TITLE,
                settings : {
                    biq_api_host : biqConf.LIVE_API_HOST,
                    biq_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : DEFAULT_STRIPE_CARD_STYLE,
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
        }
    };
</script>

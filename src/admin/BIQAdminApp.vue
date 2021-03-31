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

    export default {
        name : 'BIQAdminApp',
        version : '1.0.1',

        mixins : [
            AppsMixin
        ],

        data() {
            return {
                app_title : 'Taxicode Booking Instant Quotes Admin',
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
        },

        methods : {
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
        }
    };
</script>

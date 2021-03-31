<template>
    <div id="biq-vue-app-search-lite">
        <the-biq-search-form v-if="initialised" 
            :biq-public-key="appSettings.biq_pk"
            :biq-places-lookup="`${appSettings.biq_api_host}${appConfig.biq.PLACES_URI}`"
            :biq-quotes-from="`${appSettings.biq_api_host}${appConfig.biq.QUOTE_URI}`"
            :search-on-load="search_on_load"
            :debugging="appDebugEnabled"
            :use-buttons="appConfig.biq.useButtons" 
            @biqSearchQuotes="onSearchQuotes"
            layout="compact"
        ></the-biq-search-form>
    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import AppsMixin from 'mixins/AppsMixin';
    // import the BIQ static config just in case and the settings formatter
    import { DEFAULT_STRIPE_CARD_STYLE, biqConf, biqSettings } from 'BIQ/config';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/Search/TheSearchForm.vue';

    export default {
        name : 'BIQAppSearchLite',
        version : '1.0.1',

        mixins : [
            AppsMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
        },

        props : {
            biqAppConfig : {
                type : Object,
                required : true,
                default : function() { 
                    return {
                        biq : biqConf
                    };
                }
            }
        },

        data() {
            return {
                search_on_load : false,
                settings : {
                    biq_api_host : this.biqAppConfig.biq.LIVE_API_HOST,
                    biq_pk : '',
                    paypal_pk : '',
                    stripe_pk : '',
                    stripe_cardform_style : DEFAULT_STRIPE_CARD_STYLE,
                    booking_test_mode : false,
                    quote_type : '',
                    recommend_upgrade : false,
                    complete_page_text : ''
                }
            };
        },

        created() {
            // get the app settings from the backend
            this.getAppSettings();
        },

        computed : {
            ...mapGetters([
            // BIQ Quote Search state
                'searchDetails',
                'hasSearchResults',
                'displayType',
                'displayQuotes',
            // BIQ Quoting state
                'loadingQuotes', 
                'quotesError', 
                'quotesLoaded', 
                'zeroQuotes', 
                'journeyID', 
                'journeyDetails', 
                'journeyDate', 
                'journeyTime', 
                'journeyHasReturn', 
                'journeyReturnDate', 
                'journeyReturnTime', 
                'journeyHasVias', 
                'journeyQuotes'
            ]),

            appConfig : function() {
                return { ...this.biqAppConfig };
            }
        },

        methods : {
            ...mapActions([
            // BIQ Quote Search state
                'resetSearch',
                'searchingQuotes', 
                'searchedQuotes',
                'changeDisplayType',
            // BIQ Quoting state
                'resetQuotes',
                'quoting', 
                'apiQuotesError',
                'quoted'
            ]),

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
            },

            onSearchQuotes : function(evt) {
                
            }
        }
    };
</script>

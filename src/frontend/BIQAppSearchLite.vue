<template>
    <div id="biq-search-lite-vue-app">
        <the-biq-search-form v-if="initialised" 
            :biq-public-key="appSettings.biq_pk"
            :biq-places-lookup="placesLookup"
            :biq-quotes-from="quotesFrom"
            :search-on-load="search_on_load"
            :debugging="appDebugEnabled"
            @submit="onSearchQuotes"
            layout="compact"
            :action="biqSearchTarget"
            method="GET"
        ></the-biq-search-form>
    </div>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import AppsMixin from 'mixins/AppsMixin';
    // import the BIQ static config just in case and the settings formatter
    import { DEFAULT_STRIPE_CARD_STYLE, biqConf, updateAppSettings } from 'BIQ/config';
    // import the BIQ search components
    import TheSearchForm from 'BIQ/Forms/Search/TheSearchForm.vue';

    // define the APP release constants values
    const APP_VERSION = '1.0.1';
    const APP_NAME = 'BIQAppSearchLite';
    const APP_TITLE = `Booking Instant Quotes - Search Lite v${APP_VERSION}`;

    // define the main app component properties 
    // (inherits props from AppsMixin)
    const props = {
        biqAppConfig : {
            type : Object,
            required : true,
            default : function() { 
                return {
                    biq : biqConf
                };
            }
        },
        
        biqSearchTarget : {
            type : String,
            required : true,
            default : '/booking-instant-quotes/'
        }
    };
    // define the main app component computed property methods 
    // (inherits computed property methods from AppsMixin)
    const computed = {
        ...mapGetters([
        // BIQ Quote Search state
            'searchDetails',
            'searchOnLoad',
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
        },

        placesLookup : function() {
            return `${this.appSettings.biq_api_host}${this.appConfig.biq.PLACES_URI}`;
        },

        quotesFrom : function() {
            return `${this.appSettings.biq_api_host}${this.appConfig.biq.QUOTE_URI}`;
        }
    };
    // define the main app component methods 
    // (inherits methods from AppsMixin)
    const methods = {
        appSettingsUpdated : updateAppSettings,
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

        onSearchQuotes : function(evt) {
            if(!evt.data.validate()) {
            // form hasn't validated, prevent the default of moving to form action target
                return evt.preventDefault();
            }
            // overwrite the search form details state with what would be POSTed values to the server
            // and set a flag to indicate the search should be performed on the form action target page.
            this.$store.commit('searchForQuotes', evt.data.formValues());
        }
    };

    export default {
        name : APP_NAME,
        version : APP_VERSION,
        props,
        computed,
        methods,

        mixins : [
            AppsMixin
        ],

        components : {
            'the-biq-search-form' : TheSearchForm,
        },

        data() {
            // need to extract the mixin data as this method destroys that object
            const mixinData = AppsMixin.data.call(this);
            return {
                // include the mixin data
                ...mixinData,
                // override the empty settings structure from the mixin
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
                },
                // component specific data
                app_title : APP_TITLE,
                search_on_load : false
            };
        },

        created() {
            // get the app settings from the backend
            this.getAppSettings();
        }
    };
</script>

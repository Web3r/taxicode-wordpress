<template>
    <div id="biq-search-results">
        <div v-if="loadingQuotes">
            <slot 
                name="loading-quotes"
            >
                <div class="row">
                    <div class="spinner-border spinner-border-sm"></div>&nbsp;{{loading_label}}
                </div>
            </slot>
        </div>
        
        <div v-if="quotesError">
            <slot 
                name="quotes-error"
                :error="quotesError"
            >
                <p>{{quotesError}}</p>
            </slot>
        </div>
        
        <div v-if="zeroQuotes">
            <slot 
                name="zero-quotes"
                :error="zero_quotes_error_message"
            >
                <p>{{zero_quotes_error_message}}</p>
            </slot>
        </div>

        <div v-if="hasSearchResults" 
            id="results"
            class="d-flex flex-wrap justify-content-between"
        >
            <component :is="quote_card" v-for="(quote, key) in displayQuotes"
                :key="`quote_${quote.quote_id}_${quote.selected_vehicle}`"
                :journeyID="journeyID" 
                :quote="quote" 
                :display-results-type="displayResultsType"
                :type="key"
                :debugging="debugging"
                @biqQuoteBookNow="onClick"
            ></component>
        </div>
    </div>
</template>

<script>
    // import the state getters mapper
    import { mapGetters } from 'vuex';
    // import the journey quotes searched booking events
    import { quoteBookingEvents } from '@/common/BIQ/QuotesSearched';

    // define the component properties
    const props = {
        displayResultsType : {
            type : String,
            required : true,
            default : 'type_class'
        },

        debugging : {
            type : Boolean,
            default : false
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        ...quoteBookingEvents
    };
    // define the component computed property methods
    const computed = {
        ...mapGetters([
        // BIQ Quote Search state
            'hasSearchResults',
            'displayQuotes',
        // BIQ Quoting state
            'loadingQuotes', 
            'quotesError', 
            'zeroQuotes', 
            'journeyID'
        ])
    };
    // define the component methods
    const methods = {
        onClick : function(evt) {
            // bubble the call to action click event
            this.$emit(emitEvents.biqQuoteBookNow.name, evt);
        }
    };

    export default {
        name : 'TheSearchResults',
        props,
        computed,
        methods,

        components : {
            // lazy load the quote result card component as it's an either or scenario decided at 
            // runtime and displayed using the component:is computed value
            'biq-quote-card-vehicle-select' : () => import(/* webpackChunkName: "BIQQuoteCardVehicleSelect" */ 'BIQ/QuoteCards/QuoteCardVehicleSelect.vue'),
            'biq-quote-card-reduced-to-type-and-class' : () => import(/* webpackChunkName: "BIQQuoteCardReduced" */ 'BIQ/QuoteCards/QuoteCardReducedToTypeAndClass.vue')
        },

        data() {
            return {
                loading_label : 'Loading...',
                zero_quotes_error_message : 'Sorry, we could not find any quotes for the selected journey.  Please try a different journey.',
                quote_card : (this.displayResultsType == 'type_class') 
                    ? 'biq-quote-card-reduced-to-type-and-class'
                    : 'biq-quote-card-vehicle-select'
            };
        }
    };
</script>

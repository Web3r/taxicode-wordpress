<template>
    <div id="biq-search-results">
        
        <div v-if="loadingQuotes">
            <slot 
                name="loading-quotes"
            >
                <div class="row">
                    <div class="spinner-border spinner-border-sm"></div>{{loading_label}}
                </div>
            </slot>
        </div>
        
        <div v-if="quotesError">
            <slot 
                name="quotes-error"
                :error="{ message : quotesError }"
            >
                <p>{{quotesError}}</p>
            </slot>
        </div>
        
        <div v-if="zeroQuotes">
            <slot 
                name="zero-quotes"
                :error="{ message : zero_quotes_error_message }"
            >
                <p>{{zero_quotes_error_message}}</p>
            </slot>
        </div>

        <div v-if="hasSearchResults"
            class="row"
        >
            <component :is="quote_card" v-for="(quote, key) in displayQuotes"
                :key="`quote_${quote.quote_id}_${quote.selected_vehicle}`"
                :journeyID="journeyID" 
                :quote="quote" 
                :display-results-type="displayResultsType"
                :type="key"
                :debugging="debugging"
                :use-buttons="useButtons" 
                @c2aClick="$emit('c2aClick', $event)"
            ></component>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    // import the quote results display cards
    import QuoteCardVehicleSelect from 'BIQ/QuoteCards/QuoteCardVehicleSelect.vue';
    import QuoteCardReducedToTypeAndClass from 'BIQ/QuoteCards/QuoteCardReducedToTypeAndClass.vue';

    export default {
        name : 'TheSearchResults',

        components : {
            'biq-quote-card-vehicle-select' : QuoteCardVehicleSelect,
            'biq-quote-card-reduced-to-type-and-class' : QuoteCardReducedToTypeAndClass
        },

        props : {
            displayResultsType : {
                type : String,
                required : true,
                default : 'type_class'
            },

            debugging : {
                type : Boolean,
                default : false
            },

            useButtons : {
                type : Boolean,
                default : true
            }
        },

        data() {
            return {
                loading_label : 'Loading...',
                zero_quotes_error_message : 'Sorry, we could not find any quotes for the selected journey.  Please try a different journey.',
                quote_card : (this.displayResultsType == 'type_class') 
                    ? 'biq-quote-card-reduced-to-type-and-class'
                    : 'biq-quote-card-vehicle-select'
            };
        },

        computed : mapGetters([
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
</script>

<style scoped>
    ::v-deep .quote-card {
        width: 18rem;
    }
</style>

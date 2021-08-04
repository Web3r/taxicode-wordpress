<template>
    <component :is="useLayout"
        :biq-public-key="biqPublicKey"
        :biq-places-lookup="biqPlacesLookup"
        :biq-quotes-from="biqQuotesFrom"
        :use-labels="useLabels"
        :search-on-load="searchOnLoad"
        :debugging="debugging"
        @submit="onSubmit"
        @validated="onValidated"
        @validationError="onValidationError"
        id-prefix="biq"
    ></component>
</template>

<script>
    // import the BIQ API places lookup
    import { searchQuotes } from '@BIQ/API/Quote';
    // import the mixin that controls the BIQ search without form layout worries
    import { searchProps } from 'BIQ/mixins/SearchMixin';
    // import the mixin that sets values & validates field values and the form events
    import { formEvents } from 'mixins/ValidatesMixin';
    // import the journey quotes searched events
    import { quotesSearchedEvents } from '@/common/BIQ/Quotes/Searched';

    // define the list of available search form layout components that can be lazy load used
    const layouts = {
        column : {
        // 2 column layout
            name : 'column',
            tag : 'the-biq-search-form-column',
            component : () => import(/* webpackChunkName: "BIQTheSearchFormColumn" */ 'BIQ/Forms/Search/Layouts/Column.vue')
        },
        compact : {
        // compact single row fields & search button under
            name : 'compact',
            tag : 'the-biq-search-form-compact',
            component : () => import(/* webpackChunkName: "BIQTheSearchFormCompact" */ 'BIQ/Forms/Search/Layouts/Compact.vue')
        },
        'compact-row' : {
        // compact single row fields & search button under
            name : 'compact-row',
            tag : 'the-biq-search-form-compact-row',
            component : () => import(/* webpackChunkName: "BIQTheSearchFormCompactRow" */ 'BIQ/Forms/Search/Layouts/CompactRow.vue')
        },
        'compact-column' : {
        // compact single column fields & search button under
            name : 'compact-column',
            tag : 'the-biq-search-form-compact-column',
            component : () => import(/* webpackChunkName: "BIQTheSearchFormCompactColumn" */ 'BIQ/Forms/Search/Layouts/CompactColumn.vue')
        }
    };
    // build the object list of search form layout components that can be registered
    const availableLayouts = (l) => {
        const a = Object.keys(l)
            .map(n => [ l[n].tag, l[n].component ]);
       return Object.fromEntries(a);
    };

    // define the component properties
    const props = {
        // include the search form props that are independant of layout
        ...searchProps,

        layout: {
            type : String,
            default : layouts.compact.name,
            required : true,
            validator : layout => Object.keys(layouts).indexOf(layout) > -1
        }
    };
    // define the combined list of events the BIQ Search Form component emits & can be listened for
    const emitEvents = {
        // include the quotes search events
        ...formEvents,
        ...quotesSearchedEvents
    };
    // define the component computed property methods
    const computed = {
        useLayout : function() {
            // determine which form layout component is being used
            return layouts[this.layout].tag;
        }
    };
    // define the component methods
    const methods = {
        onSubmit : function(evt) {
            // provide a default action of validate before searching
            evt.data.defaultAction = () => {
                // extract the methods we need to build on
                const {
                    validate,
                    formValues
                } = evt.data;
               if(validate()) {
                // the form validated
                    // make the BIQ API search
                    this.searchApiQuotes(formValues());
                }
            };
            // provide access to the form BIQ API search method
            evt.data.searchApiQuotes = (j) => this.searchApiQuotes(j);
            // bubble the quotes search form submit event
            this.$emit(emitEvents.submit.name, evt);            
        },

        onValidated : function(evt) {
            // bubble the quotes search form validation event
            this.$emit(emitEvents.validated.name, evt);
        },

        onValidationError : function(evt) {
            // bubble the quotes search validation error event
            this.$emit(emitEvents.validationError.name, evt);
        },

        searchApiQuotes : function(j) {
            const self = this;
            if(this.debugging) {
                console.group(`Searching BIQ API Quotes from '${this.biqQuotesFrom}'`);
            }
            // make the api search quotes call
            searchQuotes(this.biqQuotesFrom, this.biqPublicKey, j, this.debugging)
            .then(r => {
                const emitEvent = (r.count) 
                    // set the quotes searched event to be triggered
                    ? emitEvents.biqQuotesSearched.name
                    // set the zero quotes returned event to be triggered
                    // it's still successfull, but no results
                    : emitEvents.biqZeroQuotes.name;
                // trigger the quotes searched event 
                self.$emit(emitEvent, r);
                if(self.debugging) {
                    console.info('BIQ API Quotes Searched');
                    console.groupEnd();
                }
            })
            .catch(e => {
                // trigger the error event
                self.$emit(emitEvents.biqQuotesError.name, e);
                if(self.debugging) {
                    console.groupEnd();
                }
            });
        },

        onBiqQuotesSearched : function(evt) {
            // bubble the quotes search results returned event
            this.$emit(emitEvents.biqQuotesSearched.name, evt);
        },

        onBiqZeroQuotes : function(evt) {
            // bubble the zero quotes returned event
            this.$emit(emitEvents.biqZeroQuotes.name, evt);
        },
        
        onBiqQuotesError : function(evt) {
            // bubble the quotes error event
            this.$emit(emitEvents.biqQuotesError.name, evt);
        }
    };

    export default {
        name : 'TheSearchForm',
        props,
        computed,
        methods,

        components : {
            // lazy load the quote search form layout component as it's an either or scenario decided at 
            // runtime and displayed using the component:is computed value
            // use the component layout tag value & component async loader
            ...availableLayouts(layouts)
        }
    };
</script>

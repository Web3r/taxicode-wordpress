<template>
    <component :is="useLayout"
        ref="searchForm"
        :biq-public-key="biqPublicKey"
        :biq-places-lookup="biqPlacesLookup"
        :biq-quotes-from="biqQuotesFrom"
        :search-on-load="searchOnLoad"
        :debugging="debugging"
        @submit="onSubmit"
        @validated="onValidated"
        @validationError="onValidationError"
        @biqQuotesSearched="onBiqQuotesSearched"
        @biqZeroQuotes="onBiqZeroQuotes"
        @biqQuotesError="onBiqQuotesError"
        id-prefix="biq"
    ></component>
</template>

<script>
    // import the mixin that controls the BIQ search without form layout worries
    import { searchProps, searchEvents } from 'BIQ/mixins/SearchMixin';

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
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // include the quotes search events
        ...searchEvents
    };
    // define the component computed property methods
    const computed = {
        useLayout : function() {
            // determine which form layout component is being used
            switch(this.layout) {
                case layouts.compact.name :
                    return layouts.compact.tag;
                case layouts.column.name :
                    return layouts.column.tag;
            }
        }
    };
    // define the component methods
    const methods = {
        validate : function () {
            // bubble / pass / return the referenced form validate method call
            return this.$refs.searchForm.validate();
        },

        formValues : function () {
            // bubble / pass / return the referenced form values method call
            return this.$refs.searchForm.formValues();
        },

        onSubmit : function(evt) {
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

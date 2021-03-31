<template>
    <component :is="useLayout"
        :biq-public-key="biqPublicKey"
        :biq-places-lookup="biqPlacesLookup"
        :biq-quotes-from="biqQuotesFrom"
        :search-on-load="searchOnLoad"
        :debugging="debugging"
        :use-buttons="useButtons" 
        @biqQuotesSearched="onBiqQuotesSearched"
        @biqZeroQuotes="onBiqZeroQuotes"
        @biqQuotesError="onBiqQuotesError"
        id-prefix="biq"
    ></component>
</template>

<script>
    // import the journey quotes searched events
    import { quotesSearchedEvents as emitEvents } from '@/common/BIQ/QuotesSearched';

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

    export default {
        name : 'TheSearchForm',

        components : {
            // lazy load the quote search form layout component as it's an either or scenario decided at 
            // runtime and displayed using the component:is computed value
            // use the component layout tag value & component async loader
            ...availableLayouts(layouts)
        },

        props : {
            biqPublicKey : {
                type : String,
                required : true,
                default : ''
            },
            
            biqPlacesLookup : {
                type : String,
                required : true,
                default : '//places/?term='
            },

            biqQuotesFrom : {
                type : String,
                required : true,
                default : '//booking/quote/'
            },

            layout: {
                type : String,
                default : layouts.compact.name,
                required : true,
                validator : layout => Object.keys(layouts).indexOf(layout) > -1
            },

            searchOnLoad : {
                type : Boolean,
                default : false
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

        computed : {
            useLayout : function() {
                // determine which form layout component is being used
                switch(this.layout) {
                    case layouts.compact.name :
                        return layouts.compact.tag;
                    case layouts.column.name :
                        return layouts.column.tag;
                }
            }
        },

        methods : {
            onBiqQuotesSearched : function(event) {
                // bubble the quotes search results returned event
                this.$emit(emitEvents.biqQuotesSearched.name, event);
            },

            onBiqZeroQuotes : function(event) {
                // bubble the zero quotes returned event
                this.$emit(emitEvents.biqZeroQuotes.name, event);
            },
            
            onBiqQuotesError : function(event) {
                // bubble the quotes error event
                this.$emit(emitEvents.biqQuotesError.name, event);
            }
        }
    };
</script>

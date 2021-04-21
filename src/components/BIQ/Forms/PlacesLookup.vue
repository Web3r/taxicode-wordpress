<template>
    <div 
        :class="containerClass"
    >
        <label v-if="label"
            :id="inputID" 
            :for="id"
        >{{label}}</label>
        <vue-typeahead-bootstrap
            ref="locationfield"
            v-model="location"
            :id="id"
            :placeholder="placeholder"
            :size="size"
            :inputClass="errorStateClass"
            :show-all-results="true"
            :show-on-focus="true"
            :data="locations"
            :serializer="item => item.string"
            @hit="selectedLocation = $event"
        >
            <template
                slot="prepend"
            ></template>

            <template 
                slot="suggestion" 
                slot-scope="{ data, htmlText }"
            >
                <div class="d-flex align-items-center">
                    <span v-if="data.type=='station'"><font-awesome-icon icon="train" /></span>
                    <span v-else-if="data.type=='airport'"><font-awesome-icon icon="plane" /></span>
                    <span v-else><font-awesome-icon icon="map-marker-alt" /></span>
                    <span class="ml-4" v-html="htmlText"></span>
                </div>
            </template>

            <template
                slot="append"
            ></template>
        </vue-typeahead-bootstrap>
    </div>
</template>

<script>
    // import the BIQ API places lookup
    import { placesLookup } from '@BIQ/API/Quote';
    // import underscore for the ability to debounce the autocomplete lookup function
    import _ from 'underscore';
    // import the component for the autocomplete input & options list
    import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the places input value is updated
        input : {
            name : 'input'
        },
        // when there is an error with the BIQ API places lookup
        biqPlacesLookupError : {
            name : 'biqPlacesLookupError'
        }
    };

    export default {
        name : 'PlacesLookup',

        components : {
            'vue-typeahead-bootstrap' : VueTypeaheadBootstrap
        },

        props : {
            biqPlacesLookup : {
                type : String,
                required : true,
                default : '//places/?term='
            },

            biqPublicKey : {
                type : String,
                required : true,
                default : ''
            },

            id : {
                type : String,
                default : 'biq-places-lookup'
            },

            placeholder : {
                type : String,
                default : 'Location postcode or place name'
            },

            label : {
                type : String,
                default : ''
            },

            value : {
                type : String,
                default : ''
            },

            required : {
                type : Boolean,
                default : false
            },

            size: {
                type : String,
                default : null,
                validator : size => ['lg', 'sm'].indexOf(size) > -1
            },

            containerClass : {
                type : String,
                default : ''
            },

            validClass : {
                type : String,
                default : ''
            },

            errorClass : {
                type : String,
                default : 'is-invalid'
            },

            errorState : {
                type : String,
                default : null
            },

            debugging : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
                locations : [],
                force_lookup : true
            };
        },

        updated() {
            if(this.force_lookup) {
                this.locationSearch(this.value);
            } else {
                this.$refs.locationfield.inputValue = this.value;
            }
        },

        watch : {
            location : {
                handler : _.debounce(function(term) { this.locationSearch(term); }, 500),
                immediate : true
            }
        }, 

        computed : {
            // Computed value because it's a prop & v-modelled 
            location : {
                get() {
                    // return the prop version of the value
                    return this.value;
                },
                set(location_string) {
                    // let the v-modeller know the value has changed
                    this.$emit(emitEvents.input.name, location_string);
                }
            },

            inputID : function() {
                return `${this.id}-input`;
            },

            errorStateClass : function() {
                const errorState = (this.errorState == null)
                    ? ''
                    : this.errorState
                        ? this.errorClass
                        : this.validClass;
                return `${this.id} ${errorState}`;
            }
        },

        methods : {
            locationSearch : function(term) {
                // make sure there is a point in even attempting the lookup
                if(term === null || typeof(term) !== 'string' || term.length < 1) {
                    return;
                }
                if(this.debugging) {
                    console.log(`BIQ Places ${this.label} lookup to API '${this.biqPlacesLookup}'`, term);
                }
                this.force_lookup = false;
                this.$refs.locationfield.inputValue = term;
                // needs to return the data structure of an option for use in the typeahead listitem
                const sortMap = (string, type) => { return { string, type }; };
                const self = this;
                // make the api places look up call
                placesLookup(this.biqPlacesLookup, this.biqPublicKey, term, sortMap, this.debugging)
                .then(r => {
                    // set the location results
                    self.locations = r;
                })
                .catch(e => {
                    // no locations available
                    self.locations = [];
                    if(self.debugging) {
                        console.error(e.data.message, e.data);
                    }
                    // trigger the error event
                    self.$emit(emitEvents.biqPlacesLookupError.name, e);
                });
            },

            validate : function() {
                // if it's not required, not null or empty, it validates, simple
                return !(this.required && (this.value == null || this.value == ''));
            }
        }
    };
</script>

<template>
    <div class="form-group">
        <label 
            :for="inputID" 
            :id="id"
        >{{label}}</label>
        <vue-typeahead-bootstrap
            ref="locationfield"
            v-model="location"
            :id="inputID"
            :placeholder="placeholder"
            :inputClass="errorStateClass"
            :show-all-results="true"
            :show-on-focus="true"
            :data="locations"
            :serializer="item => item.string"
            @hit="selectedLocation = $event"
        >
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
        </vue-typeahead-bootstrap>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'underscore';
    import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

    export default {
        name : 'PlacesLookup',

        components : {
            'vue-typeahead-bootstrap' : VueTypeaheadBootstrap
        },

        props : {
            apiPlacesLookup : {
                type : String,
                required : true,
                default : '//places/?term='
            },

            id : {
                type : String,
                default : 'biq-places-lookup'
            },

            label : {
                type : String,
                default : 'Location'
            },

            placeholder : {
                type : String,
                default : 'Location postcode or place name'
            },

            value : {
                type : String,
                default : ''
            },

            required : {
                type : Boolean,
                default : false
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
                    this.$emit('input', location_string);
                }
            },

            inputID : function() {
                return `${this.id}-input`;
            },

            errorStateClass : function() {
                return this.errorState == null
                    ? ''
                    : this.errorState
                        ? this.errorClass
                        : this.validClass;
            }
        },

        methods : {
            locationSearch : function(term) {
                // make sure there is a point in even attempting the lookup
                if(term === null || typeof(term) !== 'string' || term.length < 3) {
                    return;
                }
                if(this.debugging) {
                    console.info(`BIQ Places ${this.label} lookup to API '${this.apiPlacesLookup}'`);
                    console.log(term);
                }
                this.force_lookup = false;
                this.$refs.locationfield.inputValue = term;
                const self = this;
                const apiPlacesLookupURL = `${this.apiPlacesLookup}${term}`;
                let airports = [];
                let stations = [];
                let locations = [];
                axios.get(apiPlacesLookupURL)
                .then(response => {
                    // @todo make sure results are usable
                    if(self.debugging) {
                        console.info(`BIQ Places ${this.label} response`);
                        console.log(response);
                    }
                    if(response.data.status != 'OK') {
                    // throw new error event & let the catch() handle creating the event
                        // there's nothing usable in the response except the error
                        throw new ErrorEvent(response.data.status, {
                            error : new Error(`BIQ Places ${self.label} lookup to API Error`),
                            message : response.data[response.data.status.toLowerCase()]
                        });
                    }
                    const results = response.data.results;
                    // needs to return the data structure of an option for use in the typeahead listitem
                    const sortMap = (string, type) => { return { string, type }; };
                    // check for train station locations
                    if(typeof(results.STATION) != 'undefined') {
                        stations = results.STATION.map(name => sortMap(name, 'station'));
                    }
                    // check for airport locations
                    if(typeof(results.AIRPORT) != 'undefined') {
                        airports = results.AIRPORT.map(name => sortMap(name, 'airport'));
                    }
                    // check for POI locations
                    if(typeof(results.LOCATION) != 'undefined') {
                        locations = results.LOCATION.map(name => sortMap(name, 'location'));
                    }
                    const google = results.GOOGLE.map(data => sortMap(data.string, (data.poi) ? 'poi' : 'general'));
                    // construct the places lookup location options in order of precidence
                    self.locations = airports.concat(stations, locations, google);
                })
                .catch(error => {
                    self.locations = [];
                    // create the error event data
                    const event = {
                        data : {
                            id : self.id,
                            URL : apiPlacesLookupURL,
                            message : error.message || `Unknown BIQ Places ${self.label} lookup to API Error`,
                            error
                        }
                    };
                    // trigger the error event
                    self.$emit('biqPlacesLookupError', event);
                });
            },

            validate : function() {
                // if it's not required, not null or empty, it validates, simple
                return !(this.required && (this.value == null || this.value == ''));
            }
        }
    };
</script>

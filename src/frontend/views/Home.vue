<template src="./templates/Home.html"></template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import SearchResults from '@/components/BIQ/SearchResults.vue';
    import axios from 'axios';
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import _ from 'underscore'

    export default {
        name: 'Home',

        components : {
            'vue-bootstrap-typeahead' : VueBootstrapTypeahead,
            'BIQ-SearchResults' : SearchResults,
        },

        props: {
            appConfig : {
                type : Object,
                required : true,
                default : null
            },

            appSettings : {
                type : Object,
                required : true,
                default : null
            },
            
            debugging : {
                type : Boolean,
                default : false
            },

            searchFormData : {
                type : Object,
                default : {}
            },

            search_on_load : {
                type : Boolean,
                default : false
            },

            quote_type : {
                type : String,
                default : ''
            }
        },

        data() {
            return {
                journey_options : [
                    'One Way',
                    'Return'
                ],
                journey_type : 'One Way',
                pickup : '',
                via : '',
                vialocations : [],
                pickuplocations : [],
                destinationlocations : [],
                destination : '',
                date : '',
                time : '',
                return_date : '',
                return_time : '',
                people : '1',
                errors : {
                    pickup : false,
                    destination : false,
                    date : null,
                    time : null,
                    people : false
                },
                loading_quotes_error : 'Sorry, we could not find any quotes for the selected journey.  Please try a different journey.'
            }
        },

        watch : {
            // detect location / places lookup
            pickup : _.debounce(function(newPickup) { this.locationSearch(newPickup, 'pickup') }, 500),
            destination : _.debounce(function(newDestination) { this.locationSearch(newDestination, 'destination') }, 500),
            via : _.debounce(function(newVia) { this.locationSearch(newVia, 'via') }, 500)
        },

        mounted() {
            // populate the search form from the state
            this.setSearchFormState();
            if(this.searchFormData != null) {
                // set the search form values from the supplied prop data
                this.setSearchFormPropData();
            }
            // set the referenced input field values
            this.$refs.pickupfield.inputValue = this.pickup;
            this.$refs.destinationfield.inputValue = this.destination;
            this.$refs.viafield.inputValue = this.via;
            if(this.search_on_load) {
                // submit the journey quote search
                this.onSearchQuotesFormSubmit();
            }
        },

        computed : mapGetters([
        // BIQ Quote Search state
            'searchDetails',
        // BIQ Quoting state
            'loadingQuotes', 
            'quotesLoaded', 
            'journeyID', 
            'journeyQuotes'
        ]),

        methods : {
            ...mapActions([
            // BIQ Quote Search state
                'searchingQuotes', 
                'searchedQuotes', 
            // BIQ Quoting state
                'apiQuotesError'
            ]),

            setSearchFormState : function() {
                // first set the form to current search form state
                const searchState = this.searchDetails;
                console.log(searchState);
                this.journey_type = searchState.journey_type;
                this.pickup = searchState.pickup;
                this.destination = searchState.destination;
                if(searchState.vias.length) {
                    // set the first via (as there is only 1 via but it's expected as a list)
                    this.via = searchState.vias[0];
                }
                // @todo check that the date is in the future & adjust if not
                this.date = searchState.date;
                // @todo check that the date and time is in the future & adjust if not
                this.time = searchState.time;
                this.people = searchState.people;
                if(this.journey_type === 'Return' && searchState.returning.date !== null) {
                // @todo check that the date is in the future and after the outbound date & adjust if not
                    this.return_date = searchState.returning.date;
                }
                if(this.journey_type === 'Return' && searchState.returning.time !== null) {
                // @todo check that the date and time is in the future and after the outbound date time & adjust if not
                    this.return_time = searchState.returning.time;
                }
            },

            setSearchFormPropData : function() {
                // overwrite the search form details with any POSTed values from the server side generation
                if(typeof this.searchFormData.journey_type != 'undefined') {
                    this.journey_type = this.searchFormData.journey_type
                }
                if(typeof this.searchFormData.pickup != 'undefined') {
                    this.pickup = this.searchFormData.pickup
                }
                if(typeof this.searchFormData.destination != 'undefined') {
                    this.destination = this.searchFormData.destination
                }
                if(typeof this.searchFormData.via != 'undefined') {
                    this.via = this.searchFormData.via
                }
                if(typeof this.searchFormData.date != 'undefined') {
                // @todo check that the date is in the future & adjust if not
                    this.date = this.searchFormData.date
                }
                if(typeof this.searchFormData.time != 'undefined') {
                // @todo check that the date and time is in the future & adjust if not
                    this.time = this.searchFormData.time
                }
                if(typeof this.searchFormData.people != 'undefined') {
                    this.people = this.searchFormData.people
                }
                if(typeof this.searchFormData.return_date != 'undefined') {
                // @todo check that the date is in the future and after the outbound date & adjust if not
                    this.return_date = this.searchFormData.return_date
                }
                if(typeof this.searchFormData.return_time != 'undefined') {
                // @todo check that the date and time is in the future and after the outbound date time & adjust if not
                    this.return_time = this.searchFormData.return_time
                }
            },

            locationSearch(term, type='pickup') {
                if(term === null || typeof(term) !== 'string' || term.length < 3) {
                    return;
                }
                let airports = [];
                let stations = [];
                let locations = [];
                const apiPlacesURL = `${this.appSettings.biq_api_host}${this.appConfig.PLACES_URI}`;
                if(this.debugging) {
                    console.info(`BIQ Places lookup to API '${apiPlacesURL}'`);
                    console.log(term);
                }
                axios.get(`${apiPlacesURL}${term}`)
                .then((res) => {
                    if(typeof(res.data.results.STATION) != 'undefined') {
                        stations = res.data.results.STATION.map(value => { 
                            return {
                                string : value,
                                type : 'station'
                            }
                        });
                    }

                    if(typeof(res.data.results.AIRPORT) != 'undefined') {
                        airports = res.data.results.AIRPORT.map(value => { 
                            return {
                                string : value,
                                type : 'airport'
                            };
                        });
                    }

                    if(typeof(res.data.results.LOCATION) != 'undefined') {
                        locations = res.data.results.LOCATION.map(value => { 
                            return {
                                string : value,
                                type : 'location'
                            };
                        });
                    }

                    const results = airports.concat(stations.concat(locations.concat(res.data.results.GOOGLE)));
                     switch(type) {
                        case 'pickup' :
                            this.pickuplocations = results;
                        break;
                        case 'via' :
                            this.vialocations = results;
                        break;
                        default :
                            this.destinationlocations = results;
                    }
                })
                .catch((error) => {
                    let message = 'Unknown BIQ Places API Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.info({...error});
                });
            },

            onSearchQuotesFormSubmit : function(evt) {
                evt.preventDefault();
                if(this.validSearchForm()) {
                    this.searchApiQuotes();
                } else {
                    if(this.debugging) {
                        console.group("BIQSearchForm Validation Error");
                        console.info({...this.errors});
                        console.groupEnd();
                    }
                }
            },

            validSearchForm() {
                // reset the common validation error flags
                this.errors = {
                    pickup : false,
                    destination : false,
                    date : null,
                    time : null,
                    people : false
                }
                // just keep a track of any errors
                let errors = 0;
                if(this.pickup == null || this.pickup == '') {
                    this.errors.pickup = 'Pickup location must be set';
                    errors++;
                }

                if(this.destination == null || this.destination == '') {
                    this.errors.destination = 'Destination location must be set';
                    errors++;
                }
                // @todo validate input value is an integer between 1 & 99
                if(this.people == '') {
                    this.errors.people = "Number of passengers must be between 1 and 99";
                    errors++;
                }
                // @todo validate date is not in the past
                if(this.date == null || this.date == '') {
                    this.errors.date = "Journey date is invalid";
                    errors++;
                }
                // @todo validate that the date time is not in the past
                if(this.time == null || this.time == '') {
                    this.errors.time = "Journey time is invalid";
                    errors++;
                }
                // @todo validate the return date time are not before the 
                //       outbound date time if there is a return journey included
                // only valid if no errors encountered
                return (errors == 0);
            },

            searchApiQuotes : function() {
                const page = this;
                const journey_details = {
                    journey_type : this.journey_type,
                    pickup : this.pickup,
                    destination : this.destination, 
                    date : this.date, 
                    time : this.time, 
                    people : this.people
                };
                let quotes = [];
                let journey_id = null;
                let apiQuotesURI = `pickup=${this.pickup}&destination=${this.destination}&date=${this.date} ${this.time}&people=${this.people}`;
                if(this.journey_type == 'Return') {
                // add the optional return journey details
                    apiQuotesURI = `${apiQuotesURI}&return=${this.return_date} ${this.return_time}`;
                    journey_details.returning = {
                        date : this.return_date, 
                        time : this.return_time, 
                    };
                } else {
                    // make sure the state doesn't have previous return date & time still included
                    journey_details.returning = {
                        date : null, 
                        time : null, 
                    };
                }
                if(this.via != '') {
                // add the optional journey via location(s)
                    apiQuotesURI = `${apiQuotesURI}&via=${this.via}`;
                    // vias is expected as a list but only 1 via is available
                    journey_details.vias = [this.via];
                } else {
                    // make sure the state doesn't have previous via still included
                    journey_details.vias = [];
                }
                // update the state with the journey details being quoted for
                // also updates the state flag for loading quotes
                this.searchingQuotes(journey_details);
                const apiQuotesURL = `${this.appSettings.biq_api_host}${this.appConfig.QUOTE_URI}`;
                if(this.debugging) {
                    console.info(`Loading BIQ Quotes from API '${apiQuotesURL}'`);
                }
                // get the quotes for the specified journey details
                axios.get(`${apiQuotesURL}?key=${this.appSettings.biq_pk}&${apiQuotesURI}`)
                .then((response) => {
                    if(page.debugging) {
                        console.log(response);
                    }
                    if(response.data.status != "OK") {
                        page.apiQuotesError(response.error);
                        return;
                    }
                    if(Object.keys(response.data.quotes).length > 0) {
                        if(page.appSettings.quote_type == 'type_class') {
                        // sort the quotes first
                            quotes = page.reduceToTypeAndClass(response.data.quotes);
                        } else {
                        // raw unsorted API quotes results
                            quotes = response.data.quotes;
                        }
                    } else {
                        // @todo check the warnings from the API response for reason
                    }
                    journey_id = response.data.journey_id;
                    // update the state with the journey ID and the quote results
                    // also updates the state flags for loading quotes, quotes loaded & zero quotes
                    page.searchedQuotes({ 
                        journey_id : journey_id, 
                        journey_details : response.data.journey, 
                        quotes : response.data.quotes, 
                        display : quotes 
                    });
                    // not for this release, too much extra is needed to function
                    // push the journey ID on to the URL so it can be directly linked to
                    // page.$router.push({ 
                    //     name : 'HomeSearched', 
                    //     params : { 
                    //         journey : journey_id 
                    //     } 
                    // });
                })
                .catch((error) => {
                    let message = 'Unknown BIQ Quotes API Error';
                    if(error.hasOwnProperty('message') && error.message) {
                        message = error.message;
                    }
                    console.error(message);
                    console.info({...error});
                    page.apiQuotesError(message);
                });
            },

            reduceToTypeAndClass: function(quotes) {
                // sorting taking from app, but needs further reconstructing for web UI
                const sorted_quotes = this.formatQuotes(quotes);
                if(this.debugging) {
                    console.log(sorted_quotes);
                }
                const sorted = sorted_quotes.sorted;
                const display = {};
                if(sorted.hasOwnProperty('recommended') && sorted.recommended.length) {
                    display['cheapest'] = sorted.recommended[0];
                }
                if(sorted.hasOwnProperty('executive') && sorted.executive.length) {
                    display['exec'] = sorted.executive[0];
                }
                if(sorted.hasOwnProperty('vip') && sorted.vip.length) {
                    display['luxury'] = sorted.vip[0];
                }
                if(sorted.hasOwnProperty('chauffeur') && sorted.chauffeur.length) {
                    display['chauffeur'] = sorted.chauffeur[0];
                }
                if(this.debugging) {
                    console.log(display);
                }
                return display;
            },

            formatQuotes : function(quotes) {
                // initiate quotes keys
                let raw = {};
                let sorted = {};

                for(let key in quotes) {
                    // get the current object based on key
                    let temp = quotes[key];

                    // skip the non active quotes
                    if(temp.active) {
                        // put it on the raw list first
                        raw[key] = temp;

                        // add quote id to temp in order to use it as unique key in Flat Lists
                        temp['quote_id'] = key;

                        // loop through quote's vehicles
                        for(let i = 0; i < temp['vehicles'].length; i++) {

                            // get a copy of temp so we don't affect temp object
                            let temp_copy = { ...temp };

                            // get vehicle details
                            temp_copy['vehicle'] = temp['vehicles'][i];

                            // save vehicle index
                            temp_copy['vehicle']['index'] = i;

                            // set price to vehicle price
                            temp_copy['price'] = temp_copy['vehicle']['price'];

                            // get vehicle class
                            let vehicle_class = temp_copy['vehicle']['type']['class'];

                            // remove vehicles array because we already have the vehicle details now
                            delete temp_copy['vehicles'];

                            // if recommended key is not present, set it
                            if(!sorted.hasOwnProperty('recommended')) {
                                sorted['recommended'] = []
                            }

                            // check if quote has a highlight
                            if(!!temp_copy.highlight) {
                                // only add it to recommended if it's the first vehicle of quote
                                if(i === 0) {
                                    sorted['recommended'].push(temp_copy);
                                } else {
                                    temp_copy['highlight'] = false;
                                }
                            }

                            // if all key is not present, set it
                            if(!sorted.hasOwnProperty('all')) {
                                sorted['all'] = [];
                            }

                            // append the temp to all
                            sorted['all'].push(temp_copy);

                            // if vehicle class is not a key of the sorted array, make it one
                            if(!sorted.hasOwnProperty(vehicle_class)) {
                                sorted[vehicle_class] = [];
                            }

                            // append the temp to its relevant class
                            sorted[vehicle_class].push(temp_copy);

                        }
                    }
                }

                for(let type in sorted) {
                    sorted[type] = this.sortQuotes(sorted[type], 'SORT_BY_PRICE');
                }
                return { raw, sorted };
            },

            sortQuotes : function(quotes, field) {
                switch(field) {
                    case 'SORT_BY_PRICE' :
                    // price sort is ascending
                        return quotes.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
                    case 'SORT_BY_RATING' :
                    // rating sort is descending
                        return quotes.sort((a,b) => (a.rating.score > b.rating.score) ? -1 : ((b.rating.score > a.rating.score) ? 1 : 0));
                    default :
                        return quotes;
                }
            }
        }
    }
</script>

<style scoped>

</style>

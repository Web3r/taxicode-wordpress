<template src="./templates/Home.html"></template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import _ from 'underscore'

    export default {
        name: 'search',

        components : {
            'vue-bootstrap-typeahead' : VueBootstrapTypeahead,
        },

        props: {
            postData: []
        },

        data() {
            return {
                journey_options: ['One Way','Return'],
                type_map : {
                    cheapest: 'Cheapest Price',
                    exec: 'Best Executive',
                    luxury: 'Best Luxury',
                    chauffeur :'Best Chauffeur'
                },
                journey_type: 'One Way',
                pickup: '',
                via: '',
                vialocations: [],
                pickuplocations: [],
                destinationlocations: [],
                destination: '',
                date: '',
                time: '',
                return_date: '',
                return_time: '',
                people: '1',
                quotes: [],
                journey_id: '',
                errors: {
                    pickup: false,
                    destination: false,
                    date: null,
                    time: null,
                    people: false
                },
                quote_settings: ''
            }
        },

        watch: {
            // When the query  changes, fetch new results from
            // the API - in practice this action should be debounced
            pickup: _.debounce(function(newPickup) { this.locationSearch(newPickup,'pickup') }, 500),
            destination: _.debounce(function(newDestination) { this.locationSearch(newDestination,'destination') }, 500),
            via: _.debounce(function(newVia) { this.locationSearch(newVia,'via') }, 500),

        },

        created() {
            //set in page js before load, and imported here
            this.postData = postData;
            this.mapPostToForm();
            this.quote_settings = quote_settings;
            // define a function to add leading zeros to the date time values for string value use
            const az = i => (i<10) ? i="0"+i : i;
            const d = new Date();
            // just put the date & time forward a little
            d.setDate(d.getDate() + 1);
            d.setHours(d.getHours() + 2);
            // getMonth is zero based, getDate is not
            this.date = d.getFullYear() + "-" + az(d.getMonth() +1) + "-" + az(d.getDate());
            this.time = az(d.getHours()) + ":" + az(d.getMinutes()) + ":" + az(d.getSeconds());
        },

        mounted() {
            this.$refs.pickupfield.inputValue = this.pickup;
            this.$refs.destinationfield.inputValue = this.destination;
            this.$refs.viafield.inputValue = this.via;
            if(this.postData.search_on_load) {
                this.submitForm();
            }
        },

        computed: mapGetters([
        // BIQ Quote Search state
            'searchDetails',
            'displayQuotes',
        // BIQ Quoting state
            'loadingQuotes', 
            'quotesLoaded', 
            'zeroQuotes',
            'journeyID', 
            'journeyQuotes'
        ]),

        methods: {
            ...mapActions([
            // BIQ Quote Search state
                'searchingQuotes', 
                'searchedQuotes',
            // Book Now Checkout state
                'bookNow'
            ]),

            onBookNowClicked: function(params, event) {
                console.group("Book Now Clicked");
                console.info(params);
                console.info(this.journeyQuotes[params.quote]);
                console.info(event);
                console.groupEnd();
                this.bookNow({
                    quote : this.journeyQuotes[params.quote], 
                    vehicle : params.vehicle,
                    
                });
            },

            mapPostToForm: function() {
                if(typeof this.postData.journey_type!='undefined') {
                    this.journey_type = this.postData.journey_type
                }
                if(typeof this.postData.pickup!='undefined') {
                    this.pickup = this.postData.pickup
                }
                if(typeof this.postData.destination!='undefined') {
                    this.destination = this.postData.destination
                }
                if(typeof this.postData.via!='undefined') {
                    this.via = this.postData.via
                }
                if(typeof this.postData.date!='undefined') {
                    this.date = this.postData.date
                }
                if(typeof this.postData.time!='undefined') {
                    this.time = this.postData.time
                }
                if(typeof this.postData.people!='undefined') {
                    this.people = this.postData.people
                }
                if(typeof this.postData.return_date!='undefined') {
                    this.return_date = this.postData.return_date
                }
                if(typeof this.postData.return_time!='undefined') {
                    this.return_time = this.postData.return_time
                }
            },

            setPrice : function(price) {
                this.$store.commit('setPrice',price)
            },

            queryApi: function() {
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
                let url = config.QUOTE_URL+'?key='+tc_public_key+'&pickup=' + this.pickup + '&destination=' + this.destination + '&date=' + this.date + ' ' + this.time + '&people=' + this.people
                if(this.journey_type=='Return') {
                // add the optional return journey details
                    url = url +'&return='+this.return_date+' '+this.return_time;
                    journey_details.returning = {
                        date : this.return_date, 
                        time : this.return_time, 
                    };
                }
                if(this.via!='') {
                // add the optional journey via location(s)
                    url = url + '&via='+this.via;
                    journey_details.via = this.via;
                }
                // update the state with the journey details being quoted for
                // also updates the state flag for loading quotes
                this.searchingQuotes(journey_details);
                // get the quotes for the specified journey details
                axios.get(url)
                .then(function (response) {
                    if(Object.keys(response.data.quotes).length > 0) {
                        if(this.quote_settings=='type_class') {
                        // sort the quotes first
                            quotes = this.reduceToTypeAndClass(response.data.quotes);
                        } else {
                        // raw unsorted API quotes results
                            quotes = response.data.quotes;
                        }
                        journey_id = response.data.journey_id;
                    }
                    this.journey_id = journey_id;
                    this.quotes = quotes;
                    // update the state with the journey ID and the quote results
                    // also updates the state flags for loading quotes, quotes loaded & zero quotes
                    this.searchedQuotes({ id : journey_id, quotes : response.data.quotes, display : quotes });
                }.bind(this));
                // @todo add an error catch for when the API throws a fit
            },

            reduceToTypeAndClass: function(quotes) {
                //sorting taking from app, but needs further reconstructing for web UI
                const sorted_quotes = this.formatQuotes(quotes);
                console.log(sorted_quotes);
                const sorted = sorted_quotes.sorted;
                const display = {};
                if(sorted.hasOwnProperty('recommended') && sorted.length) {
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
                console.log(display);
                return display;
            },

            formatQuotes: function (quotes) {
                // initiate quotes keys
                let raw = {};
                let sorted = {};

                for (let key in quotes) {
                    // get the current object based on key
                    let temp = quotes[key];

                    // skip the non active quotes
                    if (temp.active) {
                        // put it on the raw list first
                        raw[key] = temp;

                        // add quote id to temp in order to use it as unique key in Flat Lists
                        temp['quote_id'] = key;

                        // loop through quote's vehicles
                        for (let i = 0; i < temp['vehicles'].length; i++) {

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
                            if (!sorted.hasOwnProperty('recommended')) {
                                sorted['recommended'] = []
                            }

                            // check if quote has a highlight
                            if (!!temp_copy.highlight) {
                                // only add it to recommended if it's the first vehicle of quote
                                if (i === 0) {
                                    sorted['recommended'].push(temp_copy);
                                } else {
                                    temp_copy['highlight'] = false;
                                }
                            }

                            // if all key is not present, set it
                            if (!sorted.hasOwnProperty('all')) {
                                sorted['all'] = [];
                            }

                            // append the temp to all
                            sorted['all'].push(temp_copy);

                            // if vehicle class is not a key of the sorted array, make it one
                            if (!sorted.hasOwnProperty(vehicle_class)) {
                                sorted[vehicle_class] = [];
                            }

                            // append the temp to its relevant class
                            sorted[vehicle_class].push(temp_copy);

                        }
                    }
                }

                for (let type in sorted) {
                    sorted[type] = this.sortQuotes(sorted[type], 'SORT_BY_PRICE');
                }
                return { raw, sorted };
            },

            sortQuotes: function (quotes, field) {
                switch (field) {
                    case 'SORT_BY_PRICE':
                        // price sort is ascending
                        return quotes.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);});
                    case 'SORT_BY_RATING':
                        // rating sort is descending
                        return quotes.sort(function(a,b) {return (a.rating.score > b.rating.score) ? -1 : ((b.rating.score > a.rating.score) ? 1 : 0);});
                    default:
                        return quotes;
                }
            },

            submitForm: function() {
                if(this.validQuote()) {
                    this.queryApi();
                };
            },

            validQuote() {
                var errors = true;
                if(this.pickup=='') {
                    this.errors.pickup='Pickup location must be set';
                    errors = false;
                } else {
                    this.errors.pickup = false;
                }

                if(this.destination=='') {
                    this.errors.destination='Pickup location must be set';
                    errors = false;
                } else {
                    this.errors.destination = false;
                }
                if(this.date=='') {
                    this.errors.date = false;
                    errors = false;
                } else {
                    this.errors.date = null;
                }
                if(this.time=='') {
                    this.errors.time=false;
                    errors = false;
                } else {
                    this.errors.time = null;
                }
                if(this.people=='') {
                    this.errors.people==true;
                    errors = false;
                } else {
                    this.errors.people = false;
                }
                return errors;
            },

            flipImage: function(id,event) {
                let price = this.quotes[id].vehicles[event.target.value].price;
                this.$refs[id][2].$el.setAttribute('data-price',price)
                this.$refs[id][0].src = this.quotes[id].vehicles[event.target.value].image;
                this.$refs[id][1].innerHTML = '&pound;'+price+'.00';
                this.setPrice(price+'.00');
            },

            setPriceBeforeTransition: function(id,event) {
                this.setPrice(event.target.dataset.price+'.00');
            },

            locationSearch(string,type='pickup') {
                let airports = [];
                let stations = [];
                let locations = [];
                axios.get(`${config.PLACES_URL}?term=${string}`)
                .then((res) => {

                    if(typeof(res.data.results.STATION)!='undefined') {
                        stations = res.data.results.STATION.map(function(value){
                            const output = {
                                string: value,
                                type : 'station'
                            };
                            return output;
                        });
                    }

                    if(typeof(res.data.results.AIRPORT)!='undefined') {
                        airports = res.data.results.AIRPORT.map(function(value){
                            const output = {
                                string: value,
                                type : 'airport'
                            };
                            return output;
                        });
                    }

                    if(typeof(res.data.results.LOCATION)!='undefined') {
                        locations = res.data.results.LOCATION.map(function(value){
                            const output = {
                                string: value,
                                type : 'location'
                            };
                            return output;
                        });
                    }

                    const results = airports.concat(stations.concat(locations.concat(res.data.results.GOOGLE)));
                    if(type=='pickup') {
                        this.pickuplocations = results;
                    } else if(type=='via') {
                        this.vialocations = results;
                    } else {
                        this.destinationlocations = results;
                    }
                })
            }

        }
    }
</script>

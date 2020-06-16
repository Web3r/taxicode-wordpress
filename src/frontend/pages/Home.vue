<template src="./templates/Home.html">

</template>

<script>
    import axios from 'axios';
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import _ from 'underscore'

    export default {
        name: 'search',
        components : {
            'vue-bootstrap-typeahead' : VueBootstrapTypeahead,
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
                pickup: 'York Station, YO24 1AB',
                via: '',
                vialocations: [],
                pickuplocations: [],
                destinationlocations: [],
                destination: 'York',
                date: '2020-06-26',
                time: '13:00',
                return_date: '',
                return_time: '',
                people: '1',
                quotes: [],
                journey_id: '',
                loading: false,
                errors: {
                    pickup: false,
                    destination: false,
                    date: null,
                    time: null,
                    people: false
                },
                quote_settings: '',
                noquotes: false
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
            this.quote_settings = quote_settings;
        },
        methods: {
            setPrice : function(price) {
                console.log('setting price to'+price);
                this.$store.commit('setPrice',price)
            },
            queryApi: function() {
                this.loading = true;
                this.noquotes = false;
                let url = config.QUOTE_URL+'?key='+tc_public_key+'&pickup=' + this.pickup + '&destination=' + this.destination + '&date=' + this.date + ' ' + this.time + '&people=' + this.people
                if(this.journey_type=='Return')
                {
                    url = url +'&return='+this.return_date+' '+this.return_time;
                }
                if(this.via!='')
                {
                    url = url + '&via='+this.via;
                }
                axios.get(url).then(function (response) {
                    this.loading = false;

                    if(response.data.quotes.length!=0) {
                        if(this.quote_settings=='type_class')
                        {
                            this.quotes = this.reduceToTypeAndClass(response.data.quotes);
                        }
                        else
                        {
                            this.quotes = response.data.quotes;
                        }
                        this.journey_id = response.data.journey_id;
                    }
                    else
                    {
                        this.quotes = [];
                        this.noquotes = true;
                    }
                }.bind(this));
            },
            reduceToTypeAndClass: function(quotes)
            {
                //sorting taking from app, but needs further reconstructing for web UI
                let sorted_quotes = this.formatQuotes(quotes);
                console.log(sorted_quotes);
                let display_quotes = {};
                display_quotes['cheapest'] = sorted_quotes.sorted.recommended[0];
                display_quotes['exec'] = sorted_quotes.sorted.executive[0];
                display_quotes['luxury'] = sorted_quotes.sorted.vip[0];
                display_quotes['chauffeur'] = sorted_quotes.sorted.chauffeur[0];
                console.log(display_quotes);
                return display_quotes;
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
                if(this.pickup=='')
                {
                    this.errors.pickup='Pickup location must be set';
                    errors = false;
                }

                if(this.destination=='')
                {
                    this.errors.destination='Pickup location must be set';
                    errors = false;
                }
                if(this.date=='')
                {
                    this.errors.date = false;
                    errors = false;
                }
                if(this.time=='')
                {
                    this.errors.time=false;
                    errors = false;
                }
                if(this.people=='')
                {
                    this.errors.people==true;
                    errors = false;
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
            locationSearch(string,type='pickup')
            {
                let airports = [];
                let stations = [];
                axios.get(`https://api.taxicode.com/places/?term=${string}`)
                    .then((res) => {
                        if(typeof(res.data.results.STATION)!='undefined')
                        {
                            stations = res.data.results.STATION.map(function(value){
                                const output = {
                                    string: value,
                                    type : 'station'
                                };
                                return output;
                            });
                        }


                        if(typeof(res.data.results.AIRPORT)!='undefined')
                        {
                            airports = res.data.results.AIRPORT.map(function(value){
                                const output = {
                                    string: value,
                                    type : 'airport'
                                };
                                return output;
                            });
                        }
                        const results = airports.concat(stations.concat(res.data.results.GOOGLE));
                        if(type=='pickup') {
                            this.pickuplocations = results;
                        }
                        else if(type=='via')
                        {
                            this.vialocations = results;
                        }
                        else
                        {
                            this.destinationlocations = results;
                        }
                    })
            }

        }
    }
</script>

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
                journey_type: 'One Way',
                pickup: 'York',
                via: '',
                vialocations: [],
                pickuplocations: [],
                destinationlocations: [],
                destination: 'York Station',
                date: '2020-12-12',
                time: '13:00',
                return_date: '2020-12-12',
                return_time: '13:00',
                people: '3',
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

                    console.log(response.data.quotes.length);
                    if(response.data.quotes.length!=0) {
                        this.quotes = response.data.quotes;
                        this.journey_id = response.data.journey_id;
                    }
                    else
                    {
                        this.quotes = [];
                        this.noquotes = true;
                    }
                }.bind(this));
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

<template>
    <div>
        <form id="searchform">
            <div class="row">
                <div class="col-6">
                    <b-form-select v-model="journey_type" :options="journey_options"></b-form-select>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>Pickup</label>
                        <vue-bootstrap-typeahead
                                v-model="pickup"
                                :inputClass="errors.pickup? 'is-invalid' : ''"
                                :data="pickuplocations"
                                :serializer="item => item.string"
                                @hit="selectedLocation = $event"
                                placeholder="Pickup postcode or place name"
                        >
                            <template slot="suggestion" slot-scope="{ data, htmlText }">
                                <div class="d-flex align-items-center">
                                    <span v-if="data.type=='station'"><font-awesome-icon icon="train" /></span>
                                    <span v-else-if="data.type=='airport'"><font-awesome-icon icon="plane" /></span>
                                    <span v-else><font-awesome-icon icon="map-marker-alt" /></span>
                                    <span class="ml-4" v-html="htmlText"></span>
                                </div>
                            </template>
                        </vue-bootstrap-typeahead>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Destination</label>
                        <vue-bootstrap-typeahead
                                v-model="destination"
                                :inputClass="errors.destination? 'is-invalid' : ''"
                                :data="destinationlocations"
                                :serializer="item => item.string"
                                @hit="selectedLocation = $event"
                                placeholder="Destination postcode or place name"
                        >
                            <template slot="suggestion" slot-scope="{ data, htmlText }">
                                <div class="d-flex align-items-center">
                                    <span v-if="data.type=='station'"><font-awesome-icon icon="train" /></span>
                                    <span v-else-if="data.type=='airport'"><font-awesome-icon icon="plane" /></span>
                                    <span v-else><font-awesome-icon icon="map-marker-alt" /></span>
                                    <span class="ml-4" v-html="htmlText"></span>
                                </div>
                            </template>
                        </vue-bootstrap-typeahead>
                    </div>
                </div>

            </div>
            <div class="row">
                <div class="col">
                    <p>Optional: Via</p>
                </div>
                <div class="col">
                    <label>Via</label>
                    <vue-bootstrap-typeahead
                            v-model="via"
                            :inputClass="errors.via? 'is-invalid' : ''"
                            :data="vialocations"
                            :serializer="item => item.string"
                            @hit="selectedLocation = $event"
                            placeholder="Via postcode or place name"
                    >
                        <template slot="suggestion" slot-scope="{ data, htmlText }">
                            <div class="d-flex align-items-center">
                                <span v-if="data.type=='station'"><font-awesome-icon icon="train" /></span>
                                <span v-else-if="data.type=='airport'"><font-awesome-icon icon="plane" /></span>
                                <span v-else><font-awesome-icon icon="map-marker-alt" /></span>
                                <span class="ml-4" v-html="htmlText"></span>
                            </div>
                        </template>
                    </vue-bootstrap-typeahead>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>Date</label>
                        <b-form-datepicker locale="en" class="form-control" :state="errors.date"  v-model="date"></b-form-datepicker>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Time</label>
                        <b-form-timepicker locale="en" v-model="time" :state="errors.time"></b-form-timepicker>
                    </div>
                </div>
            </div>
            <div class="row" v-if="journey_type=='Return'">
                <div class="col">
                    <div class="form-group">
                        <label>Return Date</label>
                        <b-form-datepicker locale="en" class="form-control" :state="errors.return_date"  v-model="return_date"></b-form-datepicker>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Return Time</label>
                        <b-form-timepicker locale="en" v-model="return_time" :state="errors.return_time"></b-form-timepicker>
                    </div>
                </div>

            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>Number of People</label>
                        <input type="number" class="form-control" :class=" errors.people ? 'is-invalid' : ''" placeholder="People" v-model="people">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label></label>
                        <input type="button" class="form-control" value="Search" @click="submitForm">
                    </div>
                </div>
            </div>
        </form>
        <div id="results">
            <div v-if="loading">
                Loading...
            </div>

            <div class="row">
                <div v-for="(quote,id) in quotes" class="col-sm-auto" v-if="quote.highlight">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top" :src="quote.vehicles[0].image" alt="Vehicle type image" :ref="id">
                        <div class="card-header">
                            {{quote.highlight}}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{quote.company_name}}</h5>
                            <p class="card-text text-center display-4" id="selected_price" :ref="id">&pound;{{quote.vehicles[0].price}}.00</p>
                            <select class="custom-select" @change="flipImage(id,$event)">
                                <option
                                        v-for="(vehicle,id) in quote.vehicles"
                                        v-model="quote.selected_vehicle"
                                        :value="id"
                                        :data-image="vehicle.image">
                                    {{vehicle.name}}
                                </option>
                            </select>
                            <router-link :to="{ name: 'Checkout', params: { quote_id: id, journey_id: journey_id} }" class="btn btn-primary btn-block">Book Now</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
                pickup: 'Tooting Broadway',
                via: '',
                vialocations: [],
                pickuplocations: [],
                destinationlocations: [],
                destination: 'Gatwick Airport',
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
                }
            }
        },
        watch: {
            // When the query  changes, fetch new results from
            // the API - in practice this action should be debounced
            pickup: _.debounce(function(newPickup) { this.locationSearch(newPickup,'pickup') }, 500),
            destination: _.debounce(function(newDestination) { this.locationSearch(newDestination,'destination') }, 500),
            via: _.debounce(function(newVia) { this.locationSearch(newVia,'via') }, 500),

        },
        methods: {
            queryApi: function() {
                this.loading = true;
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
                    this.quotes = response.data.quotes;
                    this.journey_id = response.data.journey_id;
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
                this.$refs[id][0].src = this.quotes[id].vehicles[event.target.value].image;
                this.$refs[id][1].innerHTML = '&pound;'+this.quotes[id].vehicles[event.target.value].price+'.00';
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

<template>
    <div>
        <form id="searchform">
            <div class="row">
                <div class="col">
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

                    <!--<input type="text" class="form-control" placeholder="Pickup" v-model="pickup">-->
                </div>
                <div class="col">
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
                <div class="col">
                    <b-form-datepicker class="form-control" :state="errors.date"  v-model="date"></b-form-datepicker>
                    <p> Date: '{{date}}'</p>
                </div>
                <div class="col">
                    <b-form-timepicker v-model="time" :state="errors.time" locale="en"></b-form-timepicker>
                    <div class="mt-2">Value: '{{ time }}'</div>
                </div>
                <div class="col">
                    <input type="number" class="form-control" :class=" errors.people ? 'is-invalid' : ''" placeholder="People" v-model="people">
                </div>
                <div class="col">
                    <input type="button" class="form-control" value="Search" @click="submitForm">
                </div>
            </div>
        </form>
        <div id="results">
            <div class="row">
                <div v-for="(quote,id) in quotes" class="col-sm-auto">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top" :src="quote.vehicles[0].image" alt="Vehicle type image" :ref="id">
                        <div class="card-body">
                            <h5 class="card-title">{{quote.company_name}}</h5>
                            <p class="card-text">{{quote.company_phone}} {{id}}</p>
                            <select @change="flipImage(id,$event)">
                                <option
                                        v-for="(vehicle,id) in quote.vehicles"
                                        v-model="quote.selected_vehicle"
                                        :value="id"
                                        :data-image="vehicle.image">
                                    {{vehicle.name}} - {{vehicle.price}}
                                </option>
                            </select>
                            <router-link :to="{ name: 'Checkout', params: { quote_id: id} }" class="btn btn-primary">Book Now</router-link>
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
                pickup: '',
                pickuplocations: [],
                destinationlocations: [],
                destination: '',
                date: '',
                time: '',
                people: '',
                quotes: [],
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
            destination: _.debounce(function(newDestination) { this.locationSearch(newDestination,'destination') }, 500)

        },
        methods: {
            queryApi: function() {
                axios.get(config.QUOTE_URL+'?key='+config.API_KEY+'&pickup=' + this.pickup + '&destination=' + this.destination + '&date=' + this.date + ' ' + this.time + '&people=' + this.people).then(function (response) {
                    this.quotes = response.data.quotes;
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
                        console.log(results);
                        if(type=='pickup') {
                            this.pickuplocations = results;
                        }
                        else
                        {
                            console.log('setting destintion locations');
                            this.destinationlocations = results;
                        }
                    })
            }

        }
    }
</script>

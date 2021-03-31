<template>
    <div class="col-sm-auto">
        <div class="card quote-card">
            <img 
                :src="display_vehicle_src" 
                alt="Vehicle type image"
                class="card-img-top" 
            />
            <div v-if="displayResultsType=='best' && quote.highlight" 
                class="card-header"
            >{{quote.highlight}}</div>
            <div class="card-body">
                <h5 class="card-title">{{quote.company_name}}</h5>
                <p 
                    v-html="displayPrice"
                    class="card-text text-center display-4"
                ></p>
                <select 
                    @change="onQuoteVehicleChange" 
                    class="custom-select"
                >
                    <option
                        v-for="(vehicle, idx) in quote.vehicles"
                        :key="idx"
                        :value="idx"
                    >{{vehicle.name}}</option>
                </select>
                <biq-book-now-c2a
                    :journeyID="journeyID" 
                    :quoteID="quote.quote_id"
                    :selected-vehicle-index="selected_vehicle"
                    :label="c2aLabel"
                    :useButtons="useButtons"
                    @c2aClick="$emit('c2aClick', $event)"
                ></biq-book-now-c2a>
            </div>
        </div>
    </div>
</template>

<script>
    // import the Book Now Call To Action button
    import BookNowC2A from 'BIQ/QuoteCards/BookNowC2A.vue';

    export default {
        name : 'QuoteCardVehicleSelect',

        components : {
            'biq-book-now-c2a' : BookNowC2A
        },

        // @todo port to a Mixin
        props : {
            journeyID : {
                type : String,
                required : true,
                default : ''
            },

            quote : {
                type : Object,
                required : true,
                default : function() { 
                    return null;
                }
            },

            displayResultsType : {
                type : String,
                required : true,
                default : ''
            },

            c2aLabel : {
                type : String,
                default : 'Book Now'
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

        data() {
            return {
                // @todo port to a Mixin
                quote_price : this.quote.vehicles[this.quote.selected_vehicle].price,
                selected_vehicle : this.quote.selected_vehicle,
                display_vehicle_src : this.quote.vehicles[this.quote.selected_vehicle].image
            };
        },

        computed : {
            // @todo port to a Mixin
            displayPrice : function() {
                return '&pound;' + new Number(this.quote_price).toFixed(2);
            }
        },

        methods : {
            onQuoteVehicleChange : function(event) {
                const vehicle_index = new Number(event.target.value);
                const vehicle = this.quote.vehicles[vehicle_index];
                if(this.debugging) {
                    console.group('Quote Vehicle Changed');
                    console.log(this.quote.quote_id);
                    console.log(vehicle_index);
                    console.log(vehicle.price);
                    console.log(this.quote);
                    console.log(vehicle);
                    console.log(event);
                    console.groupEnd();
                }
                this.selected_vehicle = vehicle_index;
                this.quote_price = vehicle.price;
                this.display_vehicle_src = vehicle.image;
            }
        }
    };
</script>

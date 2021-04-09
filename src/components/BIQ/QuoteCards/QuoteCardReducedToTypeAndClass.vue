<template>
    <div class="col-sm-auto">
        <div class="card quote-card">
            <img 
                :src="display_vehicle_src" 
                :alt="vehicleAlt"
                class="card-img-top" 
            />
            <div class="card-header">
                {{mappedType}}
            </div>
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">{{quote.vehicle.name}}</h6>
                <div class="card-text d-flex justify-content-center align-items-center">
                    <div class="badge badge-pill badge-secondary"><font-awesome-icon icon="users" /> {{quote.vehicle.passengers}}</div>
                    <div>&nbsp;</div>
                    <div class="badge badge-pill badge-secondary"><font-awesome-icon icon="suitcase" /> {{quote.vehicle.luggage_small}}</div>
                </div>
                <p 
                    v-html="displayPrice"
                    class="card-text text-center display-4"
                />
                <biq-book-now-c2a
                    :journeyID="journeyID" 
                    :quoteID="quote.quote_id"
                    :selected-vehicle-index="selected_vehicle"
                    :label="c2aLabel"
                    @c2aClick="onClick"
                ></biq-book-now-c2a>
            </div>
        </div>
    </div>
</template>

<script>
    // import the Book Now Call To Action button
    import BookNowC2A from 'BIQ/QuoteCards/BookNowC2A.vue';
    // import the journey quotes searched booking events
    import { quoteBookingEvents as emitEvents } from '@/common/BIQ/QuotesSearched';

    export default {
        name : 'QuoteCardReducedToTypeAndClass',

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

            type : {
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
            }
        },

        data() {
            return {
                type_map : {
                    cheapest : 'Cheapest Price',
                    exec : 'Best Executive',
                    luxury : 'Best Luxury',
                    chauffeur :'Best Chauffeur'
                },
                // @todo port to a Mixin
                quote_price : this.quote.price,
                selected_vehicle : this.quote.selected_vehicle,
                display_vehicle_src : this.quote.vehicle.image
            };
        },

        computed : {
            // @todo port to a Mixin
            displayPrice : function() {
                return '&pound;' + new Number(this.quote_price).toFixed(2);
            },

            mappedType : function() {
                return (this.type_map.hasOwnProperty(this.type)) 
                    ? this.type_map[this.type] 
                    : 'undefined';
            },

            vehicleAlt : function() {
                return `${this.mappedType} Vehicle type image`;
            }
        },

        methods : {
            onClick : function(event) {
                // bubble the call to action click event
                this.$emit(emitEvents.biqQuoteBookNow.name, event);
            }
        }
    };
</script>

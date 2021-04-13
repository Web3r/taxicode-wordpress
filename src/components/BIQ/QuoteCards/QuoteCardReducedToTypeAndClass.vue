<template>
    <div class="col-sm-auto">
        <div class="card quote-card">
            <img 
                :src="display_vehicle_src" 
                :alt="vehicleAlt"
                class="card-img-top" 
            />

            <div class="card-header">{{mappedType}}</div>

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
    // import the mixin that controls the BIQ Quote Card layout worries
    import biqQuoteCardMixin from 'BIQ/mixins/QuoteCardMixin';
    
    // define the Reduced to vehicle type & class specific component properties 
    // (inherits props from QuoteCardMixin)
    const props = {
        type : {
            type : String,
            required : true,
            default : ''
        }
    };
    // define the Reduced to vehicle type & class specific component computed property methods
    // (inherits computed from QuoteCardMixin)
    const computed = {
        mappedType : function() {
            return (this.type_map.hasOwnProperty(this.type)) 
                ? this.type_map[this.type] 
                : 'undefined';
        },

        vehicleAlt : function() {
            return `${this.mappedType} Vehicle type image`;
        }
    };

    export default {
        name : 'QuoteCardReducedToTypeAndClass',
        props,
        computed,

        mixins : [
            biqQuoteCardMixin
        ],

        data() {
            // need to extract the mixin data as this method destroys that object
            const mixinData = biqQuoteCardMixin.data.call(this);
            return {
                // include the mixin data
                ...mixinData,
                // override the vehicle image src from the mixin
                display_vehicle_src : this.quote.vehicle.image,
                // component specific data
                type_map : {
                    cheapest : 'Cheapest Price',
                    exec : 'Best Executive',
                    luxury : 'Best Luxury',
                    chauffeur :'Best Chauffeur'
                }
            };
        }
    };
</script>

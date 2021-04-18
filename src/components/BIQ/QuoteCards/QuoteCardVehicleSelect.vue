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
                    <option v-for="(vehicle, idx) in quote.vehicles"
                        :key="idx"
                        :value="idx"
                    >{{vehicle.name}}</option>
                </select>

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

    // define the Vehicle select specific component properties 
    // (inherits props from QuoteCardMixin)
    const props = {
        displayResultsType : {
            type : String,
            required : true,
            default : ''
        }
    };
    // define the list of events the component emits & can be listened for
    // (inherits emitted events from QuoteCardMixin)
    const emitEvents = {
        // when the quote vehicle is changed
        vehicleChange : {
            name : 'vehicleChange'
        }
    };
    // define the Vehicle select specific component methods
    // (inherits methods from QuoteCardMixin)
    const methods = {
        onQuoteVehicleChange : function(evt) {
            const vehicle_index = new Number(evt.target.value);
            const vehicle = this.quote.vehicles[vehicle_index];
            if(this.debugging) {
                console.group('Quote Vehicle Changed');
                console.log('Quote ID', this.quote.quote_id);
                console.log('Vehicle Index', vehicle_index);
                console.log('Price', vehicle.price);
                console.log('Quote', this.quote);
                console.log('Vehicle', vehicle);
                console.log('Event', evt);
                console.groupEnd();
            }
            // update the details changed 
            this.selected_vehicle = vehicle_index;
            this.quote_price = vehicle.price;
            this.display_vehicle_src = vehicle.image;
            // create a new event object to represent the vehicle change new data
            const vehicleChangeEvent = {
                data : {
                    quote_id : this.quote.quote_id,
                    price : vehicle.price,
                    vehicle_index,
                    vehicle
                }
            }
            // trigger the vehicle change event
            this.$emit(emitEvents.vehicleChange.name, vehicleChangeEvent);
        }
    };

    export default {
        name : 'QuoteCardVehicleSelect',
        props,
        methods,

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
                display_vehicle_src : this.quote.vehicles[mixinData.selected_vehicle].image
            };
        }
    };
</script>

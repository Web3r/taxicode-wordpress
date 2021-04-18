<template>
    <button
        :class="styleClass"
        @click="onClick"
    >{{label}}</button>
</template>

<script>
    // define the component properties
    const props = {
        journeyID : {
            type : String,
            required : true,
            default : ''
        },

        quoteID : {
            type : String,
            required : true,
            default : ''
        },

        selectedVehicleIndex : {
            type : Number,
            required : true,
            default : 0
        },

        label : {
            type : String,
            default : 'Book Now'
        },

        styleClass : {
            type : String,
            default : 'form-control btn btn-primary'
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the call to action button is clicked
        c2aClick : {
            name : 'c2aClick'
        }
    };
    // define the component methods
    const methods = {
        onClick : function(evt) {
            // add the quote ID & the selected vehicle index to the event data
            evt.data = {
                journeyID : this.journeyID, 
                quoteID : this.quoteID,
                selectedVehicleIndex : this.selectedVehicleIndex
            };
            // trigger the call to action click event
            this.$emit(emitEvents.c2aClick.name, evt);
        }
    };

    export default {
        name : 'BookNowC2A',
        props,
        methods
    };
</script>

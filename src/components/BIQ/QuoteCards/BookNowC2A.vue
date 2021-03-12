<template>
    <button v-if="useButtons"
        @click="onClick"
        class="form-control btn btn-primary"
    >{{label}}</button>
    
    <router-link v-else 
        :to="target" 
        @click="onClick"
        class="btn btn-primary btn-block" 
    >{{label}}</router-link>
</template>

<script>
    export default {
        name : 'BookNowC2A',

        props : {
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

            useButtons : {
                type : Boolean,
                default : true
            }
        },

        data() {
            return {
                target : {
                    name : 'CheckoutPage',
                    params : {
                        journey : this.journeyID, 
                        quote : this.quoteID, 
                        vehicle : this.selectedVehicleIndex
                    }
                }
            };
        },

        methods : {
            onClick : function(event) {
                // add the quote ID & the selected vehicle index to the event data
                event.data = {
                    quoteID : this.quoteID,
                    selectedVehicleIndex : this.selectedVehicleIndex
                };
                // trigger the call to action click event
                this.$emit('c2aClick', event);
            }
        }
    };
</script>

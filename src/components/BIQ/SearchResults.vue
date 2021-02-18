<template src="./templates/SearchResults.html"></template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name : 'SearchResults',

        props : {
            debugging : {
                type : Boolean,
                default : false
            },

            appConfig : {
                type : Object,
                required : true,
                default : null
            },

            quote_type : {
                type : String,
                default : 'type_class'
            }
        },

        data() {
            return {
                type_map : {
                    cheapest : 'Cheapest Price',
                    exec : 'Best Executive',
                    luxury : 'Best Luxury',
                    chauffeur :'Best Chauffeur'
                }
            }
        },

        computed : mapGetters([
        // BIQ Quote Search state
            'displayQuotes',
        // BIQ Quoting state
            'loadingQuotes', 
            'zeroQuotes', 
            'journeyID', 
            'journeyQuotes', 
        // BIQ Book Now Checkout state
            'quoteID',
            'vehicleIndex'
        ]),

        methods : {
            ...mapActions([
            // BIQ Book Now Checkout state
                'bookNow'
            ]),

            onQuoteVehicleChange : function(id, event) {
                const vehicle_index = event.target.value;
                const vehicle = this.displayQuotes[id].vehicles[vehicle_index];
                if(this.debugging) {
                    console.group("Quote Vehicle Changed");
                    console.info(id);
                    console.info(event);
                    console.info(vehicle_index);
                    console.info(this.displayQuotes[id]);
                    console.info(vehicle);
                    console.info(vehicle.price);
                    console.groupEnd();
                }
                this.$refs['vehicle_image_' + id][0].src = vehicle.image;
                this.$refs['price_' + id][0].innerHTML = `&pound;${vehicle.price}.00`;
                this.$refs['book_now_c2a_' + id][0].setAttribute('data-vehicle', vehicle_index);
                // this.$refs[id][0].src = this.displayQuotes[id].vehicles[vehicle_index].image;
                // this.$refs[id][1].innerHTML = `&pound;${this.displayQuotes[id].vehicles[vehicle_index].price}.00`;
                // this.$refs[id][2].$el.setAttribute('data-vehicle', vehicle_index)
            },

            onBookNowClicked : function(event) {
                const quote = event.target.getAttribute('data-quote');
                const vehicle = event.target.getAttribute('data-vehicle');
                if(this.debugging) {
                    console.group("Book Now Clicked");
                    console.info(event);
                    console.info(quote);
                    console.info(vehicle);
                    console.info(this.journeyQuotes[quote]);
                    console.groupEnd();
                }
                // update the state with the selected journey quote & vehicle
                this.bookNow({
                    quote, 
                    vehicle,
                    quote_data : this.journeyQuotes[quote]
                });
                // move to the checkout page to book the selected journey quote
                this.$router.push({ 
                    name : 'Checkout', 
                    params : { 
                        journey : this.journeyID, 
                        quote : this.quoteID, 
                        vehicle : this.vehicleIndex 
                    }
                });
            }
        }
    };
</script>

<style scoped>

</style>

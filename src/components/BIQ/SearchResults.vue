<template src="./templates/SearchResults.html"></template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'SearchResults',

        props: {
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

        computed: mapGetters([
        // BIQ Quote Search state
            'displayQuotes',
        // BIQ Quoting state
            'loadingQuotes', 
            'zeroQuotes', 
            'journeyID', 
            'journeyQuotes'
        ]),

        methods: {
            ...mapActions([
            // Book Now Checkout state
                'bookNow'
            ]),

            flipImage: function(id, event) {
                const vehicle = event.target.value;
                const price = this.displayQuotes[id].vehicles[vehicle].price;
                this.$refs[id][0].src = this.displayQuotes[id].vehicles[vehicle].image;
                this.$refs[id][1].innerHTML = `&pound;${price}.00`;
                this.$refs[id][2].$el.setAttribute('data-vehicle', vehicle)
            },

            onBookNowClicked: function(params, event) {
                console.group("Book Now Clicked");
                console.info(params);
                console.info(this.journeyQuotes[params.quote]);
                console.info(event);
                console.groupEnd();
                this.bookNow({
                    quote : this.journeyQuotes[params.quote], 
                    vehicle : params.vehicle,
                });
            },

        }
    }
</script>

<style scoped>

</style>

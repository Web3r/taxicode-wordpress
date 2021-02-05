<template>
  <div id="vue-frontend-app">
    <router-view />
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'BIQApp',

        computed: mapGetters([
        // BIQ Quote Search state
            'searchDetails',
            'displayQuotes',
        // BIQ Quoting state
            'loadingQuotes', 
            'quotesLoaded', 
            'zeroQuotes', 
            'journeyID', 
            'journeyDetails', 
            'journeyQuotes',
        // BIQ Quoted Journey state
        // Book Now Quote Checkout state
            'basket',
            'quoteID',
            'vehicleIndex',
            'price',
            'quoteData',
            'quoteVehicleData',
        ]),

        methods: mapActions([
        // BIQ Quote Search state
            'searchingQuotes', 
            'searchedQuotes',
        // BIQ Quoting state
            'quoting', 
            'quoted',
            // Journey quoting state
            // Book Now Checkout state
            'bookNow',
            'booked'
        ])
    };
</script>

<style scoped>

</style>

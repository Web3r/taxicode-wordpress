<template>
  <div id="vue-frontend-app">
    <router-view />
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        name: 'BookingInstantQuotes',
        computed: mapGetters([
            // Journey quoting state
            'loadingQuotes', 
            'quotesLoaded', 
            'zeroQuotes', 
            'journeyID', 
            'journeyDetails', 
            'journeyQuotes',
            'displayQuotes',
            // Book Now Checkout state
            'basket',
            'quoteID',
            'vehicleIndex',
            'price',
            'quoteData',
            'quoteVehicleData',
        ]),
        methods: mapActions([
            // Journey quoting state
            'quoting', 
            'quoted',
            // Book Now Checkout state
            'bookNow'
        ])
    };
</script>

<style>

</style>

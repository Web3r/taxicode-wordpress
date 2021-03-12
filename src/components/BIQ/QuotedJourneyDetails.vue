<template>
    <div 
        id="tcplugin-checkout-booking-details" 
        class="col"
    >
        <div class="card">
            <div class="card-header">
                Booking Details
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Date:</strong> {{journeyDate}} at {{journeyTime}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Travelling From:</strong> {{journeyDetails.pickup.string}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Going To:</strong> {{journeyDetails.destination.string}}
                </li>
                <li v-if="journeyHasVias" 
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <strong>Via:</strong> {{journeyDetails.vias[0].string}}
                </li>
                <li v-if="journeyHasReturn" 
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <strong>Returning:</strong> {{journeyReturnDate}} at {{journeyReturnTime}}
                </li>
                <li v-if="price > 0" 
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <strong>Price:</strong> &pound;{{price.toFixed(2)}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name : "QuotedJourneyDetails",

        props : {
            price : {
                type : Number,
                default : 0
            }
        },

        computed : mapGetters([
        // BIQ Quoting state
            'journeyDetails',
            'journeyDate', 
            'journeyTime', 
            'journeyHasReturn', 
            'journeyReturnDate', 
            'journeyReturnTime', 
            'journeyHasVias'
        ])
    };
</script>

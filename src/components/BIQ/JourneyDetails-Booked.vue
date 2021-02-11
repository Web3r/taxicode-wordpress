<template>
    <div id="biq-journey-details-booked" class="col">
        <div class="card">
            <div class="card-header">
                Booking Details
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Booking Reference:</strong> {{bookingRef}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Name:</strong> {{passengerName}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Date:</strong> {{journey_date}} at {{journey_time}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Travelling From:</strong> {{journeyPickup}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Going To:</strong> {{journeyDestination}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    export default {
        name: "JourneyDetailsBooked",

        props: {
            bookingRef : {
                type : String,
                default : ''
            },
            passengerName : {
                type : String,
                default : ''
            },
            passengers : {
                type : Number,
                default : 1
            },
            journeyPickup : {
                type : String,
                default : ''
            },
            journeyDestination : {
                type : String,
                default : ''
            },
            journeyVias : {
                type : Array,
                required : false,
                default : function() {
                    return [];
                }
            },
            journeyDate : {
                type : Date,
                default : function() {
                    return new Date();
                }
            },
            journeyReturnDate : {
                type : Date,
                required : false,
                default : function() {
                    return null;
                }
            }
        },

        computed : {
            journey_date :  function() {
                return (this.journeyDate !== null) ? this.journeyDate.toDateString() : '';
            },

            journey_time :  function() {
                return (this.journeyDate !== null) ? this.journeyDate.toLocaleTimeString() : '';
            },

            journey_return_date :  function() {
                return (this.journeyReturnDate !== null) ? this.journeyReturnDate.toDateString() : '';
            },
            
            journey_return_time :  function() {
                return (this.journeyReturnDate !== null) ? this.journeyReturnDate.toLocaleTimeString() : '';
            }
        }
    }
</script>

<style scoped>

</style>

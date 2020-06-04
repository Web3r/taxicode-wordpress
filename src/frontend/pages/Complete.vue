<template>
<div>
    <h3>Complete Page</h3>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    Booking Details
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Booking Reference:</strong> {{booking_ref}}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Name:</strong> {{booking_name}}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Date:</strong> {{booking_date}}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Travelling From:</strong> {{booking_from}}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Going To:</strong> {{booking_to}}
                    </li>
                </ul>
            </div>

        </div>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "Complete.vue",
        data() {
            return {
                booking_ref: '',
                booking_name: '',
                booking_date: '',
                booking_from: '',
                booking_to: ''
            }
        },
        created() {
            this.booking_ref = this.$route.params.booking_ref;
            axios.get('/wp-json/taxicode/v1/booking-details/?booking_ref='+this.booking_ref).then(function(response){
               console.log(response);
               this.booking_name = response.data.booking.passenger.name;
               this.booking_date = response.data.booking.date_elements.day+' '+response.data.booking.date_elements.month+' '+response.data.booking.date_elements.year+' at '+response.data.booking.date_elements.hours+':'+response.data.booking.date_elements.minutes;
               this.booking_from = response.data.booking.pickup.string;
               this.booking_to = response.data.booking.destination.string;
            }.bind(this));
        }
    }
</script>

<style scoped>

</style>

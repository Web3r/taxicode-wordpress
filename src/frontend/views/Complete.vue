<template>
    <div id="completePage">
        <h3>Your booking is complete</h3>
        <div class="row">
            <div class="col">
                <p>{{pageText}}</p>
            </div>
            <JourneyDetails-Booked 
                :booking-ref="booking.ref"
                :passenger-name="booking.name"
                :passengers="booking.passengers"
                :journey-pickup="booking.pickup"
                :journey-destination="booking.destination"
                :journey-vias="booking.vias"
                :journey-date="booking.date"
                :journey-return-date="booking.return_date"
            />
        </div>
    </div>
</template>

<script>
    import JourneyDetailsBooked from '@/components/BIQ/JourneyDetails-Booked.vue';
    import axios from 'axios';

    export default {
        name : "Complete",

        components : {
            'JourneyDetails-Booked' : JourneyDetailsBooked,
        },

        props: {
            pageText : {
                type : String,
                default : 'Thank you for booking with us.'
            },
            restBookingDetails : {
                type : String,
                default : ''
            }
        },

        data() {
            return {
                booking : {
                    ref : '',
                    name : '',
                    passengers : 1,
                    pickup : '',
                    destination : '',
                    vias : [],
                    date : null,
                    return_date : null
                }
            }
        },

        created() {
            const page = this;
            const booking_ref = this.$route.params.booking_ref;
            const biq_booking_details_url = `${this.restBookingDetails}?booking_ref=${booking_ref}`;
            axios.get(biq_booking_details_url)
            .then(response => {
                console.group(`Loading Booking Details from '${biq_booking_details_url}'`);
                console.info({...page.booking});
                console.info({...response.data});
                const booking = {
                    ref : booking_ref,
                    name : response.data.booking.passenger.name,
                    passengers : Number.parseInt(response.data.booking.people),
                    pickup : response.data.booking.pickup.string,
                    destination : response.data.booking.destination.string,
                    vias : response.data.booking.vias,
                    date : new Date(Date.parse(response.data.booking.date)),
                    return_date : null
                }
                if(response.data.booking.return) {
                    booking.return_date = new Date(Date.parse(response.data.booking.return));
                }
                page.booking = booking;
                console.info({...booking});
                console.info({...page.booking});
                console.groupEnd();
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
</script>

<style scoped>

</style>

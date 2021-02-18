<template>
    <div id="completePage">
        <h3>Your booking is complete</h3>
        <div class="row">
            <div class="col">
                <p>{{pageText}}</p>
            </div>
            <BIQ-JourneyDetails-Booked v-if="detailsLoaded"
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
    import axios from 'axios';
    import JourneyDetailsBooked from '@/components/BIQ/JourneyDetails-Booked.vue';

    export default {
        name : "Complete",

        components : {
            'BIQ-JourneyDetails-Booked' : JourneyDetailsBooked,
        },

        props: {
            debugging : {
                type : Boolean,
                default : false
            },

            appConfig : {
                type : Object,
                required : true,
                default : null
            },

            appSettings : {
                type : Object,
                required : true,
                default : null
            },
            
            appRESTBaseURL : {
                type : String,
                default : '//'
            }
        },

        data() {
            return {
                detailsLoaded : false,
                detailsLoadError : false,
                pageText : 'Thank you for booking with us.',
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

        mounted() {
            // set the journey booked complete page text to display
            this.pageText = this.appSettings.complete_page_text;
            const page = this;
            const booking_ref = this.$route.params.booking_ref;
            // let the wordpress backend plugin get the booking details as the API call needs the private key as well
            const biq_booking_details_url = `${this.appRESTBaseURL}${this.appConfig.BOOKING_DETALS_URI}${booking_ref}`;
            axios.get(biq_booking_details_url)
            .then(response => {
                if(page.debugging) {
                    console.group(`Loading Booking Details from '${biq_booking_details_url}'`);
                    console.info({...page.booking});
                    console.info({...response.data});
                }
                // construct a usable booking data object
                const booking = {
                    ref : booking_ref,
                    name : response.data.booking.passenger.name,
                    // make the passengers a number because it is
                    passengers : Number.parseInt(response.data.booking.people),
                    pickup : response.data.booking.pickup.string,
                    destination : response.data.booking.destination.string,
                    vias : response.data.booking.vias,
                    date : new Date(Date.parse(response.data.booking.date)),
                    return_date : null
                }
                if(response.data.booking.return) {
                // the booking has a return journey leg
                    booking.return_date = new Date(Date.parse(response.data.booking.return));
                }
                // set the booking details object & a flag to indicate the successful loading
                page.booking = booking;
                page.detailsLoaded = true;
                if(page.debugging) {
                    console.info({...booking});
                    console.info({...page.booking});
                    console.groupEnd();
                }
            })
            .catch(error => {
            // well that's not good
                let message = 'Unknown Booking Details Error';
                if(error.hasOwnProperty('message') && error.message) {
                    message = error.message;
                }
                console.error(message);
                console.info({...error});
                // set a flag to indicate the booking details encountered an error while loading
                page.detailsLoadError = true;
            });
        }
    };
</script>

<style scoped>

</style>

<template>
    <div id="completePage">
        <h3>Your booking is complete</h3>
        <div class="row">
            <div class="col">
                <p>{{pageText}}</p>
            </div>
            <JourneyDetails-Booked v-if="detailsLoaded"
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
            },
            
            debugging : {
                type : Boolean,
                default : false
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

        created() {
            const page = this;
            const booking_ref = this.$route.params.booking_ref;
            const biq_booking_details_url = `${this.appRESTBaseURL}${this.appConfig.BOOKING_DETALS_URI}${booking_ref}`;
            axios.get(biq_booking_details_url)
            .then(response => {
                if(page.debugging) {
                    console.group(`Loading Booking Details from '${biq_booking_details_url}'`);
                    console.info({...page.booking});
                    console.info({...response.data});
                }
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
                page.detailsLoaded = true;
                if(page.debugging) {
                    console.info({...booking});
                    console.info({...page.booking});
                    console.groupEnd();
                }
            })
            .catch(error => {
                let message = 'Unknown Booking Details Error';
                if(error.hasOwnProperty('message') && error.message) {
                    message = error.message;
                }
                console.error(message);
                console.info({...error});
                page.detailsLoadError = true;
            });
            this.pageText = this.appSettings.complete_page_text;
        }
    };
</script>

<style scoped>

</style>

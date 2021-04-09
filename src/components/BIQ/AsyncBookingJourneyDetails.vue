<template>
    <div v-if="loaded"
        :class="styleClass"
    >
        <slot 
            name="booking-journey-details"
            :booking="booking"
            :labels="labels"
        >
            <biq-booking-journey-details
                :booking="booking"
                :labels="labels"
            ></biq-booking-journey-details>
        </slot>
    </div>
    <div v-else
        :class="styleClass"
    >
        <slot 
            name="loading"
        >
            <div class="spinner-border"></div>
        </slot>
    </div>
</template>

<script>
    import axios from 'axios';
    // import the methods to generate the default state structure & journey detail objects
    import { journeyDate } from '@BIQ/Journey';
    // import the component to asynchronous display of the booked journey details
    import BookingJourneyDetails from 'BIQ/BookingJourneyDetails.vue';

    // define the component text labels used (can be overridden with the 'labels' prop)
    const defaultLabels = {
        header : 'Booking Details',
        booking : {
            ref : 'Booking Reference : ',
            name : 'Name : ',
            passengers : 'Passengers : ',
            pickup : 'Pickup : ',
            destination : 'Destination : ',
            via : 'Via : ',
            date : 'Date : ',
            return_date : 'Returning : '
        }
    };
    // define the component data structure & the default / initial values
    const defaultData = {
        loaded : false,
        error : false,
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
    };
    // define the component properties
    const props = {
        bookingDetailsFrom : {
            type : String,
            required : true,
            default : '//booking-details/?booking_ref='
        },

        bookingRef : {
            type : String,
            required : true,
            default : ''
        },

        labels : {
            type : Object,
            // @todo add a validator to make sure that all the label keys are supplied
            default : function() { 
                return defaultLabels;
            }
        },

        styleClass : {
            type : String,
            default : 'flex-sm-fill'
        },

        debugging : {
            type : Boolean,
            default : false
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when there is an error on the backend
        detailsLoadError : {
            name : 'detailsLoadError'
        }
    };
    // define the component methods
    const methods = {
        getBookingDetails : function() {
            const self = this;
            this.loaded = false;
            this.error = false;
            if(this.debugging) {
                console.group(`Loading Booking Details from '${this.bookingDetailsFrom}'`);
                console.log('Booking Details', { ...this.booking });
            }
            // let the wordpress backend plugin get the booking details as the API call needs the private key as well
            axios.get(`${this.bookingDetailsFrom}${this.bookingRef}`)
            .then(response => {
                if(self.debugging) {
                    console.log(response);
                }
                if(response.data.status != 'OK') {
                // throw new error event & let the catch() handle creating the event
                    // there's nothing usable in the response except the error
                    throw new ErrorEvent(response.data.status, {
                        error : new Error('Booking Details Error'),
                        message : response.data[response.data.status.toLowerCase()]
                    });
                }
                // construct a usable booking data object
                const booking = {
                    ref : self.bookingRef,
                    name : response.data.booking.passenger.name,
                    // make the passengers a number because it is
                    passengers : Number.parseInt(response.data.booking.people),
                    pickup : response.data.booking.pickup.string,
                    destination : response.data.booking.destination.string,
                    vias : response.data.booking.vias,
                    date : journeyDate(response.data.booking.date),
                    return_date : null
                }
                if(response.data.booking.return) {
                // the booking has a return journey leg
                    booking.return_date = journeyDate(response.data.booking.return);
                }
                // set the booking details object & a flag to indicate the successful loading
                self.booking = booking;
                self.loaded = true;
                if(self.debugging) {
                    console.log('Booking Details Loaded', { ...self.booking });
                    console.groupEnd();
                }
            })
            .catch(error => {
            // well that's not good
                // set a flag to indicate the booking details encountered an error while loading
                self.error = true;
                // create the error event data
                const event = {
                    data : {
                        bookingRef : self.bookingRef,
                        URL : self.bookingDetailsFrom,
                        error
                    }
                };
                // trigger the error event
                self.$emit(emitEvents.detailsLoadError.name, event);
                if(self.debugging) {
                    console.info('Booking Details Load Error');
                    console.log(event);
                    console.groupEnd();
                }
            });
        }
    };

    export default {
        name : 'AsyncBookingJourneyDetails',
        props,
        methods,

        components : {
            'biq-booking-journey-details' : BookingJourneyDetails
        },

        data() {
            return { ...defaultData };
        },

        mounted() {
            this.getBookingDetails();
        }
    };
</script>

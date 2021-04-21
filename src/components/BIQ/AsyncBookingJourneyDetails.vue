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
    // import the BIQ API places lookup
    import { getDetails } from '@BIQ/API/Booking';
    // import the methods to generate the default state structure & journey detail objects
    import { journeyDetailsLabels } from '@BIQ/Journey';
    // import the component to asynchronous display of the booked journey details
    import BookingJourneyDetails from 'BIQ/BookingJourneyDetails.vue';

    // define the component text labels used (can be overridden with the 'labels' prop)
    const defaultLabels = {
        header : 'Booking Details',
        booking : {
            ...journeyDetailsLabels,
            name : 'Name : ',
            ref : 'Booking Reference : '
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
        biqPublicKey : {
            type : String,
            required : true,
            default : ''
        },
    
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
            // let the wordpress backend plugin get the booking details as the API 
            // call needs the private key as well
            getDetails(this.bookingDetailsFrom, this.biqPublicKey, this.bookingRef, this.debugging)
            .then(b => {
                // set the booking details object & a flag to indicate the successful loading
                self.booking = {
                    ...b,
                    // we're just interested in the displayable location string here
                    pickup : b.pickup.string,
                    destination : b.destination.string,
                };
                self.loaded = true;
                if(self.debugging) {
                    console.log('Booking Details Loaded', { ...self.booking });
                    console.groupEnd();
                }
            })
            .catch(e => {
            // well that's not good
                // set a flag to indicate the booking details encountered an error while loading
                self.error = true;
                if(self.debugging) {
                    console.error(e.data.message, e.data);
                }
                // trigger the error event
                self.$emit(emitEvents.detailsLoadError.name, e);
                if(self.debugging) {
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

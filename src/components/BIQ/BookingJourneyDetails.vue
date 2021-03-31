<template>
    <div v-if="loaded"
        id="biq-journey-details-booked" 
        class="col"
    >
        <div class="card">
            <div class="card-header">
                Booking Details
            </div>

            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Booking Reference:</strong> {{bookingRef}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Name:</strong> {{booking.name}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Date:</strong> {{journeyDate}} at {{journeyTime}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Travelling From:</strong> {{booking.pickup}}
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Going To:</strong> {{booking.destination}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    // import the methods to generate the default state structure & journey detail objects
    import { journeyDate } from '@/common/BIQ/QuoteCheckout';

    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when there is an error on the backend
        detailsLoadError : {
            name : 'detailsLoadError'
        }
    };

    export default {
        name : 'BookingJourneyDetails',

        props : {
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

            debugging : {
                type : Boolean,
                default : false
            }
        },

        data() {
            return {
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
        },

        mounted() {
            const self = this;
            this.loaded = false;
            this.error = false;
            if(self.debugging) {
                console.group(`Loading Booking Details from '${this.bookingDetailsFrom}'`);
                console.log('Booking Details', {...this.booking});
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
                    console.log('Booking Details Loaded', {...self.booking});
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
        },

        computed : {
            journeyDate :  function() {
                return (this.booking.date !== null) 
                    ? this.booking.date.toDateString() 
                    : '';
            },

            journeyTime :  function() {
                return (this.booking.date !== null) 
                    ? this.booking.date.toLocaleTimeString() 
                    : '';
            },

            journeyReturnDate :  function() {
                return (this.booking.return_date !== null) 
                    ? this.booking.return_date.toDateString() 
                    : '';
            },
            
            journeyReturnTime :  function() {
                return (this.booking.return_date !== null) 
                    ? this.booking.return_date.toLocaleTimeString() 
                    : '';
            }
        }
    };
</script>

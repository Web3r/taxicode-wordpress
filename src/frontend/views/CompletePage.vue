<template>
    <div id="biq-complete-page">
        <h3>{{page_heading}}</h3>

        <div class="d-flex flex-wrap">
            <div class="flex-sm-fill">
                <p>{{page_text}}</p>
            </div>

            <async-biq-booking-journey-details
                :booking-details-from="bookingDetailsFrom"
                :booking-ref="$route.params.booking_ref"
                :labels="booking_details_labels"
                :debugging="debugging"
                @detailsLoadError="onDetailsLoadError"
                id="biq-journey-details-booked" 
            >
                <template #loading>
                    <biq-booking-journey-details
                        :booking="loading_details"
                        :labels="booking_details_labels"
                    ></biq-booking-journey-details>
                </template>
            </async-biq-booking-journey-details>
        </div>
    </div>
</template>

<script>
    // import the mixin that defines the common Page route Components
    import PagesMixin from 'mixins/PagesMixin';
    // import the component to asynchronous display of the booked journey details
    import AsyncBookingJourneyDetails from 'BIQ/AsyncBookingJourneyDetails.vue';
    // import the component to asynchronous display of the booked journey details
    import BookingJourneyDetails from 'BIQ/BookingJourneyDetails.vue';
    // import the Complete specific CSS (webpack will chunk this with others & auto load / include separately)
    import 'frontend/static-assets/css/complete.css';
    import 'frontend/static-assets/css/custom_complete.css';
    
    // define the component data structure & the default / initial values (inherits extra data from PagesMixin)
    const defaultData = {
        page_heading : 'Your booking is complete',
        page_text : 'Thank you for booking with us.',
        booking_details_labels : {
            header : 'Booking Details',
            booking : {
                ref : 'Booking Reference : ',
                name : 'Name : ',
                passengers : '',
                pickup : 'Travelling From : ',
                destination : 'Going To : ',
                via : '',
                date : 'Date : ',
                return_date : ''
            },
        },
        loading_details : {
            ref : '...',
            name : '...',
            passengers : 1,
            pickup : '...',
            destination : '...',
            vias : [],
            date : null,
            return_date : null
        },
        booking_load_error : false
    };
    // define the Complete Page component properties (inherits props from PagesMixin)
    const props = {
        appRESTBase : {
            type : String,
            default : '//'
        }
    };
    // define the Complete Page component computed property methods (inherits computed property methods from PagesMixin)
    const computed = {
        bookingDetailsFrom : function() {
            return `${this.appRESTBase}${this.appConfig.BOOKING_DETALS_URI}`;
        }
    };
    // define the Complete Page component methods (inherits methods from PagesMixin)
    const methods = {
        onDetailsLoadError : function() {
            this.booking_load_error = true;
        }
    };

    export default {
        name : 'CompletePage',
        props,
        computed,
        methods,

        mixins : [
            PagesMixin
        ],

        components : {
            'async-biq-booking-journey-details' : AsyncBookingJourneyDetails,
            'biq-booking-journey-details' : BookingJourneyDetails
        },

        data() {
            return {
                ...defaultData,
                page_text : this.appSettings.complete_page_text,
            };
        }
    };
</script>

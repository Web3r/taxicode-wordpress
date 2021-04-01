<template>
    <div id="completePage">
        <h3>{{page_heading}}</h3>

        <div class="d-flex flex-wrap">
            <div class="flex-sm-fill">
                <p>{{page_text}}</p>
            </div>

            <biq-booking-journey-details
                :booking-details-from="bookingDetailsFrom"
                :booking-ref="$route.params.booking_ref"
                :labels="booking_details_labels"
                :debugging="debugging"
                @detailsLoadError="onDetailsLoadError"
                id="biq-journey-details-booked" 
            ></biq-booking-journey-details>
        </div>
    </div>
</template>

<script>
    // import the mixin that defines the common Page route Components
    import PagesMixin from 'mixins/PagesMixin';
    // import the component to asynchronous display of the booked journey details
    import BookingJourneyDetails from 'BIQ/BookingJourneyDetails.vue';
    
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
            }
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
        props : {...props},
        computed : {...computed},
        methods : {...methods},
        mixins : [PagesMixin],

        components : {
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

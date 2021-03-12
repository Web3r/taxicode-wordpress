<template>
    <div id="completePage">
        <h3>{{page_heading}}</h3>
        <div class="row">
            <div class="col">
                <p>{{page_text}}</p>
            </div>
            <biq-booking-journey-details
                :booking-details-from="`${appRESTBase}${appConfig.BOOKING_DETALS_URI}`"
                :booking-ref="`${$route.params.booking_ref}`"
                :debugging="debugging"
                @detailsLoadError="onDetailsLoadError"
            ></biq-booking-journey-details>
        </div>
    </div>
</template>

<script>
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the component to display the booked journey details
    import BookingJourneyDetails from 'BIQ/BookingJourneyDetails.vue';

    export default {
        name : 'CompletePage',

        mixins : [
            PagesMixin
        ],

        components : {
            'biq-booking-journey-details' : BookingJourneyDetails
        },

        props: {
            appRESTBase : {
                type : String,
                default : '//'
            }
        },

        data() {
            return {
                page_heading : 'Your booking is complete',
                page_text : this.appSettings.complete_page_text,
                booking_load_error : false
            };
        },

        methods : {
            onDetailsLoadError : function() {
                this.booking_load_error = true;
            }
        }
    };
</script>

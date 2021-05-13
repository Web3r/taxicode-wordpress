<template>
    <div id="biq-checkout-page">
        <the-biq-checkout-form
            ref="checkout"
            :biq-config="appConfig.biq"
            :app-settings="appSettings" 
            :stripe-card-form-style="stripe_cardform_style"
            :paypal-client-token="paypalClientToken"
            :processing="processing"
            :debugging="debugging"
            @biqCheckoutSubmit="onSubmit"
            @biqCheckoutComplete="onCheckoutSuccess"
            @biqCheckoutError="onCheckoutError"
        >
            <template #checkout-error="{ error }">
                <div class="d-flex">{{error.message}}</div>
            </template>
        </the-biq-checkout-form>
        
        <div class="d-flex">
            <biq-quoted-journey-details
                :price="price"
                :labels="journey_details_labels"
                id="biq-checkout-booking-details" 
            ></biq-quoted-journey-details>
        </div>
    </div>
</template>

<script>
    // import the state getters mapper
    import { mapGetters } from 'vuex';
    // import the mixin that defines the common Page route Components
    import PagesMixin from 'mixins/PagesMixin';
    // import default Stripe card elements style config object just in case
    import { DEFAULT_STRIPE_CARD_STYLE } from 'BIQ/config';
    // import the component to display the journey details being booked
    import TheCheckoutForm from 'BIQ/Forms/TheCheckoutForm.vue';
    // import the component to display the journey details being booked
    import QuotedJourneyDetails from 'BIQ/QuotedJourneyDetails.vue';
    // import the Checkout specific CSS (webpack will chunk this with others & auto load / include separately)
    import 'frontend/static-assets/less/frontend/pages/checkout.less';

    // define the component default text labels used (can be overridden with the 'labels' prop)
    const defaultData = {
        journey_details_labels : {
            header : 'Booking Details',
            journey : {
                pickup : 'Travelling From : ',
                destination : 'Going To : ',
                via : 'Via : ',
                passengers : 'Passengers : ',
                date : 'Date : ',
                return_date : 'Returning : ',
                price : 'Price : '
            }
        }
    };
    
    // define the Checkout Page component properties (inherits props from PagesMixin)
    const props = {
        stripe_cardform_style : {
            type : Object,
            required : true,
            default : function() { 
                return DEFAULT_STRIPE_CARD_STYLE;
            }
        },
        
        // @todo make this come from the settings
        paypalClientToken : {
            type : String,
            required : true,
            default : ''
        }
    };
    // define the Checkout Page component computed property methods (inherits computed property methods from PagesMixin)
    const computed = {
        ...mapGetters([
        // BIQ Book Now Checkout state
            'processing',
            'price'
        ])
    };
    // define the Checkout Page component methods (inherits methods from PagesMixin)
    const methods = {
        onSubmit : function(event) {
            if(this.debugging) {
                console.group('BIQ Checkout Form Submit');
                console.log(event);
                console.groupEnd();
            }
        },

        onCheckoutSuccess : function(event) {
            if(this.debugging) {
                console.group('BIQ Checkout Success');
                console.log(event);
                console.groupEnd();
            }
            // define the route target to move to
            const target = { 
                name: 'CompletePage', 
                params: { 
                    booking_ref: event.data.booking_ref 
                } 
            };
            // move to the complete page now the booking has been made & 
            // make sure the state is updated
            this.$router.replace(target, event.updateCheckoutState, event.updateCheckoutState);
        },

        onCheckoutError : function(event) {
            if(this.debugging) {
                console.group('BIQ Checkout Error');
                console.log(event);
                console.groupEnd();
            }
        }
    };

    export default {
        name : 'CheckoutPage',
        props,
        computed,
        methods,

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-checkout-form' : TheCheckoutForm,
            'biq-quoted-journey-details' : QuotedJourneyDetails
        },

        data() {
            return { ...defaultData };
        },

        created() {
            // make sure the checkout still has a price
            if(this.price == 0) {
                // invalid checkout state, go back to the search results
                this.$router.back();
            }
        }
    };
</script>

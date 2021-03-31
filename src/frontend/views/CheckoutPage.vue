<template>
    <div>
        <the-biq-checkout-form
            ref="checkout"
            :app-config="appConfig"
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
                <div 
                    id="tcplugin-payment-error" 
                    class="col"
                >{{error.message}}</div>
            </template>
        </the-biq-checkout-form>
        
        <div class="row">
            <biq-quoted-journey-details
                :price="price"
            ></biq-quoted-journey-details>
        </div>
    </div>
</template>

<script>
    // import the state getters mapper
    import { mapGetters } from 'vuex';
    // import the mixin that sets values & validates field values
    import PagesMixin from 'mixins/PagesMixin';
    // import the component to display the journey details being booked
    import TheCheckoutForm from 'BIQ/Forms/TheCheckoutForm.vue';
    // import the component to display the journey details being booked
    import QuotedJourneyDetails from 'BIQ/QuotedJourneyDetails.vue';

    export default {
        name : 'CheckoutPage',

        mixins : [
            PagesMixin
        ],

        components : {
            'the-biq-checkout-form' : TheCheckoutForm,
            'biq-quoted-journey-details' : QuotedJourneyDetails
        },

        props : {
            stripe_cardform_style : {
                type : Object,
                required : true,
                default : function() { 
                    return {
                        base : {
                            fontFamily : "'Muli', sans-serif",
                            fontSize : '14px',
                            color : '#333'
                        },
                        invalid : {
                            color : 'red'
                        }
                    };
                 }
            },
            
            paypalClientToken : {
                type : String,
                required : true,
                default : ''
            }
        },

        computed: {
            ...mapGetters([
            // BIQ Book Now Checkout state
                'processing',
                'price'
            ])
        },

        methods: {
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
        }
    };
</script>

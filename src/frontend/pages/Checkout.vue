<template src="./templates/Checkout.html"></template>

<script>
    import axios from 'axios';
    export default {
        name: "Checkout",
        props: {
            card_created: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            price() {
                return this.$store.state.price
            }
        },
        data() {
            return {
                name: 'Alasdair Test',
                email: 'alasdair@alasdair.biz',
                telephone: '07789000228',
                flight_number: null,
                quote_id: null,
                journey_id: null,
                vehicle: 0,
                journey_data: {},
                errors: {
                    name: false,
                    email: false,
                    telephone: false,
                },
                test_mode: 0,
                loading: false,
                payment_method: 'Pay with card',
                payment_options: ['Pay with card','Pay with Paypal'],
                posterror: false,
            }
        },
        created() {
            this.paypal_token = paypal_token;
            this.test_mode = test_mode;
            this.quote_id = this.$route.params.quote_id;
            this.journey_id = this.$route.params.journey_id;
            axios.get(config.JOURNEY_URL+this.journey_id+'&include_quote=true')
                .then(function(response) {
                    console.log(response.data);
                this.journey_data = response.data.journey;
                }.bind(this));
        },
        mounted: function () {
            card = elements.create('card');
            card.mount(this.$refs.card);
            this.card_created = true;
        },
        methods:{
            validate: function()
            {
                var errors = true;
                if(this.name=='')
                {
                    this.errors.name='Booking name must be set';
                    errors = false;
                }

                if(this.email=='')
                {
                    this.errors.email='Email location must be set';
                    errors = false;
                }
                if(this.telephone=='')
                {
                    this.errors.telephone = 'Telephone must be set';
                    errors = false;
                }
                return errors;
            },
            onPaypalSubmit: function(payload) {
                if(this.validate()) {
                    this.posterror = false;
                    this.loading = 1;
                    this.makeBooking(payload.nonce, 'paypal')
                }
            },
            onPaypalError: function(error) {

            },
            onLoadFail: function(error){
                console.log(error);
            },
            makeBooking: function(token,method)
            {
                //this is a bit annoying - our API can't handle standard axios requests on POST
                //for some reason, so I've had to abandon my form class and hand crank this
                //request.
                var self = this;
                let formData = new FormData();
                formData.append('email', self.email);
                formData.append('name', self.name);
                formData.append('telephone', self.telephone);
                formData.append('key',tc_public_key);
                formData.append('quote', self.quote_id);
                formData.append('vehicle', self.vehicle);
                formData.append('test', self.test_mode);
                formData.append('new_pay', true);
                formData.append('payment_token', token);
                if(method=='stripe')
                {
                    formData.append('method', 'googlepay');
                }
                else
                {
                    formData.append('method', 'paypal');
                }

                axios.post(config.PAYMENT_URL,formData,{
                    headers: {
                        'Content-Type': 'application/application/x-www-form-urlencoded',
                    }
                })
                    .then(function(response) {
                        if(response.data.status=='OK')
                        {
                            this.$router.push( { name: 'Complete', params: { booking_ref: response.data.reference } })
                        }
                        else
                        {
                            this.posterror = response.data.error;
                            this.loading=0;
                        }
                    }.bind(this))
                    .catch(function (error) {
                        this.loading = 0;
                    }.bind(this));
            },
            onSubmit: function()
            {
                if(this.validate())
                {
                    if(this.payment_method=='Pay with card')
                    {
                        this.onStripeSubmit();
                    }
                    else
                    {
                        this.onPaypalSubmit();
                    }
                }
            },
            onStripeSubmit: function() {
                this.posterror = false;
                this.loading = 1;
                var self = this;
                stripe.createToken(card).then(function(result) {
                    if (result.error) {
                        this.loading = 0;
                        self.hasCardErrors = true;
                        self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                        return;
                    }
                    let stripetoken = result.token.id;

                    this.makeBooking(stripetoken,'stripe');


                }.bind(this));



            },
            mountStripe: function() {
                if(this.payment_method=='Pay with card')
                {
                    this.$nextTick(function () {
                        if(!this.card_created)
                        {
                            console.log('creting card');
                            card = elements.create('card');
                            this.card_created = true;
                        }
                        console.log('mounting card')
                        card.mount(this.$refs.card);
                    });

                }
                else
                {
                    card.unmount(this.$refs.card);
                }
            }
        }
    }
</script>

<style scoped>

</style>

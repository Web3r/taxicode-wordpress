<template src="./templates/Checkout.html"></template>

<script>
    import axios from 'axios';
    export default {
        name: "Checkout",
        data() {
            return {
                name: 'Alasdair Test',
                email: 'alasdair@alasdair.biz',
                telephone: '07789000228',
                flight_number: null,
                quote_id: null,
                journey_id: null,
                vehicle: 0,
                journey_data: {}
            }
        },
        created() {
            this.quote_id = this.$route.params.quote_id;
            this.journey_id = this.$route.params.journey_id;
            axios.get(config.JOURNEY_URL+this.journey_id)
                .then(function(response) {
                this.journey_data = response.data.journey;
                }.bind(this));
        },
        mounted: function () {
            card = elements.create('card');
            card.mount(this.$refs.card);
        },
        methods:{
            onSubmit: function() {
                var self = this;

                stripe.createToken(card).then(function(result) {
                    if (result.error) {
                        self.hasCardErrors = true;
                        self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                        return;
                    }
                    console.log(result.token);

                    let formData = new FormData();
                    formData.append('email', self.email);
                    formData.append('name', self.name);
                    formData.append('telephone', self.telephone);
                    formData.append('key',tc_public_key);
                    formData.append('quote', self.quote_id);
                    formData.append('vehicle', self.vehicle);
                    formData.append('test', 1);
                    formData.append('new_pay', true);
                    formData.append('payment_token', result.token.id);
                    formData.append('method', 'wordpress-stripe');
                    axios.post(config.PAYMENT_URL,formData,{
                        headers: {
                            'Content-Type': 'application/application/x-www-form-urlencoded',
                        }
                    })
                        .then(function(response) {
                            if(response.data.status=='OK')
                            {

                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                });



            }
        }
    }
</script>

<style scoped>

</style>

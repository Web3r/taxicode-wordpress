<template>
    <div>
        <form id="purchaseform" @submit.prevent="onSubmit">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="customer_name">Name</label>
                        <input v-model="name" type="text" class="form-control" id="customer_name" aria-describedby="nameHelp" placeholder="Enter name">
                        <small id="nameHelp" class="form-text text-muted">The name of the person travelling,</small>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="customer_email">Email</label>
                        <input v-model="email" type="email" class="form-control" id="customer_email" aria-describedby="emailHelp" placeholder="Enter email">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="telephone">Mobile telephone</label>
                        <input v-model="telephone" type="text" class="form-control" id="telephone" aria-describedby="mobileHelp" placeholder="Enter mobile #">
                        <small id="mobileHelp" class="form-text text-muted">Valid UK mobile numbers only, please</small>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="flight_number">Flight #</label>
                        <input v-model="flight_number" type="email" class="form-control" id="flight_number" aria-describedby="flightHelp" placeholder="Enter name">
                        <small id="flightHelp" class="form-text text-muted">If this is an airport pickup or dropoff, the relevent flight number</small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="card-holder-name" class="control-label">Cardholder Name</label>
                        <input id="card-holder-name" class="form-control" type="text" v-model="name">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="card" class="control-label">Card Details</label>
                        <div id="card" ref="card" class="form-control"></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
                            Booking Details
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <strong>Date:</strong> {{journey_data.date}} at {{journey_data.time}}
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <strong>Travelling From:</strong> {{journey_data.pickup}}
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <strong>Going To:</strong> {{journey_data.destination}}
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center" v-if="journey_data.via">
                                <strong>Via:</strong> {{journey_data.vias[0].string}}
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center" v-if="journey_data.return">
                                <strong>Returning:</strong> {{journey_data.return}} at {{journey_data.return_time}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <input type="submit" class="btn btn-primary" value="Book Now">
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

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
                    formData.append('method', 'applepay');
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

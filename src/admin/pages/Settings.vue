<template>
    <div class="app-settings">
        <h3>Payment Settings</h3>
        <div :class="message_class">
            {{message}}
        </div>
        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row">
                        <label for="taxicode_public">Taxicode API public key</label>
                    </th>
                    <td>
                        <input name="taxicode_public" type="text" id="taxicode_public" v-model="form.taxicode_public" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="taxicode_private">Taxicode API private key</label>
                    </th>
                    <td>
                        <input name="taxicode_private" type="text" id="taxicode_private" v-model="form.taxicode_private" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="stripe_public">Stripe API public key</label>
                    </th>
                    <td>
                        <input name="stripe_public" type="text" id="stripe_public" v-model="form.stripe_public" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="paypal_public">Paypal Client ID</label>
                    </th>
                    <td>
                        <input name="paypal_public" type="text" id="paypal_public"v-model="form.paypal_public" class="regular-text">
                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Plugin Settings</h3>
        <table class="form-table" role="presentation">
            <tbody>
            <tr>
                <th scope="row">
                    <label>Test Mode</label>
                </th>
                <td>
                    <legend class="screen-reader-text"><span>Quotes</span></legend>
                    <label><input v-model="form.test_mode" type="radio" name="test_mode" value="1">Making Bookings In Test Mode</label><br>
                    <label><input v-model="form.test_mode" type="radio" name="test_mode" value="0">Make Live Bookings</label><br>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label>Quote Display</label>
                </th>
                <td>
                    <legend class="screen-reader-text"><span>Quotes</span></legend>
                    <label><input v-model="form.quote_type" type="radio" name="quote_type" value="all"> All</label><br>
                    <label><input v-model="form.quote_type" type="radio" name="quote_type" value="best"> Only Best</label><br>
                    <label><input v-model="form.quote_type" type="radio" name="quote_type" value="type_class"> Cheapest by type and class</label><br>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="complete_page_text">Complete page text</label>
                </th>
                <td>
                    <textarea name="complete_page_text" id="complete_page_text" v-model="form.complete_page_text" class="regular-text">
                    </textarea>
                </td>
            </tr>
            </tbody>
        </table>
        <h3>Custom CSS</h3>
        <table class="form-table" role="presentation">
            <tbody>
            <tr>
                <th scope="row">
                    <label for="custom_css">Custom CSS</label>
                </th>
                <td>
                    <textarea name="custom_css" id="custom_css" v-model="form.custom_css" class="regular-text">
                    </textarea>
                </td>
            </tr>
            </tbody>
        </table>

        <button class="button button-primary" @click="save">Save settings</button>
    </div>
</template>

<script>
    import Form from "../../common/Form";
    import axios from 'axios';
    export default {

        name: 'Settings',

        data () {
            return {
                message_class: '',
                message: '',
                form: new Form({
                    taxicode_public:'',
                    taxicode_private:'',
                    stripe_public:'',
                    stripe_private:'',
                    paypal_public: '',
                    complete_page_text: '',
                    quote_type: '',
                    custom_css: '',
                    test_mode: 0,
                    preserve_on_submit: true
                    })
            };
        },
        created() {
            axios.get('/wp-json/taxicode/v1/settings-get/').then(function(response){
                this.form.taxicode_public = response.data.taxicode_public;
                this.form.taxicode_private = response.data.taxicode_private;
                this.form.stripe_public = response.data.stripe_public;
                this.form.stripe_private = response.data.stripe_private;
                this.form.paypal_public = response.data.paypal_public;
                this.form.quote_type = response.data.quote_type;
                this.form.complete_page_text = response.data.complete_page_text;
                this.form.custom_css = response.data.custom_css;
                this.form.test_mode = response.data.test_mode;

                //console.log(response);
            }.bind(this))
        },
        methods: {
            save: function()
            {
                console.log("taxicode plugin settings:");
                console.log(this.form.data());
                this.form.post('/wp-json/taxicode/v1/settings-save')
                    .then(response => {
                        this.message_class = 'updated';
                        this.message = 'Settings Updated';
                    })
                    .catch(error => {
                        this.message_class = 'alternate';
                        this.message = 'Failed to update settings';
                    })
                ;
            }
        }
    };
</script>

<style lang="css" scoped>
</style>

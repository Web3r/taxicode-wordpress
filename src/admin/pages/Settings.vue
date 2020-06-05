<template>
    <div class="app-settings">
        <form @submit=""
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
                        <label for="stripe_private">Stripe API private key</label>
                    </th>
                    <td>
                        <input name="stripe_private" type="text" id="stripe_private"v-model="form.stripe_private" class="regular-text">
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" @click="save">Save settings</button>
    </div>
</template>

<script>
    import Form from "../../common/Form";
    export default {

        name: 'Settings',

        data () {
            return {
                form: new Form({
                    taxicode_public:'t_pub',
                    taxicode_private:'t_pri',
                    stripe_public:'s_pub',
                    stripe_private:'s_pri',
                    preserve_on_submit: true
                    })
            };
        },
        methods: {
            save: function()
            {
                this.form.put('/wp-json/taxicode/v1/settings-save')
                    .then(response => {
                        console.log('success');
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                ;
            }
        }
    };
</script>

<style lang="css" scoped>
</style>

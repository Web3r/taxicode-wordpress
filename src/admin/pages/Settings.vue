<template>
    <div class="app-settings">
        <table class="form-table" role="presentation">

            <tbody>
                <tr>
                    <th scope="row">
                        <label for="taxicode_public">Taxicode API public key</label>
                    </th>
                    <td>
                        <input name="taxicode_public" type="text" id="taxicode_public" value="Taxicode Testing" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="taxicode_private">Taxicode API private key</label>
                    </th>
                    <td>
                        <input name="taxicode_private" type="text" id="taxicode_private" value="Taxicode Testing" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="stripe_public">Stripe API public key</label>
                    </th>
                    <td>
                        <input name="stripe_public" type="text" id="stripe_public" value="Taxicode Testing" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="stripe_private">Stripe API private key</label>
                    </th>
                    <td>
                        <input name="stripe_private" type="text" id="stripe_private" value="Taxicode Testing" class="regular-text">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {

        name: 'Settings',

        data () {
            return {
                
            };
        }
    };
</script>

<style lang="css" scoped>
</style>

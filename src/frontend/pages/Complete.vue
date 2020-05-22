<template>
<div>
    <h3>Complete Page</h3>
    <div class="row">
        <div class="col">
            Booking details for {{booking_ref}}
        </div>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "Complete.vue",
        data() {
            return {
                booking_ref: '',
            }
        },
        created() {
            this.booking_ref = this.$route.params.booking_ref;
            axios.get(config.BOOKING_DETAILS_URL+this.booking_ref).then(function(response){
               console.log(response);
            });
        }
    }
</script>

<style scoped>

</style>

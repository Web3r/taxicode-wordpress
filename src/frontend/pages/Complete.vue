<template src="./templates/Complete.html"></template>

<script>
    import axios from 'axios';
    export default {
        name: "Complete.vue",
        data() {
            return {
                booking_ref: '',
                booking_name: '',
                booking_date: '',
                booking_from: '',
                booking_to: '',
                complete_page_text: '',
            }
        },
        created() {
            //console.log(complete_page_text);
            this.complete_page_text = complete_page_text;
            this.complete_page_url = complete_page_url;
            this.booking_ref = this.$route.params.booking_ref;
            axios.get(this.complete_page_url+this.booking_ref).then(function(response){
               this.booking_name = response.data.booking.passenger.name;
               this.booking_date = response.data.booking.date_elements.day+' '+response.data.booking.date_elements.month+' '+response.data.booking.date_elements.year+' at '+response.data.booking.date_elements.hours+':'+response.data.booking.date_elements.minutes;
               this.booking_from = response.data.booking.pickup.string;
               this.booking_to = response.data.booking.destination.string;
            }.bind(this));
        }
    }
</script>

<style scoped>

</style>

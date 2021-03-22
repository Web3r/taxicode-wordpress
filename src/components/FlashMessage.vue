<template>
    <div v-if='heading' 
        :class="messageClass"
    >
        <h4>{{heading}}</h4>
        <p v-if="message">{{message}}</p>
    </div>
</template>

<script>
    export default {
        name : 'FlashMessage',

        props: {
            messageClass : {
                type : String,
                default : ''
            },

            heading : {
                type : String,
                default : ''
            },

            message : {
                type : String,
                default : ''
            }

        }
    };
</script>

<template>
    <div v-if='heading' 
        :class="messageClass"
    >
        <h4>{{heading}}</h4>
        <p v-if="message">{{message}}</p>
    </div>
</template>

<script>
    // define the component properties
    const props = {
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
    };
    // define the component computed property methods
    const computed = {
    };
    // define the component methods
    const methods = {
    };
    
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

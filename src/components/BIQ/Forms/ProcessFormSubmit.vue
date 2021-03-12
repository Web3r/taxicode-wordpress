<template>
    <button v-if="useButtons"
        :disabled="processing" 
        @click="$emit('click', $event)"
        class="form-control btn btn-primary"
    >
        <div v-if="processing" 
            class="spinner-border spinner-border-sm"
        ></div>
        {{submitLabel}}
    </button>

    <input v-else 
        :value="submitLabel" 
        :disabled="processing" 
        @click="$emit('click', $event)" 
        type="button" 
        class="btn btn-primary"
    />
</template>

<script>
    export default {
        name : 'ProcessFormSubmit',

        props : {
            processing : {
                type : Boolean,
                default : false
            },

            label : {
                type : String,
                default : 'Submit'
            },

            useButtons : {
                type : Boolean,
                default : true
            }
        },

        computed : {
            // Computed value because it's dependent on a processing flag
            submitLabel : function() {
                return !this.processing ? this.label : 'Processing';
            }
        }
    };
</script>

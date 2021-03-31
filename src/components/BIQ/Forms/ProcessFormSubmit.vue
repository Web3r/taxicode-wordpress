<template>
    <button v-if="useButtons"
        :disabled="processing" 
        @click="onClick"
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
        @click="onClick" 
        type="button" 
        class="btn btn-primary"
    />
</template>

<script>
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the form submit button is clicked
        click : {
            name : 'click'
        }
    };

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
        },

        methods : {
            onClick : function(event) {
                // trigger the process form submit event
                this.$emit(emitEvents.click.name, event);
            }
        }
    };
</script>

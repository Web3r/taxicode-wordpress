<template>
    <button v-if="useButtons"
        :class="styleClass"
        :disabled="processing" 
        @click="onClick"
    >
        <div v-if="processing" 
            class="spinner-border spinner-border-sm"
        ></div>
        {{submitLabel}}
    </button>

    <input v-else 
        :class="styleClass"
        :value="submitLabel" 
        :disabled="processing" 
        @click="onClick" 
        type="button" 
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

            styleClass : {
                type : String,
                default : 'btn btn-primary'
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

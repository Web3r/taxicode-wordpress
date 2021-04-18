<template>
    <button
        :class="styleClass"
        :disabled="processing" 
        @click="onClick"
    >
        <div v-if="processing" 
            class="spinner-border spinner-border-sm"
        ></div>
        {{submitLabel}}
    </button>
</template>

<script>
    // define the component properties
    const props = {
        processing : {
            type : Boolean,
            default : false
        },

        label : {
            type : String,
            default : 'Submit'
        },

        processingLabel : {
            type : String,
            default : 'Processing'
        },

        styleClass : {
            type : String,
            default : 'btn btn-primary'
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the form submit button is clicked
        click : {
            name : 'click'
        }
    };
    // define the component computed property methods
    const computed = {
        // Computed value because it's dependent on a processing flag
        submitLabel : function() {
            return this.processing ? this.processingLabel : this.label;
        }
    };
    // define the component methods
    const methods = {
        onClick : function(evt) {
            // trigger the process form submit event
            this.$emit(emitEvents.click.name, evt);
        }
    };

    export default {
        name : 'ProcessFormSubmit',
        props,
        computed,
        methods
    };
</script>

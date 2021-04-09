<template>
    <transition 
        name="modal" 
    >
        <div 
            ref="overlay"
            @keydown.esc="onCancel"
            tabindex="0"
            class="modal-mask"
        >
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div v-if="$slots.header || header" 
                        class="modal-header"
                    >
                        <slot 
                            name="header"
                            :text="header"
                        >
                            <h5>{{header}}</h5>
                        </slot>
                    </div>

                    <div class="modal-body d-flex flex-wrap">
                        <slot 
                            name="body"
                            :text="body"
                        >
                            <p>{{body}}</p>
                        </slot>
                    </div>

                    <div v-if="$slots.footer || footer" 
                        class="modal-footer"
                    >
                        <slot 
                            name="footer"
                            :text="footer"
                        >
                            <span>{{footer}}</span>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    // import the CSS specific to the modal popup (webpack will chunk this  & auto load / include separately)
    import 'frontend/static-assets/css/modal_popup.css';

    // define the component properties
    const props = {
        header : {
            type : String,
            default : 'Default Header'
        },

        body : {
            type : String,
            default : 'Default Body'
        },

        footer : {
            type : String,
            default : 'Default Footer'
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the cancel action button is clicked
        cancel : {
            name : 'cancel'
        }
    };
    // define the component methods
    const methods = {
        onCancel : function(evt) {
            // trigger the modal cancelled event
            this.$emit(emitEvents.cancel.name, evt);
        },
    };

    export default {
        name: 'BasicModal',
        props,
        methods,

        mounted() {
            // set the focus on the overlay so pressing the esc key will also trigger the onCancel event
            this.$refs.overlay.focus();
        }
    };
</script>

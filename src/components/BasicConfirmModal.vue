<template>
    <transition 
        name="modal" 
    >
        <div 
            ref="overlay"
            @keydown.esc="onCancel"
            @keydown.enter="onConfirm"
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

                    <div class="modal-footer d-flex flex-wrap justify-content-end">
                        <slot 
                            name="footer"
                            :cancel="onCancel"
                            :confirm="onConfirm"
                            :text="footer"
                        >
                            <span>{{footer}}</span>

                            <button 
                                class="btn btn-secondary" 
                                @click="onCancel"
                            >{{cancelActionText}}</button>

                            <button 
                                class="btn btn-primary" 
                                @click="onConfirm"
                            >{{confirmActionText}}</button>
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
            default : ''
        },

        body : {
            type : String,
            default : ''
        },

        footer : {
            type : String,
            default : ''
        },

        confirmActionText : {
            type : String,
            default : 'OK'
        },

        cancelActionText : {
            type : String,
            default : 'Cancel'
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when the confirm action button is clicked
        confirm : {
            name : 'confirm'
        },
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

        onConfirm : function(evt) {
            // trigger the modal confirmed event
            this.$emit(emitEvents.confirm.name, evt);
        }
    };

    export default {
        name: 'BasicConfirmModal',
        props,
        methods,

        mounted() {
            // set the focus on the overlay so pressing the esc key will also trigger the onCancel event
            this.$refs.overlay.focus();
        }
    };
</script>

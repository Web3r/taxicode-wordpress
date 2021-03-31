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

                    <div class="modal-header">
                        <slot 
                            name="header"
                        >{{headerText}}</slot>
                    </div>

                    <div class="modal-body">
                        <slot 
                            name="body"
                        >{{bodyText}}</slot>
                    </div>

                    <div class="modal-footer">
                        <slot 
                            name="footer"
                        >
                            {{footerText}}
                            <button 
                                class="btn btn-secondary" 
                                @click="onCancel"
                            >{{cancelActionText}}</button>
                            &nbsp;
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

    export default {
        name: 'BasicConfirmModal',

        props: {
            headerText : {
                type : String,
                default : ''
            },

            bodyText : {
                type : String,
                default : ''
            },

            footerText : {
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

        },

        mounted() {
            // set the focus on the overlay so pressing the esc key will also trigger the onCancel event
            this.$refs.overlay.focus();
        },

        methods : {
            onCancel : function(event) {
                // trigger the modal cancelled event
                this.$emit(emitEvents.cancel.name, event);
            },

            onConfirm : function(event) {
                // trigger the modal confirmed event
                this.$emit(emitEvents.confirm.name, event);
            }
        }
    };
</script>

<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: table;
        transition: opacity 0.3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 550px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        margin: 20px 0;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>

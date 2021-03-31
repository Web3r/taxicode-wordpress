<template>
    <transition 
        v-if="has_upgrade"
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
                            :text="upgrade_props.title"
                        >{{upgrade_props.title}}</slot>
                    </div>

                    <div class="modal-body">
                        <slot 
                            name="body"
                            :upgrade="upgrade_props"
                        >{{upgrade_props.description}}</slot>
                    </div>

                    <div class="modal-footer">
                        <button 
                            class="btn btn-secondary" 
                            @click="onCancel"
                        >{{cancelUpgradeActionText}}</button>
                        &nbsp;
                        <button 
                            class="btn btn-primary" 
                            @click="onConfirm"
                        >{{confirmUpgradeActionText}}</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    // import the state getters & actions mappers
    import { mapGetters } from 'vuex';
    // import the recommended quote upgrade calculator
    import QuotesRecommendedUpgradeCalculator from '@/common/BIQ/QuotesRecommendedUpgradeCalculator';
    // import the vehicle specific upgrade stuff
    import { emptyUpgradeProps } from '@/common/BIQ/VehicleUpgrade';

    // define the list of events the component emits & can be listened for
    const emitEvents = {
        // when there are no upgraded quotes available for the selected quote
        unavailable : {
            name : 'unavailable'
        },
        // when the confirm action button is clicked or enter pressed on the modal
        confirm : {
            name : 'confirm'
        },
        // when the cancel action button is clicked or esc pressed on the modal
        cancel : {
            name : 'cancel'
        }
    };

    export default {
        name: 'QuoteUpgradeOfferModal',

        props: {
            journey : {
                type : String,
                required : true,
                default : ''
            },

            quote : {
                type : String,
                required : true,
                default : ''
            },

            vehicle : {
                type : Number,
                required : true,
                default : 0
            },

            confirmUpgradeActionText : {
                type : String,
                default : 'Upgrade'
            },

            cancelUpgradeActionText : {
                type : String,
                default : "Don't Upgrade"
            },

            debugging : {
                type : Boolean,
                default : false
            }

        },

        data() {
            return {
                quotesRecommendedUpgrade : new QuotesRecommendedUpgradeCalculator(
                    () => this.journeyQuotes, 
                    () => this.journeyDetails, 
                    this.debugging
                ),
                has_upgrade : false,
                upgrade_props : emptyUpgradeProps
            };
        },

        mounted() {
            // see if there is an quote avalaible for upgrade recommendation
            this.quotesRecommendedUpgrade.makeRecommendationFor(this.journeyQuotes[this.quote], this.vehicle);
            // get the recommended upgrade
            const quoteRecommendedUpgrade = this.quotesRecommendedUpgrade.getRecommendedUpgrade();
            if(this.debugging) {
                console.group('Upgrade Recommendation');
                console.log('quoteUpgradeOption', quoteRecommendedUpgrade);
                console.log('props', quoteRecommendedUpgrade.props());
                console.groupEnd();
            }
            // determine if to offer the quote vehicle upgrade recommendation
            if(!quoteRecommendedUpgrade.exists) {
            // no quote upgrade to offer
                // trigger the no upgrade available event
                return this.$emit(emitEvents.unavailable.name, quoteRecommendedUpgrade);
            }
            // there is a quote upgrade recommendation to offer so set the props details
            this.upgrade_props = quoteRecommendedUpgrade.props();
            // flag the modal popup to display the recommended upgrade offer
            this.has_upgrade = true;
        },

        updated() {
            // set the focus on the overlay so pressing the esc key will also trigger the onCancel event
            this.$refs.overlay.focus();
        },

        computed : {
            ...mapGetters([
            // BIQ Quoting state
                'journeyDetails', 
                'journeyQuotes'
            ])
        },

        methods : {
            onCancel : function(event) {
                // trigger the modal cancelled event
                this.$emit(emitEvents.cancel.name, event);
            },

            onConfirm : function(event) {
                // get the recommended upgrade 
                const recommendedUpgrade = this.quotesRecommendedUpgrade.getRecommendedUpgrade();
                // the upgrade offer was accepted, so ...
                // set the upgrade quote as the selected quote and ...
                event = {
                    recommendedUpgrade
                };
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

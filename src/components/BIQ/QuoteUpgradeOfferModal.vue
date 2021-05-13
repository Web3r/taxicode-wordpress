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
                        >
                            <h5>{{upgrade_props.title}}</h5>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot 
                            name="body"
                            :upgrade="upgrade_props"
                        >
                            <p>{{upgrade_props.description}}</p>
                        </slot>
                    </div>

                    <div class="modal-footer d-flex flex-wrap justify-content-end">
                        <slot 
                            name="footer"
                            :cancel="onCancel"
                            :confirm="onConfirm"
                        >
                            <button 
                                class="btn btn-secondary" 
                                @click="onCancel"
                            >{{cancelUpgradeActionText}}</button>

                            <button 
                                class="btn btn-primary" 
                                @click="onConfirm"
                            >{{confirmUpgradeActionText}}</button>
                        </slot>
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
    import QuotesRecommendedUpgradeCalculator from '@BIQ/QuotesRecommendedUpgradeCalculator';
    // import the vehicle specific upgrade stuff
    import { emptyUpgradeProps } from '@BIQ/VehicleUpgrade';
    // import the CSS specific to the modal popup (webpack will chunk this  & auto load / include separately)
    import 'frontend/static-assets/less/common/modal_popup.less';

    // define the component properties
    const props = {
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
    };
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
    // define the component computed property methods
    const computed = {
        ...mapGetters([
        // BIQ Quoting state
            'journeyDetails', 
            'journeyQuotes'
        ])
    };
    // define the component methods
    const methods = {
        generateUpgradeOffer : function() {
            // see if there is an quote avalaible for upgrade recommendation
            this.quotesRecommendedUpgrade.makeRecommendationFor(this.journeyQuotes[this.quote], this.vehicle);
            // get the recommended upgrade
            const upgrade = this.quotesRecommendedUpgrade.getRecommendedUpgrade();
            if(this.debugging) {
                console.group('Upgrade Recommendation');
                console.log('upgrade', upgrade);
                console.log('props', upgrade.props());
                console.groupEnd();
            }
            // determine if to offer the quote vehicle upgrade recommendation
            if(!upgrade.exists) {
            // no quote upgrade to offer
                // trigger the no upgrade available event
                return this.$emit(emitEvents.unavailable.name, upgrade);
            }
            // there is a quote upgrade recommendation to offer so set the props details
            this.upgrade_props = upgrade.props();
            // flag the modal popup to display the recommended upgrade offer
            this.has_upgrade = true;
        },

        onCancel : function(evt) {
            // trigger the modal cancelled event
            this.$emit(emitEvents.cancel.name, evt);
        },

        onConfirm : function(evt) {
            // add the recommended upgrade to the event
            evt.data = {
                recommendedUpgrade : this.quotesRecommendedUpgrade.getRecommendedUpgrade()
            };
            // trigger the modal confirmed event
            this.$emit(emitEvents.confirm.name, evt);
        }
    };

    export default {
        name: 'QuoteUpgradeOfferModal',
        props,
        computed,
        methods,

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
            this.generateUpgradeOffer();
        },

        updated() {
            // set the focus on the overlay so pressing the esc key will also trigger the onCancel event
            this.$refs.overlay.focus();
        }
    };
</script>

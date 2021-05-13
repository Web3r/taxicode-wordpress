<template src="BIQ/templates/JourneyOutline.html" />

<script>
    // import the state getters mapper
    import { mapGetters } from 'vuex';
    // import the date & time string functions for display
    import { JOURNEY_TYPE_OPTION_RETURN, JOURNEY_TYPE_OPTION_SINGLE, JOURNEY_TYPE_OPTION_HOURLY } from '@BIQ/Quotes/Search';
    // import the Journey Outline mixin
    import biqJourneyOutlineMixin from 'BIQ/mixins/JourneyOutlineMixin';

    // define the component data structure & the default / initial values
    const defaultData = {
        ul_css : 'list-inline d-flex justify-content-between align-items-center'
    };

    // define the component computed property methods
    const computed = {
        ...mapGetters([
        // BIQ Quoting state
            'journeyDetails'
        ]),

        journeyType : function() {
            if(this.journeyDetails.hourly) {
                return JOURNEY_TYPE_OPTION_HOURLY;
            }
            if(this.journeyDetails.return) {
                return JOURNEY_TYPE_OPTION_RETURN;
            }
            return JOURNEY_TYPE_OPTION_SINGLE;
        },

        pickup : function() {
            return this.journeyDetails.pickup.string;
        },

        destination : function() {
            return this.journeyDetails.destination.string;
        },

        when : function() {
            return this.journeyDetails.date;
        },

        passengers : function() {
            return this.journeyDetails.people;
        }
    };

    export default {
        name : 'QuotedJourneyOutline',
        computed,

        mixins : [
            biqJourneyOutlineMixin
        ],

        data() {
            return { ...defaultData };
        }
    };
</script>

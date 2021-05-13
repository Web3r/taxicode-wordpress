<template src="BIQ/templates/JourneyOutline.html" />

<script>
    // import the Journey Outline mixin
    import biqJourneyOutlineMixin from 'BIQ/mixins/JourneyOutlineMixin';

    // define the component data structure & the default / initial values
    const defaultData = {
        ul_css : 'flex-fill list-inline d-flex justify-content-between align-items-center',
    };

    // define the component properties
    const props = {
        journeyType : {
            type : String,
            required : true,
            default : 'Unknown',
            // @todo add a validator to ensure the journey type is valid /
        },

        pickup : {
            type : String,
            required : true,
            default : 'Unknown'
        },

        destination : {
            type : String,
            required : true,
            default : 'Unknown'
        },

        date : {
            type : String,
            required : true,
            default : 'Unknown',
            // @todo add a validator to ensure it's a valid date time string /
        },

        time : {
            type : String,
            required : true,
            default : 'Unknown',
            // @todo add a validator to ensure it's a valid time string /
        },

        passengers : {
            type : String,
            required : true,
            default : '1',
            // @todo add a validator to ensure it's between 1 & 99 /
        },

    };
    // define the component computed property methods
    const computed = {
        when : function() {
            return `${this.date} ${this.time}`;
        }
    };
    
    export default {
        name : 'JourneyOutline',
        props,
        computed,

        mixins : [
            biqJourneyOutlineMixin
        ],

        data() {
            return { ...defaultData };
        }
    };
</script>

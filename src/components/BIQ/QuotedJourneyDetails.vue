<template>
    <div class="flex-fill">
        <h4 class="card-header">{{labels.header}}</h4>

        <ul class="card list-group list-group-flush">
            <li 
                :class="li_css"
            >
                <strong>{{labels.journey.date}}</strong>
                <span>{{journeyDate}} &commat; {{journeyTime}}</span>
            </li>

            <li 
                :class="li_css"
            >
                <strong>{{labels.journey.pickup}}</strong>
                <span>{{journeyDetails.pickup.string}}</span>
            </li>

            <li 
                :class="li_css"
            >
                <strong>{{labels.journey.destination}}</strong>
                <span>{{journeyDetails.destination.string}}</span>
            </li>

            <li v-if="journeyHasVias" 
                :class="li_css"
            >
                <strong>{{labels.journey.via}}</strong>
                <span>{{journeyDetails.vias[0].string}}</span>
            </li>

            <li v-if="journeyHasReturn" 
                :class="li_css"
            >
                <strong>{{labels.journey.return_date}}</strong>
                <span>{{journeyReturnDate}} &commat; {{journeyReturnTime}}</span>
            </li>

            <li v-if="price > 0" 
                :class="li_css"
            >
                <strong>{{labels.journey.price}}</strong>
                <span v-html="displayPrice" />
            </li>
        </ul>
    </div>
</template>

<script>
    // import the state getters mapper
    import { mapGetters } from 'vuex';
    // import the date & time string functions for display
    import { journeyDetailsLabels, journeyDisplayPrice } from '@BIQ/Journey';

    // define the component default text labels used (can be overridden with the 'labels' prop)
    const defaultLabels = {
        header : 'Booking Details',
        journey : {
            ...journeyDetailsLabels,
            price : 'Price : '
        }
    };
    // define the component data structure & the default / initial values
    const defaultData = {
        li_css : 'list-group-item d-flex justify-content-between align-items-center'
    };


    // define the component properties
    const props = {
        price : {
            type : Number,
            default : 0
        },

        labels : {
            type : Object,
            // @todo add a validator to make sure that all the label keys are supplied
            default : function() { 
                return defaultLabels;
            }
        }
    };
    // define the component computed property methods
    const computed = {
        ...mapGetters([
        // BIQ Quoting state
            'journeyDetails',
            'journeyDate', 
            'journeyTime', 
            'journeyHasReturn', 
            'journeyReturnDate', 
            'journeyReturnTime', 
            'journeyHasVias'
        ]),

        displayPrice : function() {
            return journeyDisplayPrice(this.price);
        }
    };

    export default {
        name : 'QuotedJourneyDetails',
        props,
        computed,

        data() {
            return { ...defaultData };
        }
    };
</script>

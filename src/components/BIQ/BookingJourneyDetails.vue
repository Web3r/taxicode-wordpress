<template>
    <div class="flex-fill">
        <h4 class="card-header">{{labels.header}}</h4>

        <ul class="card list-group list-group-flush">
            <li 
                :class="li_css"
            >
                <strong>{{labels.booking.ref}}</strong>
                <span>{{booking.ref}}</span>
            </li>
            <li 
                :class="li_css"
            >
                <strong>{{labels.booking.name}}</strong>
                <span>{{booking.name}}</span>
            </li>
            <li 
                :class="li_css"
            >
                <strong>{{labels.booking.date}}</strong>
                <span>{{journeyDate}} &commat; {{journeyTime}}</span>
            </li>
            <li 
                :class="li_css"
            >
                <strong>{{labels.booking.pickup}}</strong>
                <span>{{booking.pickup}}</span>
            </li>
            <li 
                :class="li_css"
            >
                <strong>{{labels.booking.destination}}</strong>
                <span>{{booking.destination}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    // import the date & time string functions for display
    import { toDateString, toLocaleTimeString } from '@BIQ/Journey';

    // define the component default text labels used (can be overridden with the 'labels' prop)
    const defaultLabels = {
        header : 'Booking Details',
        booking : {
            ref : 'Booking Reference : ',
            name : 'Name : ',
            passengers : 'Passengers : ',
            pickup : 'Pickup : ',
            destination : 'Destination : ',
            via : 'Via : ',
            date : 'Date : ',
            return_date : 'Returning : '
        }
    };
    // define the component data structure & the default / initial values
    const defaultData = {
        li_css : 'list-group-item d-flex justify-content-between align-items-center'
    };

    // define the component properties
    const props = {
        booking : {
            type : Object,
            // @todo add a validator to make sure that all the booking keys are supplied
            default : function() { 
                return {
                    ref : '',
                    name : '',
                    passengers : 1,
                    pickup : '',
                    destination : '',
                    vias : [],
                    date : null,
                    return_date : null
                };
            }
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
        journeyDate :  function() {
            return toDateString(this.booking.date);
        },

        journeyTime :  function() {
            return toLocaleTimeString(this.booking.date);
        },

        journeyReturnDate :  function() {
            return toDateString(this.booking.return_date);
        },
        
        journeyReturnTime :  function() {
            return toLocaleTimeString(this.booking.return_date);
        }
    };

    export default {
        name : 'BookingJourneyDetails',
        props,
        computed,

        data() {
            return { ...defaultData };
        }
    };
</script>

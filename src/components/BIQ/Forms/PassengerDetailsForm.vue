<template>
    <div id="biq-passenger-details-form-section">
        <div v-if="$slots.heading || heading" 
            id="biq-passenger-details-form-heading"
        >
            <slot 
                name="heading"
                :heading="heading"
            >
                <h4>{{heading}}</h4>
            </slot>
        </div>

        <div class="d-flex flex-wrap justify-content-between row-col">
            <div id="biq-passenger-name">
                <label 
                    :for="fields.name.id"
                >{{fields.name.label}}</label>

                <input 
                    v-model="fields.name.value" 
                    :id="fields.name.id" 
                    :placeholder="fields.name.placeholder" 
                    :required="fields.name.required"
                    :class="errorStateClass('name')" 
                    type="text" 
                    class="flex-fill" 
                    aria-describedby="nameHelp" 
                />

                <small 
                    id="nameHelp" 
                    class="form-text text-muted"
                >{{fields.name.help}}</small>
            </div>

            <div id="biq-passenger-email">
                <label 
                    :for="fields.email.id"
                >{{fields.email.label}}</label>

                <input 
                    v-model="fields.email.value" 
                    :id="fields.email.id" 
                    :placeholder="fields.email.placeholder" 
                    :required="fields.email.required"
                    :class="errorStateClass('email')" 
                    type="email" 
                    class="flex-fill" 
                    aria-describedby="emailHelp" 
                />

                <small 
                    id="emailHelp" 
                    class="form-text text-muted"
                >{{fields.email.help}}</small>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between row-col">
            <div id="biq-passenger-telephone">
                <label 
                    :for="fields.telephone.id"
                >{{fields.telephone.label}}</label>

                <input 
                    v-model="fields.telephone.value" 
                    :id="fields.telephone.id" 
                    :placeholder="fields.telephone.placeholder" 
                    :required="fields.telephone.required"
                    :class="errorStateClass('telephone')" 
                    type="text" 
                    class="flex-fill" 
                    aria-describedby="mobileHelp" 
                />

                <small 
                    id="mobileHelp" 
                    class="form-text text-muted"
                >{{fields.telephone.label}}</small>
            </div>

            <div id="biq-passenger-flight-number">
                <label 
                    :for="fields.flight_number.id"
                >{{fields.flight_number.label}}</label>

                <input 
                    v-model="fields.flight_number.value" 
                    :id="fields.flight_number.id" 
                    :placeholder="fields.flight_number.placeholder"
                    :required="fields.flight_number.required"
                    :class="errorStateClass('flight_number')" 
                    type="text" 
                    class="flex-fill" 
                    aria-describedby="flightHelp" 
                />

                <small 
                    id="flightHelp" 
                    class="form-text text-muted"
                >{{fields.flight_number.help}}</small>
            </div>
        </div>
    </div>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';

    // define the component properties
    const props = {
        heading : {
            type : String,
            default : 'Passenger Details'
        },

        values : {
            type : Object,
            // @todo add a validator to make sure that all the fieldname keys are supplied
            default : function() { 
                return {
                    name : '',
                    email : '',
                    telephone : '',
                    flight_number : ''
                };
            }
        }
    };
    
    /**
     * Generate the list of field name = data form field structure for passenger details form
     * @param {String} idp A string to prefix the fields ID attribute with
     * @returns Object
     */
    const fF = idp => {
        return {
            name : {
                value : '',
                label : 'Name',
                required : true,
                error : null,
                errorMsg : 'Booking name must be set',
                id : `${idp}-customer_name`,
                placeholder : 'Enter your name',
                help : 'The name of the person travelling.'
            },
            email : {
                value : '',
                label : 'Email',
                required : true,
                error : null,
                errorMsg : 'Email location must be set',
                id : `${idp}-customer_email`,
                placeholder : 'Enter your email',
                help : 'We\'ll never share your email with anyone else.'
            },
            telephone : {
                value : '',
                label : 'Mobile telephone',
                required : true,
                error : null,
                errorMsg : 'Telephone must be set',
                id : `${idp}-telephone`,
                placeholder : 'Enter a mobile number',
                help : 'Valid UK mobile numbers only, please.'
            },
            flight_number : {
                value : '',
                label : 'Flight #',
                required : false,
                error : null,
                errorMsg : '',
                id : `${idp}-flight_number`,
                placeholder : 'Enter your flight number',
                help : 'If this is an airport pickup or dropoff, the relevent flight number'
            }
        }
    };

    export default {
        name : 'PassengerDetailsForm',
        props,

        mixins : [
            ValidatesMixin
        ],

        data() {
            return {
                fields : fF('biq')
            };
        }
    };
</script>

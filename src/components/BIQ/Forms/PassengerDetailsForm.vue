<template>
    <div id="biq-passenger-details-form-section">
        <div class="row">
            <div class="col">
                <h4 
                    id="tc_plugin-passenger-heading"
                >{{heading}}</h4>
            </div>
        </div>
        <div class="row">
            <div 
                id="tcplugin-passenger-name" 
                class="col"
            >
                <div class="form-group">
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
                        class="form-control" 
                        aria-describedby="nameHelp" 
                    />
                    <small 
                        id="nameHelp" 
                        class="form-text text-muted"
                    >{{fields.name.help}}</small>
                </div>
            </div>
            <div class="col">
                <div 
                    id="tcplugin-email" 
                    class="form-group"
                >
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
                        class="form-control" 
                        aria-describedby="emailHelp" 
                    />
                    <small 
                        id="emailHelp" 
                        class="form-text text-muted"
                    >{{fields.email.help}}</small>
                </div>
            </div>
        </div>
        <div class="row">
            <div 
                id="tcplugin-passenger-telephone" 
                class="col"
            >
                <div class="form-group">
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
                        class="form-control" 
                        aria-describedby="mobileHelp" 
                    />
                    <small 
                        id="mobileHelp" 
                        class="form-text text-muted"
                    >{{fields.telephone.label}}</small>
                </div>
            </div>
            <div class="col">
                <div 
                    id="tcplugin-flight-number" 
                    class="form-group"
                >
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
                        class="form-control" 
                        aria-describedby="flightHelp" 
                    />
                    <small 
                        id="flightHelp" 
                        class="form-text text-muted"
                    >{{fields.flight_number.help}}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';

    export default {
        name : 'PassengerDetailsForm',

        mixins : [
            ValidatesMixin
        ],

        props : {
            values : {
                type : Object,
                default : function() { 
                    return {
                        name : '',
                        email : '',
                        telephone : '',
                        flight_number : ''
                    };
                }
            }
        },

        data() {
            return {
                heading : 'Passenger Details',
                fields : {
                    name : {
                        value : '',
                        label : 'Name',
                        required : true,
                        error : null,
                        errorMsg : 'Booking name must be set',
                        id : 'customer_name',
                        placeholder : 'Enter your name',
                        help : 'The name of the person travelling.'
                    },
                    email : {
                        value : '',
                        label : 'Email',
                        required : true,
                        error : null,
                        errorMsg : 'Email location must be set',
                        id : 'customer_email',
                        placeholder : 'Enter your email',
                        help : 'We\'ll never share your email with anyone else.'
                    },
                    telephone : {
                        value : '',
                        label : 'Mobile telephone',
                        required : true,
                        error : null,
                        errorMsg : 'Telephone must be set',
                        id : 'telephone',
                        placeholder : 'Enter a mobile number',
                        help : 'Valid UK mobile numbers only, please.'
                    },
                    flight_number : {
                        value : '',
                        label : 'Flight #',
                        required : false,
                        error : null,
                        errorMsg : '',
                        id : 'flight_number',
                        placeholder : 'Enter your flight number',
                        help : 'If this is an airport pickup or dropoff, the relevent flight number'
                    }
                }
            };
        }
    };
</script>

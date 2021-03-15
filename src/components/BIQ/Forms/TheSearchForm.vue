<template src="./templates/TheSearchForm.html"></template>

<script>
    import axios from 'axios';
    import { mapGetters, mapActions } from 'vuex';
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';
    // import the API places location auto-complete lookup input field
    import PlacesLookup from 'BIQ/Forms/PlacesLookup.vue';
    // import the component to disply the 1-click-processing form submit button
    import ProcessFormSubmit from 'BIQ/Forms/ProcessFormSubmit.vue';

    const JOURNEY_TYPE_OPTION_SINGLE = 'One Way';
    const JOURNEY_TYPE_OPTION_RETURN = 'Return';

    export default {
        name : 'TheSearchForm',

        mixins : [
            ValidatesMixin
        ],

        components : {
            'biq-places-lookup' : PlacesLookup,
            'biq-process-form-submit' : ProcessFormSubmit
        },

        props : {
            apiPublicKey : {
                type : String,
                required : true,
                default : ''
            },
            
            apiPlacesLookup : {
                type : String,
                required : true,
                default : '//places/?term='
            },

            apiQuotesFrom : {
                type : String,
                required : true,
                default : '//booking/quote/'
            },

            searchOnLoad : {
                type : Boolean,
                default : false
            },

            useButtons : {
                type : Boolean,
                default : true
            }
        },

        data() {
            return {
                fields : {
                    journey_type : {
                        selected : JOURNEY_TYPE_OPTION_SINGLE,
                        options : [
                            JOURNEY_TYPE_OPTION_SINGLE, 
                            JOURNEY_TYPE_OPTION_RETURN
                        ],
                        label : 'Journey type',
                        required : false,
                        error : null,
                        errorMsg : '',
                        id : 'tcplugin-journey-type',
                        placeholder : ''
                    },
                    pickup : {
                        value : '',
                        label : 'Pickup',
                        required : true,
                        error : null,
                        errorMsg : 'Pickup location must be set',
                        id : 'tcplugin-pickup',
                        placeholder : 'Pickup postcode or place name'
                    },
                    destination : {
                        value : '',
                        label : 'Destination',
                        required : true,
                        error : null,
                        errorMsg : 'Destination location must be set',
                        id : 'tcplugin-destination',
                        placeholder : 'Destination postcode or place name'
                    },
                    via : {
                        value : '',
                        label : '(Optional) Via',
                        required : false,
                        error : null,
                        errorMsg : '',
                        id : 'tcplugin-via',
                        placeholder : 'Via postcode or place name'
                    },
                    people : {
                    // @todo validate input value is an integer between 1 & 99
                        value : '1',
                        label : 'Number of People',
                        required : true,
                        error : null,
                        errorMsg : 'Invalid number of people travelling',
                        id : 'tcplugin-people',
                        placeholder : ''
                    }
                },
                // @todo incoporate the journey date & time into the fields
                date : '',
                time : '',
                return_date : '',
                return_time : '',
                errors : {
                    date : null,
                    time : null,
                    return_date : null,
                    return_time : null
                }
            };
        },

        mounted() {
            // populate the search form from the state
            this.setFieldValues();
            if(this.searchOnLoad) {
                // submit the journey quote search
                this.onSearchQuotesFormSubmit();
            }
        },

        computed : {
            ...mapGetters([
            // BIQ Quote Search state
                'searchDetails',
            // BIQ Quoting state
                'loadingQuotes'
            ]),

            hasReturn : function() {
                return (this.fields.journey_type.selected === JOURNEY_TYPE_OPTION_RETURN);
            }
        },

        methods : {
            ...mapActions([
            // BIQ Quote Search state
                'searchingQuotes', 
            // BIQ Quoting state
                'apiQuotesError'
            ]),

            onPlacesLookupError : function(event) {
                if(this.debugging) {
                    console.group(event.data.message);
                    console.log(event);
                    console.groupEnd();
                }
            },

            setFieldValues : function() {
                // first set the form to current search form state
                const searchState = this.searchDetails;
                if(this.debugging) {
                    console.log('BIQ Search Form from State', searchState);
                }
                this.fields.journey_type.selected = searchState.journey_type;
                this.fields.pickup.value = searchState.pickup;
                this.fields.destination.value = searchState.destination;
                // set the referenced input field values
                this.$refs.pickupfield.inputValue = this.fields.pickup.value;
                this.$refs.destinationfield.inputValue = this.fields.destination.value;
                if(searchState.vias.length) {
                    // set the first via (as there is only 1 via but it's expected as a list)
                    this.fields.via.value = searchState.vias[0];
                    this.$refs.viafield.inputValue = this.fields.via.value;
                }
                this.fields.people.value = searchState.people;
                // @todo incoporate the journey date & time into the fields
                // @todo check that the date is in the future & adjust if not
                this.date = searchState.date;
                // @todo check that the date and time is in the future & adjust if not
                this.time = searchState.time;
                if(this.hasReturn && searchState.returning.date !== null) {
                // @todo check that the date is in the future and after the outbound date & adjust if not
                    this.return_date = searchState.returning.date;
                }
                if(this.hasReturn && searchState.returning.time !== null) {
                // @todo check that the date and time is in the future and after the outbound date time & adjust if not
                    this.return_time = searchState.returning.time;
                }
            },

            onSearchQuotesFormSubmit : function(event) {
                // @todo allow the home page to POST to the plugin page & auto search on load
                event.preventDefault();
                if(this.validate()) {
                    this.searchApiQuotes();
                } else {
                    if(this.debugging) {
                        console.group('BIQ Search Form Validation Error');
                        console.log(this.validationErrors());
                        console.log(this.errors);
                        console.groupEnd();
                    }
                }
            },

            validate : function() {
                // @todo incoporate the journey date & time into the fields
                // reset the common validation error flags
                this.errors = {
                    date : null,
                    time : null,
                    return_date : null,
                    return_time : null
                }
                // just keep a track of any errors
                let errors = 0;
                // validate the search form fields
                if(!this.validateValues()) {
                // something doesn't validate
                    errors++;
                }
                // @todo incoporate the journey date & time into the fields
                // @todo validate date is not in the past
                if(this.date == null || this.date == '') {
                    this.errors.date = 'Journey date is invalid';
                    errors++;
                }
                // @todo validate that the date time is not in the past
                if(this.time == null || this.time == '') {
                    this.errors.time = 'Journey time is invalid';
                    errors++;
                }
                if(this.hasReturn) {
                // @todo validate the return date time are not before the 
                //       outbound date time if there is a return journey included
                    // @todo incoporate the journey return date & time into the fields
                    // @todo validate return date is not in the past
                    if(this.return_date == null || this.return_date == '') {
                        this.errors.return_date = 'Journey return date is invalid';
                        errors++;
                    }
                    // @todo validate that the return date time is not in the past
                    if(this.return_time == null || this.return_time == '') {
                        this.errors.return_time = 'Journey return time is invalid';
                        errors++;
                    }
                }
                // only valid if no errors encountered
                return (errors === 0);
            },

            searchApiQuotes : function() {
                const self = this;
                const values = this.inputValues();
                const journey = {
                    journey_type : values.journey_type,
                    pickup : values.pickup,
                    destination : values.destination, 
                    people : values.people, 
                    date : this.date, 
                    time : this.time
                };
                let journey_id = null;
                let apiQuotesURI = `pickup=${journey.pickup}&destination=${journey.destination}&date=${journey.date} ${journey.time}&people=${journey.people}`;
                if(this.hasReturn) {
                // @todo incoporate the journey date & time into the fields
                // add the optional return journey details
                    journey.returning = {
                        date : this.return_date, 
                        time : this.return_time, 
                    };
                    apiQuotesURI = `${apiQuotesURI}&return=${journey.returning.date} ${journey.returning.time}`;
                } else {
                    // make sure the state doesn't have previous return date & time still included
                    journey.returning = {
                        date : null, 
                        time : null, 
                    };
                }
                const via = this.fields.via.value;
                if(via != '') {
                // add the optional journey via location(s)
                    // vias is expected as a list but only 1 via is available
                    journey.vias = [via];
                    apiQuotesURI = `${apiQuotesURI}&via=${via}`;
                } else {
                    // make sure the state doesn't have previous via still included
                    journey.vias = [];
                }
                // update the state with the journey details being quoted for
                // also updates the state flag for loading quotes
                this.searchingQuotes(journey);
                if(this.debugging) {
                    console.group(`Searching BIQ API Quotes from '${this.apiQuotesFrom}'`);
                }
                // get the quotes for the specified journey details
                axios.get(`${this.apiQuotesFrom}?key=${this.apiPublicKey}&${apiQuotesURI}`)
                .then(response => {
                    if(self.debugging) {
                        console.log(response);
                    }
                    if(response.data.status != 'OK') {
                    // throw new error event & let the catch() handle creating the event
                        // there's nothing usable in the response except the error
                        throw new ErrorEvent(response.data.status, {
                            error : new Error('BIQ API Quotes Error'),
                            message : response.data[response.data.status.toLowerCase()]
                        });
                    }
                    journey_id = response.data.journey_id;
                    // create the event data to inform the container of the API Quote Journey ID, 
                    // API Quote journey details and the API Quote results
                    const event = {
                        data : {
                            journey_id, 
                            journey : response.data.journey, 
                            quotes : response.data.quotes
                        }
                    };
                    // set the event name to be triggered
                    let event_name = 'biqQuotesSearched';
                    if(Object.keys(response.data.quotes).length <= 0) {
                    // zero quotes returned
                        // change the event to be triggered
                        event_name = 'biqZeroQuotes';
                        // add the event error data
                        event.data.error = {
                            message : response.data.warnings[0]
                        }
                    }
                    // trigger the quotes searched event 
                    self.$emit(event_name, event);
                    if(self.debugging) {
                        console.info('BIQ API Quotes Searched');
                        console.groupEnd();
                    }
                })
                .catch(error => {
                    // create the error event data
                    const event = {
                        data : {
                            quotes : [],
                            journey_id, 
                            journey, 
                            error
                        }
                    };
                    // trigger the error event
                    self.$emit('biqQuotesError', event);
                    if(self.debugging) {
                        console.info('BIQ API Quotes Search Error');
                        console.groupEnd();
                    }
                });
            }
        }
    };
</script>

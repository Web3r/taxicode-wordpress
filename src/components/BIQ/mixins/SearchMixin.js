// import the plugin to handle the Xhr AJAX API Search request
import axios from 'axios';
// import the state getters & actions mappers
import { mapGetters, mapActions } from 'vuex';
// import the mixin that sets values & validates field values and the form events
import { ValidatesMixin, formEvents } from 'mixins/ValidatesMixin';
// import the journey quote search form fields
import { JOURNEY_TYPE_OPTION_RETURN, fF } from '@/common/BIQ/QuotesSearch';
// import the journey quotes searched events
import { quotesSearchedEvents } from '@/common/BIQ/QuotesSearched';
// import the API places location auto-complete lookup input field
import PlacesLookup from 'BIQ/Forms/PlacesLookup.vue';

// define the common props without the validation mixin props
export const searchProps = {
    biqPublicKey : {
        type : String,
        required : true,
        default : ''
    },
    
    biqPlacesLookup : {
        type : String,
        required : true,
        default : '//places/?term='
    },

    biqQuotesFrom : {
        type : String,
        required : true,
        default : '//booking/quote/'
    },

    idPrefix : {
        type : String,
        default : 'biq'
    },

    searchOnLoad : {
        type : Boolean,
        default : false
    },

    debugging : {
        type : Boolean,
        default : false
    }
};
// define the combined events emitted by the search component mixin
export const searchEvents = {
    ...formEvents,
    ...quotesSearchedEvents
};

// define the common stuff for the BIQ Search Form
export const biqSearchMixin = {

    components : {
        // can't use the lazy async loading approach as the component is used with multiple refs
        'biq-places-lookup' : PlacesLookup,
        'biq-process-form-submit' : () => import(/* webpackChunkName: "BIQProcessFormSubmits", webpackPrefetch: true */ 'BIQ/Forms/ProcessFormSubmit.vue')
    },

    props : {
        // mix in the validates mixin props
        ...ValidatesMixin.props,
        ...searchProps
    },

    data() {
        return {
            fields : fF(this.idPrefix),
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
            },
            date_picker_formats : {
                short : { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit'
                },
                medium : { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit', 
                    weekday: 'short'
                }
            }
        };
    },

    mounted() {
        // populate the search form from the state
        this.setFieldValues();
        if(this.searchOnLoad) {
            // submit the journey quote search
            this.onSearchQuotesFormSubmit({ });
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
        // mix in the validates mixin methods
        ...ValidatesMixin.methods,

        ...mapActions([
        // BIQ Quote Search state
            'searchingQuotes', 
        // BIQ Quoting state
            'apiQuotesError'
        ]),

        journeyDateTimeErrorState : function(fname) {
            return (this.errors[fname] !== null)
                // validation has been run & errors encountered
                // returning false will set the state as failed validation
                ? (this.errors[fname].length) ? false : true
                // returning null will not set any validation state associated styles
                : null;
        },

        onPlacesLookupError : function(evt) {
            if(this.debugging) {
                console.group(evt.data.message);
                console.log(evt);
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
            if(searchState.vias.length) {
                // set the first via (as there is only 1 via but it's expected as a list)
                this.fields.via.value = searchState.vias[0];
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
            // set the PlacesLookup field input refs
            this.$nextTick(() => {
                this.$refs.pickupfield.inputValue = this.fields.pickup.value;
                this.$refs.destinationfield.inputValue = this.fields.destination.value;
                this.$refs.viafield.inputValue = this.fields.via.value;
            });
        },

        onSearchQuotesFormSubmit : function(evt) {
            evt.data = {
                // provide access to the form validation method
                validate : () => this.validate(),
                // provide access to the form values method
                formValues : () => this.formValues(),
                // provide access to a default form submit action method
                defaultAction : () => {
                    if(this.validate()) {
                    // the form validated
                        // make the BIQ API search
                        this.searchApiQuotes(this.formValues());
                    }
                },
                // provide access to the form BIQ API search method
                searchApiQuotes : () => this.searchApiQuotes(this.formValues())
            };
            // trigger the search form submit event
            this.$emit(searchEvents.submit.name, evt);
        },

        validate : function() {
            // @todo incoporate the journey date & time into the fields
            // reset the common validation error flags
            this.errors = {
                date : null,
                time : null,
                return_date : null,
                return_time : null
            };
            // just keep a track of any errors
            let error_count = 0;
            // validate the search form fields
            if(!this.validateValues()) {
            // something doesn't validate
                error_count++;
            }
            // @todo incoporate the journey date & time into the fields
            // @todo validate date is not in the past
            if(this.date == null || this.date == '') {
                this.errors.date = 'Journey date is invalid';
                error_count++;
            }
            // @todo validate that the date time is not in the past
            if(this.time == null || this.time == '') {
                this.errors.time = 'Journey time is invalid';
                error_count++;
            }
            if(this.hasReturn) {
            // @todo validate the return date time are not before the 
            //       outbound date time if there is a return journey included
                // @todo incoporate the journey return date & time into the fields
                // @todo validate return date is not in the past
                if(this.return_date == null || this.return_date == '') {
                    this.errors.return_date = 'Journey return date is invalid';
                    error_count++;
                }
                // @todo validate that the return date time is not in the past
                if(this.return_time == null || this.return_time == '') {
                    this.errors.return_time = 'Journey return time is invalid';
                    error_count++;
                }
            }
            // only valid if no errors encountered
            const validated = (error_count === 0);
            // trigger the appropriate validation event
            this.emitValidationEvent(validated);
            return validated;
        },

        emitValidationEvent : function(validated) {
            // set the event name to be triggered (assume pass to start)
            let emitEvent = searchEvents.validated.name;
            // create a validation event data
            const event = {
                data : {
                    // add the input values to the event data
                    values : {...this.inputValues()}
                }
            };
            if(!validated) {
            // the validation failed
                // change the event to be triggered
                emitEvent = searchEvents.validationError.name;
                // add the validation errors to the event data
                event.data.errors = {
                    ...this.validationErrors(),
                    ...this.errors
                };
                if(this.debugging) {
                    console.group('BIQ Search Form Validation Error');
                    console.log('Validation Error Fields', {...this.validationErrors()});
                    console.log('Validation Error', event.data.errors);
                    console.groupEnd();
                }
            }
            // trigger the validation error event
            this.$emit(emitEvent, event);
        },

        formValues : function() {
            const v = this.inputValues();
            const j = {
                journey_type : v.journey_type,
                pickup : v.pickup,
                destination : v.destination, 
                people : v.people, 
                date : this.date, 
                time : this.time
            };
            if(this.hasReturn) {
            // @todo incoporate the journey date & time into the fields
            // add the optional return journey details
                j.returning = {
                    date : this.return_date, 
                    time : this.return_time, 
                };
            } else {
                // make sure the state doesn't have previous return date & time still included
                j.returning = {
                    date : null, 
                    time : null, 
                };
            }
            const via = this.fields.via.value;
            if(via != '') {
            // add the optional journey via location(s)
                // vias is expected as a list but only 1 via is available
                j.vias = [via];
            } else {
                // make sure the state doesn't have previous via still included
                j.vias = [];
            }
            return j;
        },

        searchApiQuotes : function(j) {
            const self = this;
            // update the state with the journey details being quoted for
            // also updates the state flag for loading quotes
            this.searchingQuotes(j);
            let journey_id = null;
            let apiQuotesURI = `pickup=${j.pickup}&destination=${j.destination}&date=${j.date} ${j.time}&people=${j.people}`;
            if(this.hasReturn) {
                apiQuotesURI = `${apiQuotesURI}&return=${j.returning.date} ${j.returning.time}`;
            }
            if(j.vias.length) {
            // add the optional journey via location(s)
                // vias is expected as a list but only 1 via is available
                apiQuotesURI = `${apiQuotesURI}&via=${j.vias[0]}`;
            }
            if(this.debugging) {
                console.group(`Searching BIQ API Quotes from '${this.biqQuotesFrom}'`);
            }
            // get the quotes for the specified journey details
            axios.get(`${this.biqQuotesFrom}?key=${this.biqPublicKey}&${apiQuotesURI}`)
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
                let emitEvent = searchEvents.biqQuotesSearched.name;
                if(Object.keys(response.data.quotes).length <= 0) {
                // zero quotes returned
                    // change the event to be triggered
                    emitEvent = searchEvents.biqZeroQuotes.name;
                    // add the event error data
                    event.data.error = {
                        message : response.data.warnings[0]
                    }
                }
                // trigger the quotes searched event 
                self.$emit(emitEvent, event);
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
                        journey : j, 
                        error
                    }
                };
                // trigger the error event
                self.$emit(searchEvents.biqQuotesError.name, event);
                if(self.debugging) {
                    console.info('BIQ API Quotes Search Error');
                    console.groupEnd();
                }
            });
        }
    }
};
// export the default object container
export default biqSearchMixin;

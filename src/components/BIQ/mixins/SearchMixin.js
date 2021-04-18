// import the state getters & actions mappers
import { mapGetters } from 'vuex';
// import the mixin that sets values & validates field values and the form events
import { ValidatesMixin, formEvents } from 'mixins/ValidatesMixin';
// import the journey quote search form fields
import { JOURNEY_TYPE_OPTION_RETURN, fF } from '@/common/BIQ/QuotesSearch';
// import the API places location auto-complete lookup input field
import PlacesLookup from 'BIQ/Forms/PlacesLookup.vue';

// define the BIQ Search component Mixin properties
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
// define the combined list of events the BIQ Search component emits & can be listened for
const emitEvents = {
    ...formEvents
};
// define the BIQ Search component computed property Mixin methods
const computed = {
    hasReturn : function() {
        return (this.fields.journey_type.selected === JOURNEY_TYPE_OPTION_RETURN);
    }
};
// define the BIQ Search component Mixin methods
const methods = {
    // @todo finish abstracting the search methods responsibilities
    //       form field handling (setting / updating values)
    //       form validation (and event emitting)
    //       form submit (including on valid action)
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
    }
};

// define the BIQ Search Mixin for components to include & inherit from
export const biqSearchMixin = {
    props : {
        // include the validates mixin props
        ...ValidatesMixin.props,
        ...searchProps
    },

    components : {
        // can't use the lazy async loading approach as the component is used with multiple refs
        'biq-places-lookup' : PlacesLookup,
        'biq-process-form-submit' : () => import(/* webpackChunkName: "BIQProcessFormSubmits", webpackPrefetch: true */ 'BIQ/Forms/ProcessFormSubmit.vue')
    },

    // use the following to extract the mixin data inside the component 
    // data method as it destroys this object
    // const mixinData = SearchMixin.data.call(this);
    data() {
        return {
            // generate the form fields definition list
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
        // include the state
        ...mapGetters([
        // BIQ Quote Search state
            'searchDetails',
        // BIQ Quoting state
            'loadingQuotes'
        ]),
        ...computed
    },

    methods : {
        // include the validates mixin methods
        ...ValidatesMixin.methods,
        ...methods,

        setFieldValues : function() {
            // first set the form to current search form state
            const sState = this.searchDetails;
            if(this.debugging) {
                console.log('BIQ Search Form from State', sState);
            }
            this.fields.journey_type.selected = sState.journey_type;
            this.fields.pickup.value = sState.pickup;
            this.fields.destination.value = sState.destination;
            if(sState.vias.length) {
                // set the first via (as there is only 1 via but it's expected as a list)
                this.fields.via.value = sState.vias[0];
            }
            this.fields.people.value = sState.people;
            // @todo incoporate the journey date & time into the fields
            // @todo check that the date is in the future & adjust if not
            this.date = sState.date;
            // @todo check that the date and time is in the future & adjust if not
            this.time = sState.time;
            if(this.hasReturn && sState.returning.date !== null) {
            // @todo check that the date is in the future and after the outbound date & adjust if not
                this.return_date = sState.returning.date;
            }
            if(this.hasReturn && sState.returning.time !== null) {
            // @todo check that the date and time is in the future and after the outbound date time & adjust if not
                this.return_time = sState.returning.time;
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
            };
            // trigger the search form submit event
            this.$emit(emitEvents.submit.name, evt);
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
            let emitEvent = emitEvents.validated.name;
            // create a validation event data
            const event = {
                data : {
                    // add the input values to the event data
                    values : { ...this.inputValues() }
                }
            };
            if(!validated) {
            // the validation failed
                // change the event to be triggered
                emitEvent = emitEvents.validationError.name;
                // add the validation errors to the event data
                event.data.errors = {
                    ...this.validationErrors(),
                    ...this.errors
                };
                if(this.debugging) {
                    console.group('BIQ Search Form Validation Error');
                    console.log('Validation Error Fields', { ...this.validationErrors() });
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
                time : this.time,
                hasReturn : this.hasReturn
            };
            if(j.hasReturn) {
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
        }
    }
};
// export the BIQ Search Mixin as the default object
export default biqSearchMixin;

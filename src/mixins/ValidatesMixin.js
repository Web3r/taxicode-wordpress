// define the list of form events components can emit & be listened for
export const formEvents = {
    // when the form submit button is clicked
    submit : {
        name : 'submit'
    },
    // when the form input values have been validated
    validated : {
        name : 'validated'
    },
    // when there is an form input field validation error on the form
    validationError : {
        name : 'validationError'
    }
};

export const ValidatesMixin = {
    props : {
        validClass : {
            type : String,
            default : ''
        },

        errorClass : {
            type : String,
            default : 'is-invalid'
        },

        errorState : {
            type : String,
            default : null
        },

        values : {
            type : Object,
            default : function() { 
                // fieldname : value key pair object
                return {};
            }
        },

        debugging : {
            type : Boolean,
            default : false
        }
    },

    data() {
        /**
         * 'fields' fieldname : definition object key pair
         * 
         * fieldname definition has some required / used properties
         * 
         * value / selected - validated if required & can be v-modelled by fields[fieldname].value
         * required - flag to inicate the value must be set
         * error - will be set to the validation error message if the fields[fieldname].value fails validation
         * errorMsg - validation error message to use
         */
        return {
            // fieldname : definition object key pair
            fields : {}
        };
    },

    methods : {
        validate : function() {
        // allow this method to be overridden while leaving the
        // reusable validation method available
            return this.validateValues();
        },

        specialValidationErrors : function() {
        // allow this method to be overridden while leaving the
        // reusable validation errors method usable & calling this method 
        // to allowing adding none mixins based fieldname validation errors to the return data
            return {};
        },

        specialInputValues : function() {
        // allow this method to be overridden while leaving the
        // reusable input values method usable & calling this method 
        // to allowing adding none mixins based fieldname values to the return data
            return {};
        },

        errorStateClass : function(fname) {
            return this.fields[fname].error == null 
                ? '' 
                : this.fields[fname].error 
                    ? this.errorClass 
                    : this.validClass;
        },

        setFieldValues : function() {
            const self = this;
            if(this.debugging) {
                console.group(`Setting ${this.$options._componentTag} values`);
                console.log('Fields Before', { ...this.fields });
                console.log('Values', this.values);
            }
            Object.keys(this.values).forEach(fname => {
                if(!self.fields.hasOwnProperty(fname)) {
                    if(self.debugging) {
                        console.info(`${self.$options._componentTag} does not contain field '${fname}'`);
                    }
                    return;
                }
                const prop = self.fields[fname].hasOwnProperty('value') ? 'value' : 'selected';
                self.fields[fname][prop] = self.values[fname];
            });
            if(this.debugging) {
                console.log('Fields After', { ...this.fields });
                console.groupEnd();
            }
        },

        validateValues : function() {
            const self = this;
            // just keep a track of any errors
            let errors = 0;
            if(this.debugging) {
                console.group(`Validating ${this.$options._componentTag} values`);
            }
            Object.keys(this.fields).forEach(fname => {
                // set the fields validation error message flag to null to indicate unchecked
                self.fields[fname].error = null;
                if(!self.fields[fname].required) {
                // field is not required so it doesn't matter is it's empty
                    return;
                }
                const prop = self.fields[fname].hasOwnProperty('value') ? 'value' : 'selected';
                if(self.fields[fname][prop] == '') {
                // field is required & empty
                    // set the fields error message flag to the error messgae to inidcate validation error
                    self.fields[fname].error = self.fields[fname].errorMsg;
                    if(self.debugging) {
                        console.info(`Invalid field value for '${fname}' -- ${self.fields[fname].error}`);
                    }
                    errors++;
                } else {
                // field passes validation
                    // set the error message flag to empty to indicate it's valid
                    self.fields[fname].error = '';
                }
            });
            if(this.debugging) {
                console.groupEnd();
            }
            // only valid if no errors encountered
            return (errors == 0);
        },

        validationErrors : function() {
            const self = this;
            const errors = {};
            Object.keys(this.fields).forEach(fname => {
                errors[fname] = self.fields[fname].error;
            });
            return {
                ...this.specialValidationErrors(),
                ...errors
            };
        },

        inputValues : function() {
            const self = this;
            const values = {};
            Object.keys(this.fields).forEach(fname => {
                const prop = self.fields[fname].hasOwnProperty('value') ? 'value' : 'selected';
                values[fname] = self.fields[fname][prop];
            });
            return {
                ...this.specialInputValues(),
                ...values
            };
        }
    }
};

export default ValidatesMixin;

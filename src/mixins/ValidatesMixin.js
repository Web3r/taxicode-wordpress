const ValidatesMixin = {
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

        errorStateClass : function(fieldname) {
            return this.fields[fieldname].error == null 
                ? '' 
                : this.fields[fieldname].error 
                    ? this.errorClass 
                    : this.validClass;
        },

        setFieldValues : function() {
            const self = this;
            if(this.debugging) {
                console.group(`Setting ${this.$options._componentTag} values`);
                console.log('Fields Before', {...this.fields});
                console.log('Values', this.values);
            }
            Object.keys(this.values).forEach(fieldname => {
                if(!self.fields.hasOwnProperty(fieldname)) {
                    if(self.debugging) {
                        console.info(`${self.$options._componentTag} does not contain field '${fieldname}'`);
                    }
                    return;
                }
                const prop = self.fields[fieldname].hasOwnProperty('value') ? 'value' : 'selected';
                self.fields[fieldname][prop] = self.values[fieldname];
            });
            if(this.debugging) {
                console.log('Fields After', {...this.fields});
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
            Object.keys(this.fields).forEach(fieldname => {
                // set the fields validation error message flag to null to indicate unchecked
                self.fields[fieldname].error = null;
                if(!self.fields[fieldname].required) {
                // field is not required so it doesn't matter is it's empty
                    return;
                }
                const prop = self.fields[fieldname].hasOwnProperty('value') ? 'value' : 'selected';
                if(self.fields[fieldname][prop] == '') {
                // field is required & empty
                    // set the fields error message flag to the error messgae to inidcate validation error
                    self.fields[fieldname].error = self.fields[fieldname].errorMsg;
                    if(self.debugging) {
                        console.info(`Invalid field value for '${fieldname}' -- ${self.fields[fieldname].error}`);
                    }
                    errors++;
                } else {
                // field passes validation
                    // set the error message flag to empty to indicate it's valid
                    self.fields[fieldname].error = '';
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
            Object.keys(this.fields).forEach(fieldname => {
                errors[fieldname] = self.fields[fieldname].error;
            });
            return {
                ...this.specialValidationErrors(),
                ...errors
            };
        },

        inputValues : function() {
            const self = this;
            const values = {};
            Object.keys(this.fields).forEach(fieldname => {
                const prop = self.fields[fieldname].hasOwnProperty('value') ? 'value' : 'selected';
                values[fieldname] = self.fields[fieldname][prop];
            });
            return {
                ...this.specialInputValues(),
                ...values
            };
        }
    }
};

export default ValidatesMixin;

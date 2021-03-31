// define the journey type search options
export const JOURNEY_TYPE_OPTION_SINGLE = 'One Way';
export const JOURNEY_TYPE_OPTION_RETURN = 'Return';
// define the available journey search options
export const SEARCH_JOURNEY_OPTIONS = [
    JOURNEY_TYPE_OPTION_SINGLE, 
    JOURNEY_TYPE_OPTION_RETURN
];
// set the default selected journey search option as the first 1
export const SEARCH_JOURNEY_DEFAULT_OPTION = SEARCH_JOURNEY_OPTIONS[0];

/**
 * Generate the list of field name = data form field structure for quotes search
 * (does not include journey date fields yet)
 * @param {String} idp A string to prefix the fields ID attribute with
 * @returns Object
 */
export const formFields = idp => {
    return {
        journey_type : {
            selected : SEARCH_JOURNEY_DEFAULT_OPTION,
            options : SEARCH_JOURNEY_OPTIONS,
            label : 'Journey type',
            required : false,
            error : null,
            errorMsg : '',
            id : `${idp}-journey`,
            placeholder : ''
        },
        pickup : {
            value : '',
            label : 'Pickup',
            required : true,
            error : null,
            errorMsg : 'Pickup location must be set',
            id : `${idp}-pickup`,
            placeholder : 'Pickup postcode or place name'
        },
        destination : {
            value : '',
            label : 'Destination',
            required : true,
            error : null,
            errorMsg : 'Destination location must be set',
            id : `${idp}-destination`,
            placeholder : 'Destination postcode or place name'
        },
        via : {
            value : '',
            label : '(Optional) Via',
            required : false,
            error : null,
            errorMsg : '',
            id : `${idp}-via`,
            placeholder : 'Via postcode or place name'
        },
        people : {
        // @todo validate input value is an integer between 1 & 99
            value : '1',
            label : 'Number of People',
            required : true,
            error : null,
            errorMsg : 'Invalid number of people travelling',
            id : `${idp}-people`,
            placeholder : ''
        }
        // @todo incoporate the journey date & time into the fields
    }
};

// function to put a date & time forward a little
export const searchDatePlus = (dt, d, h) => {
    dt.setDate(dt.getDate() + d);
    dt.setHours(dt.getHours() + h);
    return dt;
};
// create a new date to initialise the search form date & time fields
export const searchDateDefault = () => searchDatePlus(new Date(), 1, 2);
// define a function to add leading zeros to the date time values for string value use
export const az = n => (n < 10) ? '0' + n : n;

// define the default initial state structure & values
export const defaultState = () => {
    const d = searchDateDefault();
    return {
        search_details : {
            journey_type : SEARCH_JOURNEY_DEFAULT_OPTION,
            pickup : '',
            vias : [], 
            destination : '', 
            // getMonth is zero based, getDate is not
            date : d.getFullYear() + '-' + az(d.getMonth() +1) + '-' + az(d.getDate()), 
            time : az(d.getHours()) + ':' + az(d.getMinutes()) + ':' + az(d.getSeconds()), 
            people : '1',
            returning : {
                date : '', 
                time : '', 
            }
        },
        results : false,
        display_type : '',
        display_quotes : []
    };
};

// create a default exportable object container
const QuotesSearch = {
    SEARCH_JOURNEY_OPTIONS,
    SEARCH_JOURNEY_DEFAULT_OPTION,
    formFields,
    searchDateDefault,
    searchDatePlus,
    az,
    defaultState
};
// export the default object container
export default QuotesSearch;

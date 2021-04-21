export const LIVE_API_HOST = 'https://api.taxicode.com/';
export const TEST_API_HOST = 'https://api.stagingtaxis.co.uk/';

export const AUTH_URI = 'auth/';

export const CLIENT_SECRET_URI = 'booking/client_gateway_secret/';
export const PAYMENT_URI = 'booking/pay/';

// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = API URL
 * - k = BIQ API public affiliate key
 * - r = response payload
 * - d = debugging flag
 */
// parse the API response payload for status OK
export const apiResponseParse = (URL, k, r, d) => {
    if(d) {
        console.log(`BIQ API response for - ${URL}`, r);
    }
    if(r.data.status != 'OK') {
    // throw new error event & let the catch() handle creating the event
        // there's nothing usable in the response except the error
        throw new ErrorEvent(r.data.status, {
            error : new Error(`BIQ API Error`),
            message : r.data[r.data.status.toLowerCase()]
        });
    }
    // return the useful response data payload
    return r.data;
};

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API URL
 * - k = BIQ API public affiliate key
 * - e = Error
 * - m = optional message (comes from error by default)
 */
// return a structured caught error for rejection
export const hmmm = (URL, k, e, m) => {
    // return a base error object
    return {
        data : {
            URL,
            key : k,
            message : m || e.message,
            error : e
        }
    };
};

// create a default exportable object container
export const API = {
    LIVE_HOST : LIVE_API_HOST,
    TEST_HOST : TEST_API_HOST,
    URI : {
        AUTH : AUTH_URI
    },
    apiResponseParse,
    hmmm
};
// export the default object container
export default API;

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API booking pay URL
 * - k = BIQ API public affiliate key
 * - f = the payment form data object
 * - d = debugging flag
 */
// promise to return the result of the booking pay attempt
export const makeBooking = (URL, k, f, d) => {
    // add the affiliate key to the form postdata
    f.append('key', k);
    // set the request config
    const rqc = {
        headers : {
            'Content-Type' : 'application/application/x-www-form-urlencoded',
        }
    };
    return new Promise((rslv, rej) => {
        // get the quotes for the specified journey details
        axios.post(URL, f, rqc)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // resolve with the response data
        .then (data => rslv(data))
        .catch(e => {
            // get the error message
            const m = e.message || 'Unknown';
            // construct the base error object
            const err = hmmm(URL, k, e, `BIQ API Booking Error - ${m}`);
            // add the booking error event data
            err.data.type = 'booking';
            err.data.booking = {
                token : f.get('token'), 
                method : f.get('method'), 
                formData : f
            };
            // reject the failure for handling
            rej(err);
        });
    });
};

// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';
// import the API Error 
import APIError from '@BIQ/Errors/APIError';

// define the BIQ API hosts
export const LIVE_API_HOST = 'https://api.taxicode.com/';
export const TEST_API_HOST = 'https://api.stagingtaxis.co.uk/';
// define the API URI for getting the auth public key for encrypting data
export const AUTH_URI = 'auth/';

/**
 * Reject the outcome of an API call and update the error descriptor
 * @param {Function} rej The API promise reject callback
 * @param {APIError} e The BIQ API public affiliate key
 * @param {String} desc The error description update
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The rejected Promise
 */
export const rejected = (rej, e, desc, d) => {
    if(!!d) {
        console.log(desc, { ...e });
        console.info(e.toString(), e.toJSON());
        console.error(e);
    }
    // get the error message
    const m = e.message || 'Unknown';
    e.setDesc(`${desc} - ${m}`);
    // reject the failure for handling
    return rej(e);
};

/**
 * Make a BIQ API GET request and promise to return the parsed 
 * API response payload with status OK or reject with a bundled APIError
 * @param {String} URL The BIQ API URL
 * @param {String} k The BIQ API public affiliate key
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The parsed API response or rejected APIError
 */
export const apiGet = (URL, k, d) => {
    return new Promise((rslv, rej) => {
        // make the BIQ API call & add the public key
        return axios.get(`${URL}&key=${k}`)
        // parse the api response for status OK
        .then(r => rslv(apiResponseParse(URL, k, r, d)))
        .catch(e => {
        // could be an axios error or response parsed error
            if(!!d) {
                console.log('BIQ API Error', { ...e });
                console.error(e);
            }
            // get the error message
            const m = e.message || 'Unknown';
            // reject the API Error bundled failure for handling
            return rej(new APIError(URL, k, e, m));
        });
    });
};

/**
 * Make a BIQ API POST request and promise to return the parsed 
 * API response payload with status OK or reject with a bundled APIError
 * @param {String} URL The BIQ API URL
 * @param {String} k The BIQ API public affiliate key
 * @param {FormData} f The form data object
 * @param {Object} rqc The request config
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The parsed API response or rejected APIError
 */
 export const apiPost = (URL, k, f, rqc, d) => {
    f.append('key', k);
    return new Promise((rslv, rej) => {
        // make the BIQ API call & add the public key
        return axios.post(URL, f, rqc)
        // parse the api response for status OK
        .then(r => rslv(apiResponseParse(URL, k, r, d)))
        .catch(e => {
        // could be an axios error or response parsed error
            if(!!d) {
                console.log('BIQ API Error', { ...e });
                console.error(e);
            }
            // get the error message
            const m = e.message || 'Unknown';
            // reject the API Error bundled failure for handling
            return rej(new APIError(URL, k, e, m));
        });
    });
};

/**
 * Parse the API response payload for status OK
 * @param {String} URL The BIQ API URL that was used
 * @param {String} k The BIQ API public affiliate key that was used
 * @param {Object} r The response payload
 * @param {Boolean} d A debugging flag
 * @returns {Object} The response payload data
 * @throws {ErrorEvent} If the status is not OK
 */
export const apiResponseParse = (URL, k, r, d) => {
    if(!!d) {
        console.log(`BIQ API response for - ${URL}`, r);
    }
    if(r.data.status != 'OK') {
    // Danger Will Robinson! Danger!
        // there's nothing usable in the response except the error
        // get the error / warning messages (could be multiple)
        const m = r.data[r.data.status] || r.data[r.data.status.toLowerCase()];
        // log a warning things are not OK
        console.warn(m);
        // throw the error to be caught & properly handled
        throw new ErrorEvent(r.data.status, {
            error : new Error(`BIQ API Error`),
            message : m
        });
    }
    // return the useful response data payload
    return { ...r.data };
};

/**
 * return a structured caught error for rejection
 * @param {String} URL BIQ API URL
 * @param {String} k BIQ API public affiliate key
 * @param {Error} e The Error
 * @param {String} m optional message (comes from error by default)
 * @returns {Object}
 */
export const hmmm = (URL, k, e, m) => {
    const msg = m || e.message;
    const err = new APIError(URL, k, e, m);
    // return a base error object
    return {
        message : e.message,
        err,
        data : {
            URL,
            key : k,
            message : msg,
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
    apiGet,
    apiResponseParse,
    rejected,
    hmmm
};
// export the default object container
export default API;

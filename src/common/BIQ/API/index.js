// define the BIQ API hosts
export const LIVE_API_HOST = 'https://api.taxicode.com/';
export const TEST_API_HOST = 'https://api.stagingtaxis.co.uk/';
// define the API URI for getting the auth public key for encrypting data
export const AUTH_URI = 'auth/';

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

// import the BIQ API response handlers
import { apiResponseParse, hmmm } from '@BIQ/API';
// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';

// export the API Booking Checkout URIs
export const CLIENT_SECRET_URI = 'booking/client_gateway_secret/';
export const PAYMENT_URI = 'booking/pay/';

// define the POST request config
const rqc = {
    headers : {
        'Content-Type' : 'application/application/x-www-form-urlencoded',
    }
}
    
/**
 * Promise to return a payment intent client secret to use with the transaction
 * @param {String} URL BIQ API booking pay URL
 * @param {String} k BIQ API public affiliate key
 * @param {String} h Transaction handler name
 * @param {String} q The selected quote ID
 * @param {String} v The selected quote vehicle array index
 * @param {Boolean} d debugging flag
 * @returns {Promise}
 */
export const getClientSecretIntent = (URL, k, h, q, v, d) => {
    if(d) {
        console.group(`Getting client secret from ${URL}`);
    }
    return new Promise((rslv, rej) => {
        // need to have at least 1 POSTed input value to trigger the POST method
        const f = new FormData();
        f.append('handler', h);
        f.append('key', k);
        f.append('quote', q);
        f.append('vehicle', v);
        // get the quotes for the specified journey details
        axios.post(URL, f, rqc)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // resolve with the payment intent client secret token
        .then (data => rslv(data.response.intent.client_secret))
        .catch(e => {
            // get the error message
            console.log('Error', e);
            let m = e.message || 'Unknown';
            if(e.response) {
                m = e.response;
            } else if(e.request) {
                m = e.request;
            }
            // construct the base error object
            const err = hmmm(URL, k, e, `The error message received was: '${m}'`);
            // add the booking error event data
            err.data = {
                ...err.data,
                message : m,
                type : 'payment',
                handler : h,
                quote : q,
                vehicle : v,
                formData : f
            };
            // reject the failure for handling
            rej(err);
        });
    });
}

/**
 * Promise to return the result of the booking pay attempt
 * @param {String} URL BIQ API booking pay URL
 * @param {String} k BIQ API public affiliate key
 * @param {Object} f Payment form data object
 * @param {Boolean} d Debugging flag
 * @returns {Promise}
 */
 export const makeBooking = (URL, k, f, d) => {
    // add the affiliate key to the form postdata
    f.append('key', k);
    return new Promise((rslv, rej) => {
        // get the quotes for the specified journey details
        axios.post(URL, f, rqc)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // resolve with the response data payload
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

// create a default exportable object container
export const APIBookingCheckout = {
    POST_REQUEST_CONFIG : rqc,
    URI : {
        CLIENT_SECRET : CLIENT_SECRET_URI,
        PAYMENT : PAYMENT_URI
    },
    getClientSecretIntent,
    makeBooking
};
// export the default object container
export default APIBookingCheckout;

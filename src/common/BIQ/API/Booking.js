// import the BIQ API response handlers
import { apiResponseParse, hmmm } from '@BIQ/API';
// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';

// export the API Booking URIs
export const DETAILS_URI = 'booking/details/?secret=';

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API booking details URL
 * - k = BIQ API public affiliate key
 * - ref = the booking ref to get the details for
 * - d = debugging flag
 */
// promise to return the booking detils response
export const getDetails  = (URL, k, ref, d) => {
    const journeyDate = ds => new Date(Date.parse(ds));
    return new Promise((rslv, rej) => {
        // let the wordpress backend plugin get the booking details as the API 
        // call needs the private key as well
        axios.get(`${URL}${ref}&key=${k}`)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // extract the booking details from the response data
        .then (data => data.booking)
        // build the booking details data
        .then(b => {
            // construct a usable booking data object
            const booking = {
                ref,
                name : b.passenger.name,
                // make the passengers a number because it is
                passengers : Number.parseInt(b.people),
                pickup : b.pickup,
                destination : b.destination,
                vias : b.vias,
                date : journeyDate(b.date),
                return_date : null
            }
            if(b.return) {
            // the booking has a return journey leg
                booking.return_date = journeyDate(b.return);
            }
            rslv(booking)
        })
        .catch(e => {
            // get the error message
            const m = e.message || 'Unknown';
            // construct the base error object
            const err = hmmm(URL, k, e, `BIQ API Booking Details Load Error - ${m}`);
            // add the booking error event data
            err.data.bookingRef = ref;
            // reject the failure for handling
            rej(err);
        });
    });

};

// create a default exportable object container
export const APIBooking = {
    URI : {
        DETAILS : DETAILS_URI
    },
    getDetails
};
// export the default object container
export default APIBooking;

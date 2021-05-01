// import the BIQ API response handlers
import { apiGet, rejected } from '@BIQ/API';

// export the API Booking URIs
export const DETAILS_URI = 'booking/details/?secret=';

/**
 * Promise to return the booking detils response
 * @param {String} URL The BIQ API booking details URL
 * @param {String} k The BIQ API public affiliate key
 * @param {String} ref The booking ref to get the details for
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The booking details or rejected APIError
 */
 export const getDetails  = (URL, k, ref, d) => {
     // define the method to convert the date string
    const journeyDate = ds => new Date(Date.parse(ds));
    return new Promise((rslv, rej) => {
        // let the wordpress backend plugin get the booking details as the API 
        // call needs the private key as well
        apiGet(`${URL}${ref}`, k, d)
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
            };
            if(b.return) {
            // the booking has a return journey leg
                booking.return_date = journeyDate(b.return);
            }
            return rslv(booking);
        })
        .catch(e => {
            return rejected(rej, e, 'BIQ API Booking Details Load Error', d);
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

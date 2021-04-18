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

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API places lookup URL base
 * - k = BIQ API public affiliate key
 * - t = place search term
 * - sort = sort map function callback
 * - d = debugging flag
 */
// promise to do the place lookup
export const placesLookup = (URL, k, t, sort, d) => {
    return new Promise((rslv, rej) => {
        // do the place lookup
        axios.get(`${URL}${t}&key=${k}`)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // extract the places results from the response data
        .then (d => d.results)
        // build the places look up options list
        .then(r => {
            let airports = [];
            let stations = [];
            let locations = [];
            // check for airport locations
            if(typeof(r.AIRPORT) != 'undefined') {
                airports = r.AIRPORT.map(name => sort(name, 'airport'));
            }
            // check for train station locations
            if(typeof(r.STATION) != 'undefined') {
                stations = r.STATION.map(name => sort(name, 'station'));
            }
            // check for POI locations
            if(typeof(r.LOCATION) != 'undefined') {
                locations = r.LOCATION.map(name => sort(name, 'location'));
            }
            const google = r.GOOGLE.map(data => sort(data.string, (data.poi) ? 'poi' : 'general'));
            // resolve the places lookup location options list in order of precidence
            rslv(airports.concat(stations, locations, google));
        })
        .catch(e => {
            // get the error message
            const m = e.message || 'Unknown';
            // reject the failure for handling
            rej(hmmm(URL, k, e, `BIQ Places lookup API Error - ${m}`));
        });
    });
};

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API quotes URL base
 * - k = BIQ API public affiliate key
 * - j = the journey search details
 * - d = debugging flag
 */
// promise to do the quotes search
export const searchQuotes = (URL, k, j, d) => {
    // start constructing the search details
    let URI = `pickup=${j.pickup}&destination=${j.destination}&date=${j.date} ${j.time}&people=${j.people}`;
    if(j.hasReturn) {
    // add the journey return date & time details
        URI = `${URI}&return=${j.returning.date} ${j.returning.time}`;
    }
    if(j.vias.length) {
    // add the optional journey via location(s)
        // @todo make this support the full capability of multiple vias
        // vias is expected as a list but only 1 via is available
        URI = `${URI}&via=${j.vias[0]}`;
    }
    return new Promise((rslv, rej) => {
        // get the quotes for the specified journey details
        axios.get(`${URL}?key=${k}&${URI}`)
        // parse the api response for status OK
        .then(r => apiResponseParse(URL, k, r, d))
        // extract the journey quotes details from the response data
        .then (d => {
            // create the response data for the API Quote journey details and the API Quote results
            const r = {
                journey_id : d.journey_id, 
                journey : d.journey, 
                quotes : d.quotes,
                count : Object.keys(d.quotes).length
            };
            if(!r.count) {
            // zero quotes returned
                // add the warning reasons
                r.warnings = d.warnings;
            }
            // resolve with the journey & the quotes
            rslv(r);
        })
        .catch(e => {
            // get the error message
            const m = e.message || 'Unknown';
            // reject the failure for handling
            rej(hmmm(URL, k, e, `BIQ Quotes Search API Error - ${m}`));
        });
    });
};

/**
 * Variable name replacement to help reduce production size
 * 
 * - URL = BIQ API quotes URL base
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
        .then (d => rslv(d))
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

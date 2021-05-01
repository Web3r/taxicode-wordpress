// import the BIQ API response handlers
import { apiGet, rejected } from '@BIQ/API';

// export the API Quote URIs
export const PLACES_URI = 'places/?term=';
export const QUOTE_URI = 'booking/quote/';
export const JOURNEY_URI = 'booking/journey/?id=';

/**
 * Promise to do the place lookup
 * @param {String} URL The BIQ Places Lookup API URL
 * @param {String} k The BIQ API public affiliate key
 * @param {String} t The places search term
 * @param {Function} sort A sort map function callback
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The sorted list of autocomplete places or rejected APIError
 */
export const placesLookup = (URL, k, t, sort, d) => {
    return new Promise((rslv, rej) => {
        // do the places lookup
        apiGet(`${URL}${t}`, k, d)
        // extract the places results from the response data
        .then (data => data.results)
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
            const google = r.GOOGLE.map(l => sort(l.string, (l.poi) ? 'poi' : 'general'));
            // resolve the places lookup location options list in order of precidence
            return rslv(airports.concat(stations, locations, google));
        })
        .catch(e => {
            return rejected(rej, e, 'BIQ Places Lookup API Error', d);
        });
    });
};

/**
 * Promise to do the quotes search
 * @param {String} URL The BIQ API quotes URL 
 * @param {String} k The BIQ API public affiliate key
 * @param {Object} j The journey search details
 * @param {Boolean} d A debugging flag
 * @returns {Promise} The journey details and quotes or rejected APIError
 */
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
        apiGet(`${URL}?${URI}`, k, d)
        // extract the journey quotes details from the response data
        .then (data => {
            // create the response data for the API Quote journey details and the API Quote results
            const r = {
                journey_id : data.journey_id, 
                journey : data.journey, 
                quotes : data.quotes,
                count : Object.keys(data.quotes).length
            };
            if(!r.count) {
            // zero quotes returned
                // add the warning reasons
                r.warnings = data.warnings;
            }
            // resolve with the journey & the quotes
            return rslv(r);
        })
        .catch(e => {
            return rejected(rej, e, 'BIQ Quotes Search API Error', d);
        });
    });
};

// create a default exportable object container
export const APIQuote = {
    URI : {
        PLACES : PLACES_URI,
        QUOTE : QUOTE_URI,
        JOURNEY : JOURNEY_URI
    },
    placesLookup,
    searchQuotes
};
// export the default object container
export default APIQuote;

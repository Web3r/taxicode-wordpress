// import the BIQ API response handlers
import { apiResponseParse, hmmm } from '@BIQ/API';
// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';

// export the API Quote URIs
export const PLACES_URI = 'places/?term=';
export const QUOTE_URI = 'booking/quote/';
export const JOURNEY_URI = 'booking/journey/?id=';

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

// import the date time library
import moment from 'moment';

// define the lat/lng for certain places
export const geoCoords = {
    london : [ 51.509865, -0.118092 ],
    lhr : [ 51.470020, -0.454295 ],
    toCoords : (a) => {
        return {
            lat : a[0],
            lng : a[1]
        }
    }
};

// define an empty journey location structured object
export const emptyLocation = {
    string : '',
    postcode : '',
    position : [ 0, 0 ]
};
// define the empty structure of the journey details to use
export const emptyJourneyDetails = {
    pickup : emptyLocation,
    destination : emptyLocation,
    vias : [ ],
    people : 1,
    return : false,
    date : '',
    distance : 1,
    duration : 116,
    duration_text : '1 min',
    quote_type : 'mileage',
    is_airport : false,
    hourly : false
};
// define default labels for the journey details
// @todo add the missing journey details labels
export const journeyDetailsLabels = {
    pickup : 'Pickup : ',
    destination : 'Destination : ',
    via : 'Via : ',
    passengers : 'Passengers : ',
    date : 'Date : ',
    return_date : 'Returning : ',
};

// define a function to create a journey details object from an expected API journey data set
export const journeyDetails = j => {
    return {
        pickup : j.pickup,
        destination : j.destination,
        vias : j.vias,
        people : j.people,
        return : j.return,
        date : j.date,
        distance : j.distance,
        duration : j.duration,
        duration_text : j.duration_text,
        quote_type : j.quote_type,
        is_airport : j.is_airport,
        hourly : j.hourly
    }
}

// define the date & time string functions
export const toDateString = d => (d !== null) ? d.toDateString() : '';
export const toLocaleTimeString = d => (d !== null) ? d.toLocaleTimeString() : '';
// @todo update the rest of the BIQ stuff to use the moment library for the date time functionality base
export const readableDate = (d) => moment(String(d)).format('ll');
export const readableTime = (d) => moment(String(d)).format('h:mma');
// define methods to return string versions of date time sections for display
export const journeyDate = ds => new Date(Date.parse(ds));
export const journeyDateString = ds => toDateString(journeyDate(ds));
export const journeyTimeString = ds => toLocaleTimeString(journeyDate(ds));
// method to format the price for display
export const journeyDisplayPrice = (p) => '&pound;' + new Number(p).toFixed(2);


// create a default exportable object container
const Journey = {
    geoCoords,
    emptyLocation,
    emptyJourneyDetails,
    journeyDetailsLabels,
    journeyDetails,
    toDateString,
    toLocaleTimeString,
    readableDate,
    readableTime,
    journeyDate,
    journeyDateString,
    journeyTimeString,
};
// export the default object container
export default Journey;

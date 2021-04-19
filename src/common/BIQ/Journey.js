// define an empty journey location structured object
export const emptyLocation = {
    string : '',
    postcode : '',
    position : [0,0]
};
// define the empty structure of the journey details to use
export const emptyJourneyDetails = {
    pickup : emptyLocation,
    destination : emptyLocation,
    vias : [],
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
// define methods to return string versions of date time sections for display
export const journeyDate = ds => new Date(Date.parse(ds));
export const journeyDateString = ds => toDateString(journeyDate(ds));
export const journeyTimeString = ds => toLocaleTimeString(journeyDate(ds));

// create a default exportable object container
const Journey = {
    emptyLocation,
    emptyJourneyDetails,
    journeyDetailsLabels,
    journeyDetails,
    toDateString,
    toLocaleTimeString,
    journeyDate,
    journeyDateString,
    journeyTimeString,
};
// export the default object container
export default Journey;

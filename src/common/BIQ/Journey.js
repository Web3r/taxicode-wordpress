
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

// define a function to create a journey details object from an expected API journey data set
export const journeyDetails = journey => {
    return {
        pickup : journey.pickup,
        destination : journey.destination,
        vias : journey.vias,
        people : journey.people,
        return : journey.return,
        date : journey.date,
        distance : journey.distance,
        duration : journey.duration,
        duration_text : journey.duration_text,
        quote_type : journey.quote_type,
        is_airport : journey.is_airport,
        hourly : journey.hourly
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
    journeyDetails,
    toDateString,
    toLocaleTimeString,
    journeyDate,
    journeyDateString,
    journeyTimeString,
};
// export the default object container
export default Journey;

// import the methods to format the quote data for display
import { formatQuotes, reduceToTypeAndClass } from '@/common/BIQ/QuotesFormatter';
// import the sort by price sort type 
import { SORT_TYPE_PRICE } from '@/common/BIQ/QuotesSorter';

// define the default sort order type for the quotes results
export const DEFAULT_SORT = SORT_TYPE_PRICE;

// define the list of Quotes Searched events components can emit & be listened for
export const quotesSearchedEvents = {
    // when the BIQ API quotes have been searched & a response returned
    biqQuotesSearched : {
        name : 'biqQuotesSearched'
    },
    // when the BIQ API quotes have been searched & a response returned with no quotes available
    biqZeroQuotes : {
        name : 'biqZeroQuotes'
    },
    // when there is an error with the BIQ API quotes search
    biqQuotesError : {
        name : 'biqQuotesError'
    }
};
// define the list of Quote Booking events components can emit & be listened for
export const quoteBookingEvents = {
    // when the quote "Book Now" button is clicked
    biqQuoteBookNow : {
        name : 'biqQuoteBookNow'
    }
};

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

// decide how to format the quotes for display purpose
export const displayQuotes = (quotes, type, sort) => {
    return {
        type,
        // determine the quotes to display from the quote results based on the setting type
        quotes : (type == 'type_class')
            ? reduceToTypeAndClass(quotes, SORT_TYPE_PRICE) 
            : formatQuotes(quotes, type, sort)
        };
    };

// define the default initial state structure & values
export const defaultState = () => {
    return {
        quoting : false,
        quotes_loaded : false,
        api_error : false,
        journey_id : '',
        journey_details : journeyDetails(emptyJourneyDetails),
        journey_quotes : {}
    };
};

// create a default exportable object container
const QuotesSearched = {
    quotesSearchedEvents,
    quoteBookingEvents,
    emptyLocation,
    emptyJourneyDetails,
    journeyDetails,
    displayQuotes,
    defaultState
};
// export the default object container
export default QuotesSearched;

// import the methods to format the quote data for display
import { formatQuotes, reduceToTypeAndClass } from '@BIQ/Quotes/Formatter';
// import the sort by price sort type 
import { SORT_TYPE_PRICE } from '@BIQ/Quotes/Sorter';
// import the methods to display the journey date & times
import { emptyJourneyDetails, journeyDetails } from '@BIQ/Journey';

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
    displayQuotes,
    defaultState
};
// export the default object container
export default QuotesSearched;

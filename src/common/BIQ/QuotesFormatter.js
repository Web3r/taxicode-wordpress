import { sortQuotes } from './QuotesSorter';

const debugging = true;

// define the quote results default display sort order
export const DEFAULT_SORT = 'SORT_BY_PRICE';

// define the function to format the quote data for display
export const formatQuotes = (quotes, type, sort_by) => {
    const display = [];
    if(debugging) {
        console.group("Formatting BIQ Quotes");
    }
    Object.keys(quotes).forEach(key => {
        const quote = {
            ...quotes[key],
            quote_id : key,
            selected_vehicle : 0
        };
        // if the quote disply type is not filtering for best or the quote is highlighted as best
        if(type!='best' || (type=='best' && quote.highlight)) {
            // add the quote to the display list
            display.push(quote);
        }
    });
    if(debugging) {
        console.log({...quotes});
        console.log(type);
        console.log(sort_by);
        console.groupEnd();
    }
    return display;
};

// define the callback to reduce the quotes to type & class option only
export const reduceToTypeAndClass = quotes => {
    if(debugging) {
        console.group("Reducing BIQ Quotes to type & class only");
    }
    // sorting taking from app, but needs further reconstructing for web UI
    const sorted_quotes = formatQuotesReduced(quotes);
    if(debugging) {
        console.log({...sorted_quotes});
    }
    const sorted = sorted_quotes.sorted;
    const display = {};
    if(sorted.hasOwnProperty('recommended') && sorted.recommended.length) {
        display['cheapest'] = sorted.recommended[0];
    }
    if(sorted.hasOwnProperty('executive') && sorted.executive.length) {
        display['exec'] = sorted.executive[0];
    }
    if(sorted.hasOwnProperty('vip') && sorted.vip.length) {
        display['luxury'] = sorted.vip[0];
    }
    if(sorted.hasOwnProperty('chauffeur') && sorted.chauffeur.length) {
        display['chauffeur'] = sorted.chauffeur[0];
    }
    if(debugging) {
        console.log(display);
        console.groupEnd();
    }
    return display;
};

// define the function to format the quote data for display
export const formatQuotesReduced = quotes => {
    // initiate quotes keys
    let raw = {};
    let sorted = {};

    for(let key in quotes) {
        // get the current object based on key
        let temp = quotes[key];

        // skip the non active quotes
        if(temp.active) {
            // put it on the raw list first
            raw[key] = temp;

            // add quote id to temp in order to use it as unique key in Flat Lists
            temp['quote_id'] = key;

            // loop through quote's vehicles
            for(let i = 0; i < temp['vehicles'].length; i++) {

                // get a copy of temp so we don't affect temp object
                let temp_copy = { ...temp };
                // save vehicle index
                temp_copy['selected_vehicle'] = i;

                // get vehicle details
                temp_copy['vehicle'] = temp['vehicles'][i];

                temp_copy['vehicle']['index'] = temp_copy['selected_vehicle'];

                // set price to vehicle price
                temp_copy['price'] = temp_copy['vehicle']['price'];

                // get vehicle class
                let vehicle_class = temp_copy['vehicle']['type']['class'];

                // remove vehicles array because we already have the vehicle details now
                delete temp_copy['vehicles'];

                // if recommended key is not present, set it
                if(!sorted.hasOwnProperty('recommended')) {
                    sorted['recommended'] = []
                }

                // check if quote has a highlight
                if(!!temp_copy.highlight) {
                    // only add it to recommended if it's the first vehicle of quote
                    if(i === 0) {
                        sorted['recommended'].push(temp_copy);
                    } else {
                        temp_copy['highlight'] = false;
                    }
                }

                // if all key is not present, set it
                if(!sorted.hasOwnProperty('all')) {
                    sorted['all'] = [];
                }

                // append the temp to all
                sorted['all'].push(temp_copy);

                // if vehicle class is not a key of the sorted array, make it one
                if(!sorted.hasOwnProperty(vehicle_class)) {
                    sorted[vehicle_class] = [];
                }

                // append the temp to its relevant class
                sorted[vehicle_class].push(temp_copy);

            }
        }
    }

    for(let type in sorted) {
        sorted[type] = sortQuotes(sorted[type], DEFAULT_SORT);
    }
    return { raw, sorted };
};

const QuotesFormatter = {
    formatQuotes,
    reduceToTypeAndClass,
    formatQuotesReduced,
    sortQuotes
};

export default QuotesFormatter;

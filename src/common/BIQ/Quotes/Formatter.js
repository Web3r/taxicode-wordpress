// import the method to sort the quotes according to order types
import { sort } from '@/common/BIQ/Quotes/Sorter';

const debugging = true;

/**
 * Variable name replacement to help reduce production size
 * 
 * - q = quotes
 * - t = format type (best requires quote highlight)
 * - so = sort order type 
 */
// define the function to format the quote data for display
export const formatQuotes = (q, t, so) => {
    const d = [];
    if(debugging) {
        console.group("Formatting BIQ Quotes");
        console.log('Quotes', { ...q });
        console.log('Type', t);
        console.log('Sort Order', so);
    }
    // loop the quotes to create a quotes display list
    Object.keys(q).forEach(k => {
        const quote = {
            ...q[k],
            quote_id : k,
            selected_vehicle : 0
        };
        // if the quote disply type is not filtering for best or the quote is highlighted as best
        if(t != 'best' || (t == 'best' && quote.highlight)) {
            // add the quote to the display list
            d.push(quote);
        }
    });
    // define the sorted quotes display list
    const sd = sort(d, so);
    if(debugging) {
        console.log('Sorted', sd);
        console.groupEnd();
    }
    return sd;
};

/**
 * Variable name replacement to help reduce production size
 * 
 * - q = quotes
 * - so = sort order type 
 */
// define the callback to reduce the quotes to type & class option only
export const reduceToTypeAndClass = (q, so) => {
    if(debugging) {
        console.group("Reducing BIQ Quotes to type & class only");
        console.log('Quotes', { ...q });
        console.log('Sort Order', so);
    }
    // sorting taking from app, but needs further reconstructing for web UI
    const sq = formatQuotesReduced(q, so);
    if(debugging) {
        console.log({ ...sq });
    }
    const s = sq.sorted;
    // define the sorted quotes display list
    const sd = { };
    if(s.hasOwnProperty('recommended') && s.recommended.length) {
        sd['cheapest'] = s.recommended[0];
    }
    if(s.hasOwnProperty('executive') && s.executive.length) {
        sd['exec'] = s.executive[0];
    }
    if(s.hasOwnProperty('vip') && s.vip.length) {
        sd['luxury'] = s.vip[0];
    }
    if(s.hasOwnProperty('chauffeur') && s.chauffeur.length) {
        sd['chauffeur'] = s.chauffeur[0];
    }
    if(debugging) {
        console.log('Sorted', sd);
        console.groupEnd();
    }
    return sd;
};

// define the function to format the quote data for display
export const formatQuotesReduced = (q, so) => {
    // initiate quotes keys
    let raw = { };
    let sorted = { };

    for(let key in q) {
        // get the current object based on key
        let temp = q[key];

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

    for(let t in sorted) {
        sorted[t] = sort(sorted[t], so);
    }
    return { raw, sorted };
};

// create a default exportable object container
const QuotesFormatter = {
    formatQuotes,
    reduceToTypeAndClass,
    formatQuotesReduced,
    sortQuotes : sort
};
// export the default object container
export default QuotesFormatter;

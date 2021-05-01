// define the sort type constants
export const SORT_TYPE_PRICE = 'SORT_BY_PRICE';
export const SORT_TYPE_RATING = 'SORT_BY_RATING';

// define the quotes sorting callbacks
// price sort is ascending
const sortByPrice = (a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
// rating sort is descending
const sortByRating = (a, b) => (a.rating.score > b.rating.score) ? -1 : ((b.rating.score > a.rating.score) ? 1 : 0);

/**
 * Variable name replacement to help reduce production size
 * 
 * - q = quotes
 * - t = sort field type
 */
// define the quotes sort callback
export const sort = (q, t) => {
    switch(t) {
        case SORT_TYPE_PRICE :
            return q.sort(sortByPrice);
        case SORT_TYPE_RATING :
            return q.sort(sortByRating);
        default :
            return q;
    }
};

// create a default exportable object container
const QuotesSorter = {
    SORT_TYPE_PRICE,
    SORT_TYPE_RATING,
    sortByPrice,
    sortByRating,
    sort
};
// export the default object container
export default QuotesSorter;

// define the quotes sorting callbacks
// price sort is ascending
const sortByPrice = (a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
// rating sort is descending
const sortByRating = (a,b) => (a.rating.score > b.rating.score) ? -1 : ((b.rating.score > a.rating.score) ? 1 : 0);

// define the quotes sort callback
export const sortQuotes = (quotes, field) => {
    switch(field) {
        case 'SORT_BY_PRICE' :
            return quotes.sort(sortByPrice);
        case 'SORT_BY_RATING' :
            return quotes.sort(sortByRating);
        default :
            return quotes;
    }
};

const QuotesSorter = {
    sortByPrice,
    sortByRating,
    sortQuotes
};

export default QuotesSorter;

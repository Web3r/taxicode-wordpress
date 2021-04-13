// import the journey quotes searched booking events
import { quoteBookingEvents } from '@/common/BIQ/QuotesSearched';
// import the Book Now Call To Action button
import BookNowC2A from 'BIQ/QuoteCards/BookNowC2A.vue';

// define the BIQ Quote Card component properties
export const quoteCardProps = {
    journeyID : {
        type : String,
        required : true,
        default : ''
    },

    quote : {
        type : Object,
        required : true,
        // @todo add a validator to make sure that a quote structure is supplied
        default : function() { 
            return null;
        }
    },

    c2aLabel : {
        type : String,
        default : 'Book Now'
    },

    debugging : {
        type : Boolean,
        default : false
    }
};
// define the list of events the BIQ Quote Card component emits & can be listened for
export const quoteCardEvents = {
    ...quoteBookingEvents
};

// define the common stuff for the BIQ Quote Card
export const biqQuoteCardMixin = {
    components : {
        'biq-book-now-c2a' : BookNowC2A
    },

    props : {
        ...quoteCardProps
    },

    data() {
        return {
            selected_vehicle : this.quote.selected_vehicle,
            quote_price : this.quote.price,
            display_vehicle_src : ''
        };
    },

    computed : {
        displayPrice : function() {
            return '&pound;' + new Number(this.quote_price).toFixed(2);
        }
    },

    methods : {
        onClick : function(evt) {
            // bubble the call to action click event
            this.$emit(quoteCardEvents.biqQuoteBookNow.name, evt);
        },
    }
};
// export the default object container
export default biqQuoteCardMixin;

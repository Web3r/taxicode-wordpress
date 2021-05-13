// import the journey quotes searched booking events
import { quoteBookingEvents } from '@/common/BIQ/Quotes/Searched';
// import the Book Now Call To Action button
import BookNowC2A from 'BIQ/QuoteCards/BookNowC2A.vue';
// import the date & time string functions for display
import { journeyDisplayPrice } from '@BIQ/Journey';

// define the BIQ Quote Card component Mixin properties
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
// define the BIQ Quote Card component computed property Mixin methods
const computed = {
    displayPrice : function() {
        return journeyDisplayPrice(this.quote_price);
    }
};
// define the BIQ Quote Card component Mixin methods
const methods = {
    onClick : function(evt) {
        // bubble the call to action click event
        this.$emit(quoteCardEvents.biqQuoteBookNow.name, evt);
    }
};

// define the BIQ Quote Card Mixin for components to include & inherit from
export const biqQuoteCardMixin = {
    props : quoteCardProps,
    computed,
    methods,

    components : {
        'biq-book-now-c2a' : BookNowC2A
    },

    // use the following to extract the mixin data inside the component 
    // data method as it destroys this object
    // const mixinData = QuoteCardMixin.data.call(this);
    data() {
        return {
            selected_vehicle : this.quote.selected_vehicle,
            quote_price : this.quote.price,
            display_vehicle_src : ''
        };
    }
};
// export the BIQ Quote Card Mixin as the default object
export default biqQuoteCardMixin;

// define the payment type options
export const PAYMENT_TYPE_CARD = 'Pay with Card';
export const PAYMENT_TYPE_PAYPAL = 'Pay with Paypal';
// define the available payment type options
export const PAYMENT_TYPE_OPTIONS = [
    PAYMENT_TYPE_CARD, 
    PAYMENT_TYPE_PAYPAL
];
// set the default selected payment type option to CARD
export const PAYMENT_TYPE_DEFAULT_OPTION = PAYMENT_TYPE_CARD;

/**
 * Generate the list of field name = data form field structure for quote checkout form
 * (does not include form section component fields)
 * @param {String} idp A string to prefix the fields ID attribute with
 * @returns Object
 */
 export const fF = idp => {
    return {
        method : {
            selected : PAYMENT_TYPE_DEFAULT_OPTION,
            options : PAYMENT_TYPE_OPTIONS,
            label : 'Select Payment Method:',
            errorMsg : 'Invalid Payment Method',
            id : `${idp}-method`
        }
    };
};

// define the list of events the component emits & can be listened for on the payment form
export const paymentEvents = {
    // when the BIQ payment form is submitted
    submit : {
        name : 'submit'
    },
    // when the transaction has succeded
    transactionSuccess : {
        name : 'transactionSuccess'
    },
    // when the transaction fails for any reason
    transactionError : {
        name : 'transactionError'
    }
};
// define the list of events the component emits & can be listened for on the checkout form
export const checkoutEvents = {
    // when the BIQ Checkout form is submitted
    biqCheckoutSubmit : {
        name : 'biqCheckoutSubmit'
    },
    // when the BIQ Checkout process completes successfully & the booking is made
    biqCheckoutComplete : {
        name : 'biqCheckoutComplete'
    },
    // when the BIQ Checkout process fails (transaction error or BIQ API Booking error)
    biqCheckoutError : {
        name : 'biqCheckoutError'
    }
};

// define the default initial state structure & values
export const defaultState = () => {
    return {
        processing : false,
        processed : false,
        basket : {
            quote_id : '',
            vehicle_index : 0,
            amount : 0,
        },
        quote : {},
        vehicle : {},
        booking_ref : ''
    };
};

// create a default exportable object container
const QuoteCheckout = {
    PAYMENT_TYPE_OPTIONS,
    PAYMENT_TYPE_DEFAULT_OPTION,
    fF,
    paymentEvents,
    checkoutEvents,
    defaultState
};
// export the default object container
export default QuoteCheckout;

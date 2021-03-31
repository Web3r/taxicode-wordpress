// define the list of events the component emits & can be listened for on the payment form
export const emitEvents = {
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

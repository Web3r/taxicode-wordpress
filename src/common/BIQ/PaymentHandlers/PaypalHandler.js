import BasePaymentHandler from './BasePaymentHandler';

export default class PaypalHandler extends BasePaymentHandler {
        
    /**
     * Create a new Stripe card form elements
     * @param {function} transactionSuccessCB A transaction success callback handler
     * @param {function} transactionFailCB A transaction failed callback handler
	 * @param {Boolean} debugging flag to indicate if debugging is enabled
     * @returns {PaypalHandler}
     */
    constructor(transactionSuccessCB, transactionFailCB, debugging) {
        super(transactionSuccessCB, transactionFailCB, debugging);
        // because of safai we can't have nice things & have to bind these anyway
        // override the handle method to actually impliment the transaction handling
        this.handle = this.handle.bind(this);
        // override / set the payment handler specific name
        this.paymentHandlerName = 'paypal';
    }
    
    /**
     * Handle the actual transaction
     * @param {Function} publicHandler Method to get the public facing payment handler interface
     * @param {Function} onTransactionSuccess Method to call when the transaction succeeds
     * @param {Function} onTransactionFail Method to call when the transaction fails
     * @param {Object} setup Additional setup / options for the payment handler 
     */
    handle(publicHandler, onTransactionSuccess, onTransactionFail, setup) {
        // @todo this is where the manual initiation & transaction 
        // response event handling & dispatching should go, but we're just
        // using the handler for frameworked flow consitency for now.
        const {
            key, 
            quote, 
            vehicle,
            // @todo for now use the already suceeded papypal event supplied as is.
            nonce
        } = setup;
        if(this.debugging) {
            console.group('Paypal payment transaction handler');
            console.log(setup);
            console.log(key);
            console.log(quote);
            console.log(vehicle);
            console.log(nonce);
            console.groupEnd();
        }
        // @todo for now just call the on success callback
        const paymentIntent = {
            // set the paypal transaction token ID
            id : nonce
        };
        onTransactionSuccess(publicHandler(), paymentIntent);
    }
}

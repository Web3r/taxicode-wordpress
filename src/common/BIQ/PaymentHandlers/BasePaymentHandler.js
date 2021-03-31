export default class BasePaymentHandler {
        
    /**
     * Form the base for transaction payment handlers
     * @param {function} transactionSuccessCB A transaction success callback handler
     * @param {function} transactionFailCB A transaction failed callback handler
	 * @param {Boolean} debugging flag to indicate if debugging is enabled
     * @returns {BasePaymentHandler}
     */
    constructor(transactionSuccessCB, transactionFailCB, debugging) {
        // because of safai we can't have nice things & have to bind these anyway
        this.getPublicHandler = this.getPublicHandler.bind(this);
        this.getHandlerName = this.getHandlerName.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.getDescriptor = this.getDescriptor.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.getTransactionToken = this.getTransactionToken.bind(this);
        this.handle = this.handle.bind(this);
        // set the immutable properties
        this.country = 'GB';
        this.currency = 'gbp';
        // set the callback functions to allow for adaption 
        this.transactionSuccessCB = transactionSuccessCB;
        this.transactionFailCB = transactionFailCB;
        this.debugging = debugging;
        // set the initial state of mutatable properties
        this.amount = 0;
        this.descriptor = '';
        // this property should be overriden in the extention
        // set the payment handler specific name
        this.paymentHandlerName = 'unknown';
    }

    /**
     * Get the exposable public handler interface
     * @returns {Object}
     */
     getPublicHandler() {
        return {
            getHandlerName : this.getHandlerName,
            getAmount : this.getAmount,
            getDescriptor : this.getDescriptor,
            updateAmount : this.updateAmount,
            getTransactionToken : this.getTransactionToken
        };
    }
    
    /**
     * Get the payment option name
     * @returns {String}
     */
    getHandlerName() {
        return this.paymentHandlerName;
    }
   
    /**
     * Get the transaction amount set
     * @returns {Float}
     */
    getAmount() {
        return this.amount;
    }
    
    /**
     * Get the transaction descriptor set
     * @returns {String}
     */
    getDescriptor() {
        return this.descriptor;
    }
    
    /**
     * Set the transaction details
     * @param {Float} amount the transaction amount
     * @param {String} descriptor the transaction descriptor
     */
    setAmount(amount, descriptor) {
        // set the transaction details
        this.amount = (amount * 100);
        this.descriptor = descriptor;
    }
    
    /**
     * Update the transaction amount
     * @param {Float} amount the transaction amount
     */
    updateAmount(amount) {
        this.amount = (amount * 100);
    }
    
    /**
     * Get the payment token for the transaction
     * @param {String} key The BIQ API key being used
     * @param {String} quote The selected quote ID
     * @param {String} vehicle The selected quote vehicle array index
     * @param {Object} setup Additional setup / options for the payment handler 
     */
    getTransactionToken(key, quote, vehicle, setup) {
        this.handle(
            this.getPublicHandler,
            this.transactionSuccessCB,
            this.transactionFailCB,
            {
                ...setup,
                key, 
                quote, 
                vehicle
            }
        );
    }
    
    /**
     * Handle the actual transaction
     * @param {Function} publicHandler Method to get the public facing payment handler interface
     * @param {Function} onTransactionSuccess Method to call when the transaction succeeds
     * @param {Function} onTransactionFail Method to call when the transaction fails
     * @param {Object} setup Additional setup / options for the payment handler 
     */
     handle(publicHandler, onTransactionSuccess, onTransactionFail, setup) {
        onTransactionFail(publicHandler(), 'No payment handler to handle the transaction');
    }
}

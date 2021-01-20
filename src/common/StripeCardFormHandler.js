export default class StripeCardFormHandler {
        
    /**
     * Create a new Stripe card form elements
     * @param {string} public_key the stripe public key
     * @param {function} transactionSuccessCB A transaction success callback handler
     * @param {function} transactionFailCB A transaction failed callback handler
     * @param {string} client_secret_from_uri the URI to create the payment intent to get the client secret from
     * @returns {StripeCardFormHandler}
     */
    constructor(public_key, transactionSuccessCB, transactionFailCB, client_secret_from_uri) {
        // because of safai we can't have nice things & have to bind these anyway
        this.setAmount = this.setAmount.bind(this);
        this.getHandlerName = this.getHandlerName.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.initialise = this.initialise.bind(this);
        this.getSourceCardToken = this.getSourceCardToken.bind(this);
        this.getClientSecretIntent = this.getClientSecretIntent.bind(this);
        this.getCustomerToken = this.getCustomerToken.bind(this);
        this.setCustomerToken = this.setCustomerToken.bind(this);
        this.paymentHandlerName = 'jstoken_stripe';
        this.country = 'GB';
        this.currency = 'gbp';
        // set the initial state
        this.amount = 0;
        this.description = '';
        // set the gateway public key
        this.pk = public_key;
        // set the callback functions to allow for adaption 
        this.transactionSuccessCB = transactionSuccessCB;
        this.transactionFailCB = transactionFailCB;
        // set some default values
        this.customer_token = null;
        // set the URI to create the payment intent to get the client secret from
        this.intent_secret_uri = client_secret_from_uri;
       // set the stripe library resources
        this.stripe = Stripe(this.pk);
        this.stripeElements = this.stripe.elements();
        this.elementCreated = false;
        this.elementMounted = false;
        this.elementMountedOn = 'card';
        // define a privae version of the handler methods
        this.handler = {
            transactionSuccess      : this.transactionSuccessCB,
            transactionFail         : this.transactionFailCB,
            getClientSecretIntent   : this.getClientSecretIntent,
            stripe                  : this.stripe,
            stripeElements          : this.stripeElements
        };
        // define the public access handler methods
        this.publicHandler = {
            getHandlerName      : this.getHandlerName,
            getAmount           : this.getAmount,
            getDescription      : this.getDescription,
            updateAmount        : this.updateAmount,
            getCustomerToken    : this.getCustomerToken,
            setCustomerToken    : this.setCustomerToken
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
     * Get the transaction description set
     * @returns {String}
     */
    getDescription() {
        return this.description;
    }
    
    /**
     * Set the transaction details
     * @param {Float} amount the transaction amount
     * @param {String} description the transaction description
     */
    setAmount(amount, description) {
        // set the transaction details
        this.amount = (amount * 100);
        this.description = description;
    }
    
    /**
     * Update the transaction amount
     * @param {Float} amount the transaction amount
     */
    updateAmount(amount) {
        this.amount = (amount * 100);
    }
    
    /**
     * Get the stripe customer token in use
     * @returns {String}
     */
    getCustomerToken() {
        return this.customer_token;
    }
    
    /**
     * Set the Stripe customer token to use
     * @param {String} customer_token The Stripe customer token
     * @returns {String}
     */
    setCustomerToken(customer_token) {
        this.customer_token = customer_token;
    }
    
    /**
     * Promise to return a payment intent client secret to use with the wallet transaction
     * @param {String} key The API key being used
     * @param {String} quote The selected quote ID
     * @param {String} vehicle The selected quote vehicle array index
     * @returns {Promise}
     */
    getClientSecretIntent(key, quote, vehicle) {
        const amount = this.getAmount();
        const handler = this.getHandlerName();
        const customer_token = this.getCustomerToken();
        const intent_secret_uri = this.intent_secret_uri;
        return new Promise(function(resolve, reject) {
			// need to have at least 1 POSTed input value to trigger the POST method
			const post_data = {
                key,
                quote,
                vehicle,
                handler
			};
            // make the request to create a payment intent for the transaction
			$.ajax({
				type        : "POST",
				url         : intent_secret_uri,
				data        : post_data,
				dataType    : "json",
				success     : function(response) {
                    // resolve the client secret as promised
					resolve(response.client_secret);
				},
				error       : function(jqXHR, textStatus, errorThrown) {
                    console.group('Failed to get a client secret response from `${intent_secret_uri}`.');
                    console.warn(`The error message received was: '${textStatus}'`);
                    console.info(post_data);
                    let error;
                    try {
                        // get the error response reason
					    const response = JSON.parse(jqXHR.responseText);
                        error = response.error;
                        console.log(response);
                    } catch(e) {
                    // log the error in the error response
                        error = e
                    }
                    console.groupEnd();
					// reject the response as an error
					reject(error);
				}
			});
		});
    }
    
    /**
     * Get the card payment token for the transaction
     * @param {String} key The API key being used
     * @param {String} quote The selected quote ID
     * @param {String} vehicle The selected quote vehicle array index
     * @param {String} cardholder_name The cardholder name
     * @param {String} billing_postcode The card billing address post code
     */
    getSourceCardToken(key, quote, vehicle, cardholder_name, billing_postcode) {
        // define a localised handler object referenced to the callbacks required
        const handler = this.handler;
        const publicHandler = this.publicHandler;
        const card = this.card;
        this.getClientSecretIntent(key, quote, vehicle).then(function(clientSecret) {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            handler.stripe.confirmCardPayment(
              clientSecret,
              { payment_method  : {
                      card              : card,
                      billing_details   : { 
                          name      : cardholder_name,
                          address   : {
                              postal_code   : billing_postcode
                          }
                      }
              }},
              { handleActions   : false }
            ).then(function(confirmResult) {
                if (confirmResult.error) {
                    // Report to the browser that the payment failed, prompting it to
                    // re-show the payment interface, or show an error message and close
                    // the payment interface.
                    handler.transactionFail(publicHandler, confirmResult.error);
                } else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    if(confirmResult.paymentIntent.hasOwnProperty("status") && confirmResult.paymentIntent.status === 'succeeded') {
                        // The payment has succeeded.
                        handler.transactionSuccess(publicHandler, confirmResult.paymentIntent);
                        return;
                    }
                    // Let Stripe.js handle the rest of the payment flow.
                    handler.stripe.confirmCardPayment(clientSecret).then(function(result) {
                        if (result.error) {
                          // The payment failed -- ask your customer for a new payment method.
                          handler.transactionFail(publicHandler, result.error);
                        } else {
                          // The payment has succeeded.
                          handler.transactionSuccess(publicHandler, result.paymentIntent);
                        }
                    });
                }
            });
        });
    }
    
    /**
     * Mount the Stripe Elements card form on the specified DOM element if not already mounted
     */
    mountElement() {
        if(this.elementMounted) {
            return;
        }
        this.card.mount(this.elementMountedOn);
        this.elementMounted = true;
    }
    
    /**
     * Unmount the Stripe Elements card form from the specified DOM element if mounted
     */
    unmountElement() {
        if(!this.elementMounted) {
            return;
        }
        this.card.unmount(this.elementMountedOn);
        this.elementMounted = false;
    }
	
	/** 
	 * Initialise the gateway handler with additional config.
	 * @param {string} mount_on the selector ID
	 * @param {Object} options the payment intent card form element config options
	 */
	initialise(mount_on, options) {
        console.log(options);
        console.log(mount_on);
		// create the Stripe card form elements
		this.card = this.stripeElements.create('card', options);
        // set where / on what the card form section will be mounted in the DOM
        this.elementMountedOn = mount_on;
    }

}

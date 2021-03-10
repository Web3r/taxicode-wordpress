import axios from 'axios';

export default class StripeCardFormHandler {
        
    /**
     * Create a new Stripe card form elements
     * @param {string} public_key the stripe public key
     * @param {string} client_secret_from_uri the URI to create the payment intent to get the client secret from
     * @param {function} transactionSuccessCB A transaction success callback handler
     * @param {function} transactionFailCB A transaction failed callback handler
     * @returns {StripeCardFormHandler}
     */
    constructor(public_key, client_secret_from_uri, transactionSuccessCB, transactionFailCB, debugging) {
        // because of safai we can't have nice things & have to bind these anyway
        this.initialise = this.initialise.bind(this);
        this.getPublicHandler = this.getPublicHandler.bind(this);
        this.mountElement = this.mountElement.bind(this);
        this.unmountElement = this.unmountElement.bind(this);
        this.getHandlerName = this.getHandlerName.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.getDescriptor = this.getDescriptor.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.getCustomerToken = this.getCustomerToken.bind(this);
        this.setCustomerToken = this.setCustomerToken.bind(this);
        this.getClientSecretIntent = this.getClientSecretIntent.bind(this);
        this.getSourceCardToken = this.getSourceCardToken.bind(this);
        this.paymentHandlerName = 'jstoken_stripe';
        this.country = 'GB';
        this.currency = 'gbp';
        // set the gateway public key
        this.pk = public_key;
        // set the URI to create the payment intent to get the client secret from
        this.intent_secret_uri = client_secret_from_uri;
        // set the callback functions to allow for adaption 
        this.transactionSuccessCB = transactionSuccessCB;
        this.transactionFailCB = transactionFailCB;
        this.debugging = debugging;
        // set the stripe library resources
        this.stripe = Stripe(this.pk);
        this.stripeElements = this.stripe.elements();
        // set the initial state
        this.amount = 0;
        this.descriptor = '';
        this.customer_token = null;
        this.elementMounted = false;
        this.elementMountedOn = 'stripe-card-form';
    }
	
	/** 
	 * Initialise the gateway handler with additional config.
	 * @param {string} mount_on the selector ID
	 * @param {Object} options the payment intent card form element config options
	 */
	initialise(mount_on, style_options, hide_postcode) {
        if(this.debugging) {
            console.group('Stripe card form handler initialising...');
            console.info(mount_on);
            console.info(style_options);
            console.info(hide_postcode);
        }
        const options = {
            style           : style_options,
            hidePostalCode  : (typeof hide_postcode !== 'undefined') ? !!hide_postcode : false
        };
        if(this.debugging) {
            console.info(options);
        }
		// create the Stripe card form elements
		this.card = this.stripeElements.create('card', options);
        // set where / on what the card form section will be mounted in the DOM
        this.elementMountedOn = mount_on;
        if(this.debugging) {
            console.log('Stripe card form handler initialised');
            console.groupEnd();
        }
    }

    /**
     * Get the exposable public handler interface
     * @returns {Object}
     */
     getPublicHandler() {
        return {
            mountElement        : this.mountElement,
            unmountElement      : this.unmountElement,
            getHandlerName      : this.getHandlerName,
            getAmount           : this.getAmount,
            getDescriptor       : this.getDescriptor,
            updateAmount        : this.updateAmount,
            getCustomerToken    : this.getCustomerToken,
            setCustomerToken    : this.setCustomerToken,
            getSourceCardToken  : this.getSourceCardToken
        };
    }
    
    /**
     * Mount the Stripe Elements card form on the specified DOM element if not already mounted
     */
    mountElement() {
        if(this.elementMounted) {
            return;
        }
        if(this.debugging) {
            console.log(`Mounting Stripe card element on ${this.elementMountedOn}`);
        }
        this.card.mount(document.getElementById(this.elementMountedOn));
        this.elementMounted = true;
    }
    
    /**
     * Unmount the Stripe Elements card form from the specified DOM element if mounted
     */
    unmountElement() {
        if(!this.elementMounted) {
            return;
        }
        if(this.debugging) {
            console.log(`Unmounting Stripe card element from ${this.elementMountedOn}`);
        }
        this.card.unmount(document.getElementById(this.elementMountedOn));
        this.elementMounted = false;
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
        const handler = this.getPublicHandler();
        const intent_secret_uri = this.intent_secret_uri;
        const debugging = this.debugging;
        if(this.debugging) {
            console.group(`Getting client secret from ${intent_secret_uri}`);
        }
        return new Promise((resolve, reject) => {
			// need to have at least 1 POSTed input value to trigger the POST method
            const formData = new FormData();
            formData.append('handler', handler.getHandlerName());
            formData.append('key', key);
            formData.append('quote', quote);
            formData.append('vehicle', vehicle);
            // make the request to create a payment intent for the transaction
			axios({
				url             : intent_secret_uri,
				method          : 'post',
				data            : formData,
				responseType    : 'json',
                headers: {
                    'Content-Type': 'application/application/x-www-form-urlencoded',
                }
            })
            .then(response => {
                // resolve the client secret as promised
                if(debugging) {
                    console.log(response);
                    console.groupEnd();
                }
                resolve(response.data.response.intent.client_secret);
            })
            .catch(error => {
                let reason = error;
                if(error.response) {
                    reason = error.response;
                } else if(error.request) {
                    reason = error.request;
                } else {
                    reason = error.message;
                }
                console.error(error);
                if(debugging) {
                    console.warn(`The error message received was: '${reason}'`);
                    console.info(formData);
                    console.groupEnd();
                }
                // reject the response as an error
                reject(reason);
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
        // define a localised handler object reference to pass to the callbacks required
        const publicHandler = this.getPublicHandler();
        const Stripe = this.stripe;
        // get a local reference to transaction success & error callbacks
        const onTransactionSuccess = this.transactionSuccessCB;
        const onTransactionFail = this.transactionFailCB;
        const card = this.card;
        this.getClientSecretIntent(key, quote, vehicle)
        .then(clientSecret => {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            Stripe.confirmCardPayment(
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
            ).then(confirmResult => {
                if (confirmResult.error) {
                    // Report to the browser that the payment failed, prompting it to
                    // re-show the payment interface, or show an error message and close
                    // the payment interface.
                    onTransactionFail(publicHandler, confirmResult.error);
                } else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    if(confirmResult.paymentIntent.hasOwnProperty('status') && confirmResult.paymentIntent.status === 'succeeded') {
                        // The payment has succeeded.
                        onTransactionSuccess(publicHandler, confirmResult.paymentIntent);
                        return;
                    }
                    // Let Stripe.js handle the rest of the payment flow.
                    Stripe.confirmCardPayment(clientSecret)
                    .then(result => {
                        if (result.error) {
                          // The payment failed -- ask your customer for a new payment method.
                          onTransactionFail(publicHandler, result.error);
                        } else {
                          // The payment has succeeded.
                          onTransactionSuccess(publicHandler, result.paymentIntent);
                        }
                    });
                }
            })
            .catch(error => {
                onTransactionFail(publicHandler, error);
            });
        });
    }
}

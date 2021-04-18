import BasePaymentHandler from './BasePaymentHandler';
import axios from 'axios';

export default class StripeElementsHandler extends BasePaymentHandler {
        
    /**
     * Create a new Stripe card form elements
     * @param {function} transactionSuccessCB A transaction success callback handler
     * @param {function} transactionFailCB A transaction failed callback handler
	 * @param {Boolean} debugging flag to indicate if debugging is enabled
     * @returns {StripeElementsHandler}
     */
    constructor(transactionSuccessCB, transactionFailCB, debugging) {
        super(transactionSuccessCB, transactionFailCB, debugging);
        // because of safai we can't have nice things & have to bind these anyway
        // override get handler to allow for additional properties to be injected
        this.getPublicHandler = this.getPublicHandler.bind(this);
        // override the handle method to actually impliment the transaction handling
        this.handle = this.handle.bind(this);
        // bind the addtional class methods
        this.initialise = this.initialise.bind(this);
        this.mountElement = this.mountElement.bind(this);
        this.unmountElement = this.unmountElement.bind(this);
        this.getCustomerToken = this.getCustomerToken.bind(this);
        this.setCustomerToken = this.setCustomerToken.bind(this);
        this.getClientSecretIntent = this.getClientSecretIntent.bind(this);
        // override / set the payment handler specific name
        this.paymentHandlerName = 'jstoken_stripe';
        // set the initial state of mutatable properties
        this.customer_token = null;
        this.elementMounted = false;
        this.elementMountedOn = 'stripe-card-form';
    }
	
	/** 
	 * Initialise the gateway handler with additional config.
     * @param {string} public_key the stripe public key
     * @param {string} client_secret_from_uri the URI to create the payment intent to get the client secret from
	 * @param {string} mount_on the selector ID
	 * @param {Object} style_options the payment intent card form element style config options
	 * @param {Boolean} hide_postcode flag to indicate the stipe postcode field should be displayed
	 */
	initialise(public_key, client_secret_from_uri, mount_on, style_options, hide_postcode) {
        if(this.debugging) {
            console.group('Stripe card form handler initialising...');
            console.info(public_key);
            console.info(client_secret_from_uri);
            console.info(mount_on);
            console.info(style_options);
            console.info(hide_postcode);
        }
        // set the gateway public key
        this.pk = public_key;
        // set the URI to create the payment intent to get the client secret from
        this.intent_secret_uri = client_secret_from_uri;
        // set where / on what the card form section will be mounted in the DOM
        this.elementMountedOn = mount_on;
        // set the stripe library resources
        this.stripe = Stripe(this.pk);
        this.stripeElements = this.stripe.elements();
        const options = {
            style           : style_options,
            hidePostalCode  : (typeof hide_postcode !== 'undefined') ? !!hide_postcode : false
        };
        if(this.debugging) {
            console.info(options);
        }
		// create the Stripe card form elements
		this.card = this.stripeElements.create('card', options);
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
         const handler = super.getPublicHandler();
        return {
            ...handler,
            mountElement : this.mountElement,
            unmountElement : this.unmountElement,
            getCustomerToken : this.getCustomerToken,
            setCustomerToken : this.setCustomerToken
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
     * Handle the actual transaction
     * @param {Function} publicHandler Method to get the public facing payment handler interface
     * @param {Function} onTransactionSuccess Method to call when the transaction succeeds
     * @param {Function} onTransactionFail Method to call when the transaction fails
     * @param {Object} setup Additional setup / options for the payment handler 
     */
     handle(publicHandler, onTransactionSuccess, onTransactionFail, setup) {
        const {
            key, 
            quote, 
            vehicle, 
            cardholder_name, 
            billing_postcode
        } = setup;
        const Stripe = this.stripe;
        const card = this.card;
        this.getClientSecretIntent(key, quote, vehicle)
        .then(clientSecret => {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            Stripe.confirmCardPayment(
                clientSecret,
                { payment_method : {
                        card : card,
                        billing_details : { 
                            name : cardholder_name,
                            address : {
                                postal_code : billing_postcode
                            }
                        }
                }},
                { handleActions : false }
            ).then(confirmResult => {
                if (confirmResult.error) {
                    // Report to the browser that the payment failed, prompting it to
                    // re-show the payment interface, or show an error message and close
                    // the payment interface.
                    onTransactionFail(publicHandler(), confirmResult.error);
                } else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    if(confirmResult.paymentIntent.hasOwnProperty('status') && confirmResult.paymentIntent.status === 'succeeded') {
                        // The payment has succeeded.
                        onTransactionSuccess(publicHandler(), confirmResult.paymentIntent);
                        return;
                    }
                    // Let Stripe.js handle the rest of the payment flow.
                    Stripe.confirmCardPayment(clientSecret)
                    .then(result => {
                        if (result.error) {
                          // The payment failed -- ask your customer for a new payment method.
                          onTransactionFail(publicHandler(), result.error);
                        } else {
                          // The payment has succeeded.
                          onTransactionSuccess(publicHandler(), result.paymentIntent);
                        }
                    });
                }
            })
            .catch(error => {
                onTransactionFail(publicHandler(), error);
            });
        });
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
				url : intent_secret_uri,
				method : 'post',
				data : formData,
				responseType : 'json',
                headers : {
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
}

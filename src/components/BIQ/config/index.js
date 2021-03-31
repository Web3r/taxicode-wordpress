// define the default Stripe card elements style config object
export const DEFAULT_STRIPE_CARD_STYLE = {
    base : {
        fontFamily : "'Muli', sans-serif",
        fontSize : '14px',
        color : '#333'
    },
    invalid : {
        color : 'red'
    }
};
export const biqSettings = (settings, debugging) => {
    if(debugging) {
        // this is a string from the REST & doesn't parse to JSON well :(
        // but the echoed string inside the script tag to be supplied as a prop to the
        // Checkout Page view via the global window variable is an object.
        // It's dirty, but needs must for now 2021
        console.log('stripe_cardform_style', settings.stripe_cardform_style);
        console.info('type', typeof(settings.stripe_cardform_style));
        try {
            console.log('parse attempt', JSON.parse(settings.stripe_cardform_style));
        } catch(e) {
            console.error(e);
        }
    }
    // return the extracted BIQ app settings 
    return {
        biq_pk : settings.taxicode_public,
        biq_api_host : settings.biq_api_host,
        paypal_pk : settings.paypal_public,
        stripe_pk : settings.stripe_public,
        // this is a string from the REST & doesn't parse to JSON well :(
        stripe_cardform_style : settings.stripe_cardform_style,
        // convert to boolean for ease
        booking_test_mode : (settings.test_mode == '1'),
        quote_type : settings.quote_type,
        // convert to boolean for ease
        recommend_upgrade : (settings.recommend_upgrade == '1'),
        complete_page_text : settings.complete_page_text
    };
};
// define the BIQ config to be used
export const biqConf = {
    LIVE_API_HOST : 'https://api.taxicode.com/',
    TEST_API_HOST : 'https://api.stagingtaxis.co.uk/',
    PLACES_URI : 'places/?term=',
    AUTH_URI : 'auth/',
    QUOTE_URI : 'booking/quote/',
    JOURNEY_URI : 'booking/journey/?id=',
    CLIENT_SECRET_URI : 'booking/client_gateway_secret/',
    PAYMENT_URI : 'booking/pay/',
    PGH_CONF            : {
        hidePostalCode  : true
    },
    useButtons : true
};
// export the default configuration values object
export default biqConf;
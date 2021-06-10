// define the default Stripe card elements style config object
export const DEFAULT_STRIPE_CARD_STYLE = {
    "base" : {
        "fontFamily" : "'Muli', sans-serif",
        "fontSize" : "14px",
        "color" : "#333"
    },
    "invalid" : {
        "color" : "red"
    }
};
export const STRIPE_STYLE_GUIDE_DOCS_URL = 'https://stripe.com/docs/js/appendix/style';

// mine
// const mapbox_key = 'pk.eyJ1IjoiZXZpbC13aXphcmQiLCJhIjoiY2tvbDVtZjAwMHB2ZjJvcWYxcWQ3ZWJyOCJ9.ZsLvVwGS1t8sClVF_ShItA';
export const MAPBOX_STYLES_LIST_DOCS_URL = 'https://docs.mapbox.com/api/maps/styles/#mapbox-styles';

/**
 * Variable name replacement to help reduce production size
 * 
 * - s = settings
 * - d = debugging
 */
// define the method to extract / map the settings to the app use
export const biqSettings = (s, d) => {
    if(d) {
        // this is a string from the REST & doesn't parse to JSON well :(
        // but the echoed string inside the script tag to be supplied as a prop to the
        // Checkout Page view via the global window variable is an object.
        // It's dirty, but needs must for now 2021
        console.log('stripe_cardform_style', s.stripe_cardform_style);
        console.info('type', typeof(s.stripe_cardform_style));
        try {
            console.log('parse attempt', JSON.parse(s.stripe_cardform_style));
        } catch(e) {
            console.error(e);
        }
    }
    // return the extracted BIQ app settings 
    return {
        biq_pk : s.taxicode_public,
        biq_api_host : s.biq_api_host,
        mapbox_pk : s.mapbox_public,
        mapbox_style : s.mapbox_style,
        paypal_pk : s.paypal_public,
        stripe_pk : s.stripe_public,
        // this is a string from the REST & doesn't parse to JSON well :(
        stripe_cardform_style : s.stripe_cardform_style,
        // convert to boolean for ease
        booking_test_mode : (s.test_mode == '1'),
        quote_type : s.quote_type,
        // convert to boolean for ease
        recommend_upgrade : (s.recommend_upgrade == '1'),
        complete_page_text : s.complete_page_text
    };
};
// used to add the wordpress admin nonce header for admin REST requests
export const wpAdminRequestConfig = nonce => {
    return { 
        headers : { 
            "X-WP-Nonce" : nonce 
        } 
    };
};
/**
 * Variable name replacement to help reduce production size
 * 
 * - ns = new settings
 */
// expected to be imported as a vue component App method
export const updateAppSettings = function(ns, cb) {
    if(this.appDebugEnabled) {
        console.group('Updating BIQ App Settings');
        console.log('BIQ App Settings', { ...this.settings });
        console.log('New BIQ Settings', ns);
    }
    // just extract all the supplied settings
    const s = (typeof(cb) == 'function') 
        ? cb.call(this, ns) 
        : biqSettings(ns, this.appDebugEnabled);
    // set the app settings provided
    this.settings = s;
    if(this.appDebugEnabled) {
        console.info('Updated Settings');
        console.log('Settings', s);
        console.log('BIQ App Settings', { ...this.settings });
        console.groupEnd();
    }
}

// import the BIQ API details
import { LIVE_API_HOST, TEST_API_HOST, AUTH_URI } from '@BIQ/API';
import { PLACES_URI, QUOTE_URI, JOURNEY_URI } from '@BIQ/API/Quote';
import { CLIENT_SECRET_URI, PAYMENT_URI } from '@BIQ/API/Checkout';

// define the BIQ config to be used
export const biqConf = {
    LIVE_API_HOST,
    TEST_API_HOST,
    AUTH_URI,
    PLACES_URI,
    QUOTE_URI,
    JOURNEY_URI,
    CLIENT_SECRET_URI,
    PAYMENT_URI,
    PGH_CONF : {
        hidePostalCode : true
    }
};
// export the default configuration values object
export default biqConf;

module.exports = {
    PLACES_URL          : 'https://api.stagingtaxis.co.uk/places/',
    AUTH_URI            : '/auth/',
    QUOTE_URL           : 'https://api.stagingtaxis.co.uk/booking/quote/',
    JOURNEY_URL         : 'https://api.stagingtaxis.co.uk/booking/journey/?id=',
    CLIENT_SECRET_URL   : 'https://api.stagingtaxis.co.uk/booking/client_gateway_secret/',
    PAYMENT_URL         : 'https://api.stagingtaxis.co.uk/booking/pay/',
    PGH_CONF            : {
        style   : {
            base      : {
                fontFamily  : "'Muli', sans-serif",
                fontSize    : '14px',
                color       : '#333'
            },
            invalid   : {
                color       : 'red'
            }
        },
        hidePostalCode  : true
    },
    DEV                : {
        PLACES_URL          : 'https://api.local/places/',
        AUTH_URI            : '/auth/',
        QUOTE_URL           : 'https://api.local/booking/quote/',
        JOURNEY_URL         : 'https://api.local/booking/journey/?id=',
        CLIENT_SECRET_URL   : 'https://api.local/booking/client_gateway_secret/',
        PAYMENT_URL         : 'https://api.local/booking/pay/',
        PGH_CONF            : {
            hidePostalCode  : true
        }
    },
    STAGING                : {
        PLACES_URL          : 'https://api.stagingtaxis.co.uk/places/',
        AUTH_URI            : '/auth/',
        QUOTE_URL           : 'https://api.stagingtaxis.co.uk/booking/quote/',
        JOURNEY_URL         : 'https://api.stagingtaxis.co.uk/booking/journey/?id=',
        CLIENT_SECRET_URL   : 'https://api.stagingtaxis.co.uk/booking/client_gateway_secret/',
        PAYMENT_URL         : 'https://api.stagingtaxis.co.uk/booking/pay/',
        PGH_CONF            : {
            hidePostalCode  : true
        }
    },
    LIVE                : {
        PLACES_URL          : 'https://api.taxicode.com/places/',
        AUTH_URI            : '/auth/',
        QUOTE_URL           : 'https://api.taxicode.com/booking/quote/',
        JOURNEY_URL         : 'https://api.taxicode.com/booking/journey/?id=',
        CLIENT_SECRET_URL   : 'https://api.taxicode.com/booking/client_gateway_secret/',
        PAYMENT_URL         : 'https://api.taxicode.com/booking/pay/',
        PGH_CONF            : {
            hidePostalCode  : true
        }
    }
};

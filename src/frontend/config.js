module.exports = {
    DEV                : {
        PLACES_URI : 'places/?term=',
        AUTH_URI : 'auth/',
        QUOTE_URI : 'booking/quote/',
        JOURNEY_URI : 'booking/journey/?id=',
        CLIENT_SECRET_URI : 'booking/client_gateway_secret/',
        PAYMENT_URI : 'booking/pay/',
        BOOKING_DETALS_URI : 'booking-details/?booking_ref=',
        PGH_CONF : {
            hidePostalCode : true
        },
        useButtons : true
    },
    STAGING                : {
        PLACES_URI : 'places/?term=',
        AUTH_URI : 'auth/',
        QUOTE_URI : 'booking/quote/',
        JOURNEY_URI : 'booking/journey/?id=',
        CLIENT_SECRET_URI : 'booking/client_gateway_secret/',
        PAYMENT_URI : 'booking/pay/',
        BOOKING_DETALS_URI : 'booking-details/?booking_ref=',
        PGH_CONF            : {
            hidePostalCode  : true
        },
        useButtons : true
    },
    LIVE                : {
        PLACES_URI : 'places/?term=',
        AUTH_URI : 'auth/',
        QUOTE_URI : 'booking/quote/',
        JOURNEY_URI : 'booking/journey/?id=',
        CLIENT_SECRET_URI : 'booking/client_gateway_secret/',
        PAYMENT_URI : 'booking/pay/',
        BOOKING_DETALS_URI : 'booking-details/?booking_ref=',
        PGH_CONF            : {
            hidePostalCode  : true
        },
        useButtons : true
    }
};

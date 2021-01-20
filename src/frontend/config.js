module.exports = {
    QUOTE_URL           : 'https://api.taxicode.com/booking/quote/',
    JOURNEY_URL         : 'https://api.taxicode.com/booking/journey/?id=',
    CLIENT_SECRET_URL   : 'https://api.taxicode.com/booking/client_gateway_secret/',
    PAYMENT_URL         : 'https://api.taxicode.com/booking/pay/',
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
    }
};

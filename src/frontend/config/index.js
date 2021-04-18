// import the BIQ static config
import biqConf from 'BIQ/config';

// define the app config to be used
const conf = {
    biq : {
        ...biqConf
    },
    BOOKING_DETALS_URI : 'booking-details/?booking_ref=',
};
// export the default configuration values object
export default conf;

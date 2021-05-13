// import the date & time string functions for display
import { readableDate, readableTime } from '@BIQ/Journey';

export const journeyOutlineImages = (i) => {
    const si = {
        quote_type : require('BIQ-Images/journey/type.png'),
        pickup : require('BIQ-Images/journey/pickup.png'),
        destination : require('BIQ-Images/journey/destination.png'),
        date_time : require('BIQ-Images/journey/date_time.png'),
        people : require('BIQ-Images/journey/passenger.png')
    };
    if(!si.hasOwnProperty(i)) {
        return '/images/404.png';
    }
    return si[i];
};

// define the BIQ Journey Outline Mixin for components to include & inherit from
export const biqJourneyOutlineMixin = {
    methods : {
        images : journeyOutlineImages
    },

    filters: {
        readableDate,
        readableTime
    }
};
// export the BIQ Journey Outline Mixin as the default object
export default biqJourneyOutlineMixin;

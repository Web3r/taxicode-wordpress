// import the geo coords locations services
import { toLocationObject, geoCoords, geoJSONCoords, LAT_LNG_LONDON, LAT_LNG_LHR } from '@BIQ/LocationService';

// defin pickup location component property
export const pickupLocationProp = {
    type : Object,
    required : true,
    // @todo add a validator to make sure location object structure
    default : function() { 
        return toLocationObject('London', '', LAT_LNG_LONDON);
    }
};
// define the pickup location related computed property methods
export const pickupLocationComputed = {
    geoJSONPickup : function() {
        return geoJSONCoords.toCoords(this.pickup.position);
    },

    coordsPickup : function() {
        return geoCoords.toCoords(this.pickup.position);
    }
};

// defin destination location component property
export const destinationLocationProp = {
    type : Object,
    required : true,
    // @todo add a validator to make sure location object structure
    default : function() { 
        return toLocationObject('London Heathrow', 'TW6 1AP', LAT_LNG_LHR);
    }
};
// define the destination location related computed property methods
export const destinationLocationComputed = {
    geoJSONDestination : function() {
        return geoJSONCoords.toCoords(this.destination.position);
    },

    coordsDestination : function() {
        return geoCoords.toCoords(this.destination.position);
    },
};

// define the combined journey locations component properties
export const journeyLocationsProps = {
    pickup : pickupLocationProp,
    destination : destinationLocationProp,
};
// define the list of supporting journey locations events the component emits & can be listened for
export const emitEvents = {
};
// define the combined journey locations component computed property methods
export const journeyLocationsComputed = {
    ...pickupLocationComputed,
    ...destinationLocationComputed,

    center : function() {
        return geoCoords.centerOn(this.pickup.position, this.destination.position);
    },

    geoJSONCenter : function() {
        return geoJSONCoords.centerOn(this.pickup.position, this.destination.position);
    },

    coordsCenter : function() {
        return geoCoords.toCoords(this.center);
    }
};
// define the combined journey locations component methods
export const journeyLocationsMethods = {
    wtf : function() {
        const wtf = {
            pickup : this.pickup,
            dest : this.destination,
            center : this.center,
            geoJSONPickup : this.geoJSONPickup,
            geoJSONDestination : this.geoJSONDestination,
            geoJSONCenter : this.geoJSONCenter,
            coordsPickup : this.coordsPickup,
            coordsDest : this.coordsDestination,
            coordsCenter : this.coordsCenter,
            ha : geoCoords.centerOnCoords(this.pickup.position, this.destination.position),
            hmm : geoJSONCoords.toGeoJSON(geoCoords.centerOnCoords(this.pickup.position, this.destination.position))
        };
        console.log('WTF', { ...wtf });
    },
};

// define the BIQ Journey Locations Mixin for components to include & inherit from
export const biqJourneyLocationsMixin = {
    props : {
        ...journeyLocationsProps
    },

    computed : {
        ...journeyLocationsComputed
    },

    methods : {
        ...journeyLocationsMethods,
    }
};
// export the BIQ Journey Locations Mixin as the default object
export default biqJourneyLocationsMixin;

// define the lat/lng coordinate positions of known places (for convienience)
export const LAT_LNG_LONDON = [ 51.509865, -0.118092 ];
export const LAT_LNG_LHR = [ 51.470020, -0.454295 ];

// define a method to return a location structured object from parts
export const toLocationObject = (s, p, c) => {
    return {
        string : s,
        postcode : p,
        position : c
    }
}

// function to convert a [ lat, lng ] array to object notation
export const toCoords = a => {
    return {
        lat : a[0],
        lng : a[1]
    };
};
// function to calculation the center position of 2 locations
export const centerOn = (a, b) => {
    const pos = [];
    pos.push((a[0] + b[0]) / 2);
    pos.push((a[1] + b[1]) / 2);
    return pos;
};
// function to calculation the center position of 2 location [ lat, lng ] arrays and convert to object
export const centerOnCoords = (a, b) => toCoords(centerOn(a, b));

// function to convert the { lat : 0,  lng : 0 } location object to [ lng, lat ] 
// array format compatible with GeoJSON
export const toGeoJSON = l => [ l.lng, l.lat ];

// define an object for working with lat lng coordinates
export const geoCoords = {
    toCoords,
    centerOn,
    centerOnCoords
};

// define an object for working with lng lat coordinates compatible with GeoJSON
export const geoJSONCoords = {
    // helpers to convert the result [ lat, lng ] to [ lng, lat ]
    toCoords : a => toGeoJSON(toCoords(a)),
    centerOn : (a, b) => toGeoJSON(centerOnCoords(a, b)),
    toGeoJSON,
};

// define an empty journey location structured object
export const emptyLocation = toLocationObject('', '', [ 0, 0 ]);

// create a default exportable object container
const LocationService = {
    coords : {
        london : LAT_LNG_LONDON,
        lhr : LAT_LNG_LHR
    },
    geoCoords,
    geoJSONCoords,
    toLocationObject,
    emptyLocation
};
// export the default object container
export default LocationService;

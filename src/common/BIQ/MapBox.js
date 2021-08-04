// import the plugin to handle the Xhr AJAX API requests
import axios from 'axios';

// function to build the mapbox directions API URL to call
export const apiDirectionsURL = (a, b, token) => {
    const URI = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
    const coords = a.join(',') + ';' + b.join(',');
    return `${URI}${coords}?geometries=geojson&access_token=${token}`;
}
// asynchronous function to call the mapbox API for directions route geometry
export const getDirections = async (a, b, token, d) => {
    const URL = apiDirectionsURL(a, b, token);
    if(d) {
        console.log('Mapbox API URL', URL);
    }
    const r = await axios.get(URL);
    if(d) {
        console.log('Mapbox API Response', r);
    }
    return r.data.routes[0].geometry.coordinates;
};

// list of known map styles
export const mapStyles = {
    streets : 'mapbox://styles/mapbox/streets-v11',
    night : 'mapbox://styles/mapbox/navigation-night-v1',
    day : 'mapbox://styles/mapbox/navigation-day-v1',
    custom : 'mapbox://styles/taxicode-testing/cke2xdy4u1chp19n2abb4516w'
};

// create a default exportable object container
const MapBox = {
    API : {
        URL : {
            directions : apiDirectionsURL
        },
        getDirections
    },
    mapStyles
};
// export the default object container
export default MapBox;

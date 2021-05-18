<template>
    <map-marker
        :coordinates="geoJSONLocation" 
        :color="color" 
    >
        <map-popup v-if="showPopup"
            :anchor="popupAnchor"
        >
            <div>
                <ul>
                    <li>{{locationTypeLabel}} : {{location}}</li>
                    <li>{{locationTypeLabel}} Coords : {{coordsLocation}}</li>
                    <li>{{locationTypeLabel}} GeoJSON : {{geoJSONLocation}}</li>
                </ul>
            </div>
        </map-popup>
    </map-marker>
</template>

<script>
    // import the mapbox components
    import { MglMarker, MglPopup } from "vue-mapbox";
    // import the mixin that handles coordinate geoJSON wiredness without worries
    import { locationProp, locationComputed } from 'BIQ/mixins/JourneyLocationsMixin';

    // define the list of accepted marker anchor positions
    const anchorPoints = [
        'top' , 
        'bottom' , 
        'left' , 
        'right' , 
        'top-left' , 
        'top-right' , 
        'bottom-left',
        'bottom-right'
    ];

    // define the component properties
    const props = {
        location : locationProp,

        locationTypeLabel : {
            type : String,
            default : 'Location'
        },

        color : {
            type : String,
            default : 'blue'
        },

        showPopup : {
            type : Boolean,
            default : false
        },

        popupAnchor : {
            type : String,
            default : anchorPoints[0],
            validator : anchor => anchorPoints.indexOf(anchor) > -1
        },

        debugging : {
            type : Boolean,
            default : false
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
    };
    // define the component computed property methods
    const computed = {
        ...locationComputed
    };
    // define the component methods
    const methods = {
    };

    export default {
        name : 'JourneyLocationMapMarker',
        props,
        computed,
        methods,

        components : {
            'map-marker' : MglMarker,
            'map-popup' : MglPopup
        },

    };
</script>

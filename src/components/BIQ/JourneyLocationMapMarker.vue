<template>
    <map-marker
        :coordinates="geoJSONLocation" 
        :color="color" 
    >
        <map-popup v-if="showPopup"
            :anchor="popupAnchor"
        >
            <slot 
                name="popup-content"
                :location="location"
                :location-type-label="locationTypeLabel"
                :geo-location="geoJSONLocation"
            >
                <div>
                    <ul class="card list-group list-group-flush">
                        <li class="list-group-item d-flex">
                            {{locationTypeLabel}} : {{location}}
                        </li>
                        <li class="list-group-item d-flex">
                            {{locationTypeLabel}} Coords : {{coordsLocation}}
                        </li>
                        <li class="list-group-item d-flex">
                            {{locationTypeLabel}} GeoJSON : {{geoJSONLocation}}
                        </li>
                    </ul>
                </div>
            </slot>
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
            // validate the anchor point is one of the acepted values
            validator : a => anchorPoints.indexOf(a) > -1
        },

        debugging : {
            type : Boolean,
            default : false
        }
    };
    // define the component computed property methods
    const computed = {
        ...locationComputed
    };

    export default {
        name : 'JourneyLocationMapMarker',
        props,
        computed,

        components : {
            'map-marker' : MglMarker,
            'map-popup' : MglPopup
        }
    };
</script>

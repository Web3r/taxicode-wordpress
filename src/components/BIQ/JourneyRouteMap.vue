<template>
    <route-map
        ref="mpbx" 
        :repaint="map_conf.repaint"
        :attribution-control="map_conf.controls"
        :access-token="mapboxPublicKey" 
        :map-style="style" 
        :center="geoJSONCenter" 
        @load="onMapLoaded" 
    >
        <location-map-marker v-if="!loadingJourney"
            :location="pickup"
            :color="pickupColor"
            :show-popup="show_debug"
            :debugging="debugging"
            location-type-label="Pickup"
            popup-anchor="top"
        >
            <template #popup-content="{ location, locationTypeLabel }">
                <div>
                    <ul class="card list-group list-group-flush">
                        <li class="list-group-item d-flex">
                            {{locationTypeLabel}} : {{location.string}}
                        </li>
                    </ul>
                </div>
            </template>
        </location-map-marker>

        <location-map-marker v-if="!loadingJourney"
            :location="destination"
            :color="destinationColor"
            :show-popup="show_debug"
            :debugging="debugging"
            location-type-label="Destination"
            popup-anchor="top"
        >
            <template #popup-content="{ location, locationTypeLabel }">
                <div>
                    <ul class="card list-group list-group-flush">
                        <li class="list-group-item d-flex">
                            {{locationTypeLabel}} : {{location.string}}
                        </li>
                    </ul>
                </div>
            </template>
        </location-map-marker>

        <map-popup v-if="show_debug"
            :coordinates="geoJSONCenter" 
        >
            <div>
                <ul>
                    <li>Center : {{center}}</li>
                    <li>Center GeoJSON : {{geoJSONCenter}}</li>
                    <li>Center Coords : {{coordsCenter}}</li>
                </ul>
            </div>
        </map-popup>

        <map-geo-json-layer v-if="geo_json.conf.active"
            :layer-id="mapboxLayerId"
            :source-id="mapboxSourceId"
            :layer="geoJSONLayerSource"
            :source="geoJSONLayerMapSource"
            :replace="geo_json.conf.replace"
            :replace-source="geo_json.conf.replace_source"
        ></map-geo-json-layer>
    </route-map>
</template>

<script>
    // import the mapbox components
    import Mapbox from "mapbox-gl";
    import { MglMap, MglPopup, MglGeojsonLayer } from "vue-mapbox";
    // import the journey location map marker
    import JourneyLocationMapMarker from 'BIQ/JourneyLocationMapMarker.vue';
    // import the mixin that handles coordinate geoJSON wiredness without worries
    import biqJourneyLocationsMixin from 'BIQ/mixins/JourneyLocationsMixin';
    // import the geo coords locations services
    import { geoJSONCoords } from '@BIQ/LocationService';
    // import the mapbox api stuff
    import { getDirections, mapStyles } from '@BIQ/MapBox';

    // define the component properties
    const props = {
        mapboxPublicKey : {
            type : String,
            required : true,
            default : ''
        },

        mapboxStyle : {
            type : String,
            default : mapStyles.day
        },

        mapboxLayerId : {
            type : String,
            default : 'mapLayer'
        },

        mapboxSourceId : {
            type : String,
            default : 'mapSource'
        },

        pickupColor : {
            type : String,
            default : 'green'
        },

        destinationColor : {
            type : String,
            default : 'red'
        },

        routeColor : {
            type : String,
            default : 'blue'
        },

        loadingJourney : {
            type : Boolean,
            default : false
        },

        journeyError : {
            type : Boolean,
            default : false
        },

        journeyLoaded : {
            type : Boolean,
            default : true
        },

        debugging : {
            type : Boolean,
            default : false
        }
    };
    // define the list of events the component emits & can be listened for
    const emitEvents = {
        directionsError : {
            name : 'directionsError'
        }
    };
    // define the component computed property methods
    const computed = {
        geoJSONLayerMapSource : function() {
            const coords = this.geo_json.coords;
            return {
                type : 'geojson',
                data : {
                    id : this.mapboxSourceId,
                    type : 'Feature',
                    properties : { },
                    geometry : {
                        type : 'LineString',
                        coordinates : coords,
                    }
                }
            };
        },

        geoJSONLayerSource : function() {
            const coords = this.geo_json.coords;
            const layer = this.geo_json.layer;
            return {
                ...layer,
                source : {
                    type : 'geojson',
                    data : {
                        id : `${this.mapboxSourceId}-${this.mapboxLayerId}`,
                        type : 'Feature',
                        properties : { },
                        geometry : {
                            type : 'LineString',
                            coordinates : coords,
                        }
                    }
                }
            };
        }
    };
    // define the component methods
    const methods = {
        calcRoute : async function() {
            if(typeof this.$refs.mpbx !="undefined") {
                this.snapTo(this.$refs.mpbx.actions);
            }
        },

        snapTo : async function(actions) {
            console.log("actions", actions);
            // get the map actions we will be using
            const {
                fitBounds,
                zoomOut
            } = actions;
            // make the map fit the confines of the pickup & destination
            await fitBounds([ this.geoJSONPickup, this.geoJSONDestination ], { animate : true });
            // add a little padding to the map bounds so the locations are not right at the edge
            await zoomOut();
        },

        onMapLoaded : async function(evt) {
            const self = this;
            console.log("load event", evt);
            this.wtf();
            this.map = evt.map;
            try {
                // get the route directions between pickup & destination
                this.geo_json.coords = await getDirections(this.geoJSONPickup, this.geoJSONDestination, this.mapboxPublicKey, this.debugging);
                this.wtf();
            } catch(e) {
            // could be an axios error or response parsed error
                if(self.debugging) {
                    console.log('Mapbox API Error', { ...e });
                    console.error(e);
                    this.wtf();
                }
                // trigger the error event
                self.$emit(emitEvents.directionsError.name, e);
            }
        }
    };

    export default {
        name : 'JourneyRouteMap',
        props,
        computed,
        methods,

        mixins : [
            biqJourneyLocationsMixin
        ],

        components : {
            'route-map' : MglMap,
            'map-geo-json-layer' : MglGeojsonLayer,
            'map-popup' : MglPopup,
            'location-map-marker' : JourneyLocationMapMarker
        },

        data() {
            // define the default map position / bounds (computed are not ready when this is called)
            const coords = [
                geoJSONCoords.toCoords(this.pickup.position),
                geoJSONCoords.toCoords(this.destination.position)
            ];
            //const coords = [ 0, 0 ];
            console.log('data', { ...coords });
            return { 
                show_debug : true,
                map_conf : {
                    repaint : false,
                    controls : false
                },
                map : null,
                style : this.mapboxStyle,
                geo_json : {
                    conf : {
                        active : true,
                        replace : false,
                        replace_source : false
                    },
                    coords : [ coords ],
                    layer : {
                        id : this.mapboxLayerId,
                        type : 'line',
                        layout : {
                            'line-join' : 'round',
                            'line-cap' : 'round'
                        },
                        paint : {
                            'line-color' : this.routeColor,
                            'line-width' : 4,
                            'line-opacity' : 0
                        }
                    }
                }
            };
        },

        created() {
            this.mapbox = Mapbox;
            console.log('created');
            this.wtf();
        },

        mounted() {
            console.log('mounted');
            this.wtf();
        },

        updated() {
            console.log('updated');
            if(this.journeyLoaded) {
                console.log('updated journey loaded');
                this.calcRoute();
            }
        }
    };
</script>

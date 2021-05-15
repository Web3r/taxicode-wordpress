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
        <map-marker v-if="!loadingJourney"
            :coordinates="geoJSONPickup" 
            color="blue" 
        >
            <map-popup v-if="show_debug"
                anchor="bottom"
            >
                <div>
                    <ul>
                        <li>Pickup : {{pickup}}</li>
                        <li>Pickup Coords : {{coordsPickup}}</li>
                        <li>Pickup GeoJSON : {{geoJSONPickup}}</li>
                        <li>Center : {{center}}</li>
                        <li>Center GeoJSON : {{geoJSONCenter}}</li>
                        <li>Center Coords : {{coordsCenter}}</li>
                    </ul>
                </div>
            </map-popup>
        </map-marker>

        <map-marker v-if="!loadingJourney"
            :coordinates="geoJSONDestination" 
            color="blue" 
        >
            <map-popup v-if="show_debug"
                anchor="top"
            >
                <div>
                    <ul>
                        <li>Destination : {{destination}}</li>
                        <li>Destination Coords : {{coordsDestination}}</li>
                        <li>Destination GeoJSON : {{geoJSONDestination}}</li>
                        <li>Center : {{center}}</li>
                        <li>Center GeoJSON : {{geoJSONCenter}}</li>
                        <li>Center Coords : {{coordsCenter}}</li>
                    </ul>
                </div>
            </map-popup>
        </map-marker>

        <map-geo-json-layer v-if="geo_json.conf.active"
            :layer-id="mapboxLayerId"
            :source-id="mapboxLayerSourceId"
            :layer="geo_json.layer"
            :source="geoJSONLayerSource"
            :replace="geo_json.conf.replace"
            :replaceSource="geo_json.conf.replace_source"
        ></map-geo-json-layer>
    </route-map>
</template>

<script>
    // import the mapbox components
    import Mapbox from "mapbox-gl";
    import { MglMap, MglMarker, MglPopup, MglGeojsonLayer } from "vue-mapbox";
    // import the mixin that controls the BIQ search without form layout worries
    import biqJourneyLocationsMixin from 'BIQ/mixins/JourneyLocationsMixin';
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
            default : mapStyles.night
        },

        mapboxLayerId : {
            type : String,
            default : 'myLayer'
        },

        mapboxLayerSourceId : {
            type : String,
            default : 'thisIsMySource'
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
        geoJSONLayerSource : function() {
            const coords = this.geo_json.coords;
            return {
                type : 'geojson',
                data : {
                    id : this.mapboxLayerSourceId,
                    type : 'Feature',
                    properties : { },
                    geometry : {
                        type : 'LineString',
                        coordinates : coords,
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
            // I googles what comes first, it's lat then lng ffs
            // the markers what the coordinates the other way round, so to avoid confustion the position 
            // object keys are used. FU Mapbox || vue-mapbox FU
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
                // lol, this one is expecting the location as [ lat, lng ] FU Mapbox || vue-mapbox FU
                // get the route directions between pickup & destination
                this.geo_json.coords = await getDirections(this.pickup.position, this.destination.position, this.mapboxPublicKey, this.debugging);
                // snap the map to the new location
                //await this.snapTo(evt.component.actions);
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
            'map-marker' : MglMarker,
            'map-geo-json-layer' : MglGeojsonLayer,
            'map-popup' : MglPopup
        },

        data() {
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
                        replace : true,
                        replace_source : true
                    },
                    coords : [ this.pickup.position, this.destination.position ],
                    layer : {
                        type : 'line',
                        layout : {
                            'line-join' : 'round',
                            'line-cap' : 'round'
                        },
                        paint : {
                            'line-color' : '#0876BA',
                            'line-width' : 4,
                            'line-opacity' : 1
                        }
                    }
                }
            };
        },

        created() {
            this.mapbox = Mapbox;
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

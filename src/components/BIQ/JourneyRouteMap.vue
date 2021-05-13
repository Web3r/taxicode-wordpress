<template>
    <route-map
        ref="mpbx" 
        :repaint="map_conf.repaint"
        :attribution-control="map_conf.controls"
        :access-token="mapboxPublicKey" 
        :map-style="style" 
        :center="center" 
        @load="onMapLoaded" 
    >
        <map-marker v-if="markers.a"
            :coordinates="markers.a" 
            color="blue" 
        ></map-marker>

        <map-marker v-if="markers.b"
            :coordinates="markers.b" 
            color="blue" 
        ></map-marker>

        <map-geo-json-layer v-if="geo_json.conf.active"
            :layer-id="geo_json.conf.layer_id"
            :source-id="geo_json.conf.layer_source_id"
            :layer="geo_json.layer"
            :source="geoJSONLayerSource"
            :replace="geo_json.conf.replace"
            :replaceSource="geo_json.conf.replace_source"
        ></map-geo-json-layer>
    </route-map>
</template>

<script>
    // import the plugin to handle the Xhr AJAX API requests
    import axios from 'axios';
    // import the mapbox components
    import Mapbox from "mapbox-gl";
    import { MglMap, MglMarker, MglGeojsonLayer } from "vue-mapbox";
    // import the geo coords
    import { geoCoords } from '@BIQ/Journey';

    // function to build the mapbox API URL to call
    const apiURL = (a, b, token) => {
        const URI = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
        const coords = a.join(',') + ';' + b.join(',');
        return `${URI}${coords}?geometries=geojson&access_token=${token}`;
    }

    const mapStyles = {
        streets : 'mapbox://styles/mapbox/streets-v11',
        night : 'mapbox://styles/mapbox/navigation-night-v1',
        day : 'mapbox://styles/mapbox/navigation-day-v1',
        custom : 'mapbox://styles/taxicode-testing/cke2xdy4u1chp19n2abb4516w'
    };

    const centerOn = (a, b) => {
        const lat = (a[0] + b[0]) / 2;
        const lng = (a[1] + b[1]) / 2;
        return [ lat, lng ];
    }

    // define the component properties
    const props = {
        mapboxPublicKey : {
            type : String,
            required : true,
            default : ''
        },

        mapboxStyle : {
            type : String,
            required : true,
            default : mapStyles.night
        },

        pickup : {
            type : Array,
            required : true,
            // @todo add a validator to make sure lat lng format numbers?
            default : function() { 
                return geoCoords.london;
            }
        },

        destination : {
            type : Array,
            required : true,
            // @todo add a validator to make sure lat lng format numbers?
            default : function() { 
                return geoCoords.lhr;
            }
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
        coordsPickup : function() {
            return geoCoords.toCoords(this.pickup);
        },

        coordsDestination : function() {
            return geoCoords.toCoords(this.destination);
        },

        coordsCenter : function() {
            return geoCoords.toCoords(centerOn(this.pickup, this.destination));
        },

        geoJSONLayerSource : function() {
            const coords = this.geo_json.coords;
            return {
                type : 'geojson',
                data : {
                    id : this.geo_json.conf.layer_source_id,
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
        async snapTo(actions) {
            console.log("actions", actions);
            const {
                fitBounds,
                setCenter,
                zoomOut
            } = actions;
            const a = geoCoords.toCoords(this.pickup);
            const b = geoCoords.toCoords(this.destination);
            await fitBounds([ a, b ], { animate : true });
            this.markers = { 
                a : [ a.lng, a.lat ], 
                b : [ b.lng, b.lat ]
            };
            //await setCenter(centerOn(this.pickup, this.destination), { animate : true });
            await zoomOut();
        },

        async onMapLoaded(evt) {
            const self = this;
            console.log("load event", evt);
            const wtf = {
                pickup : this.pickup,
                dest : this.destination,
                center : this.center,
                ha : geoCoords.toCoords(centerOn(this.pickup, this.destination)),
                eh : centerOn(this.pickup, this.destination),
                coordsPickup : this.coordsPickup,
                coordsDest : this.coordsDestination,
                coordsCenter : this.coordsCenter,
                geo : geoCoords,
                markers : this.markers
            };
            console.log('WTF', wtf);
            this.map = evt.map;
            try {
                const URL = apiURL(this.pickup, this.destination, this.mapboxPublicKey);
                if(this.debugging) {
                    console.log('Mapbox API URL', URL);
                }
                //return;
                const r = async r => {
                    if(self.debugging) {
                        console.log('Mapbox API Response', r);
                    }
                    self.geo_json.coords = r.data.routes[0].geometry.coordinates;
                    await this.snapTo(evt.component.actions);
                };
                axios.get(URL).then(r);
            } catch(e) {
            // could be an axios error or response parsed error
                if(self.debugging) {
                    console.log('Mapbox API Error', { ...e });
                    console.error(e);
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

        components : {
            'route-map' : MglMap,
            'map-marker' : MglMarker,
            'map-geo-json-layer' : MglGeojsonLayer
        },

        data() {
            const geoJsonLayerId = 'myLayer';
            const geoJsonLayerSourceId = 'thisIsMySource';
            return { 
                map_conf : {
                    repaint : false,
                    controls : false
                },
                map : null,
                style : this.mapboxStyle,
                center : geoCoords.toCoords(centerOn(this.pickup, this.destination)),
                markers : {
                    a : false,
                    b : false
                },
                geo_json : {
                    conf : {
                        active : true,
                        replace : true,
                        replace_source : true,
                        layer_source_id : geoJsonLayerSourceId,
                        layer_id : geoJsonLayerId
                    },
                    coords : [ this.pickup, this.destination ],
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
        }
    };
</script>

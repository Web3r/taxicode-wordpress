(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{428:function(o,t,e){"use strict";e.r(t);var n=e(410),i=e.n(n),a=e(409),s=e(42);const r={type:Object,required:!0,default:function(){return Object(s.f)("","",[0,0])}},c={geoJSONLocation:function(){return s.e.toCoords(this.location.position)},coordsLocation:function(){return s.d.toCoords(this.location.position)}};var p={props:{...{pickup:{type:Object,required:!0,default:function(){return Object(s.f)("London","",s.b)}},destination:{type:Object,required:!0,default:function(){return Object(s.f)("London Heathrow","TW6 1AP",s.a)}}}},computed:{...{...{geoJSONPickup:function(){return s.e.toCoords(this.pickup.position)},coordsPickup:function(){return s.d.toCoords(this.pickup.position)}},...{geoJSONDestination:function(){return s.e.toCoords(this.destination.position)},coordsDestination:function(){return s.d.toCoords(this.destination.position)}},center:function(){return s.d.centerOn(this.pickup.position,this.destination.position)},geoJSONCenter:function(){return s.e.centerOn(this.pickup.position,this.destination.position)},coordsCenter:function(){return s.d.toCoords(this.center)}}},methods:{...{wtf:function(){const o={pickup:this.pickup,dest:this.destination,center:this.center,geoJSONPickup:this.geoJSONPickup,geoJSONDestination:this.geoJSONDestination,geoJSONCenter:this.geoJSONCenter,coordsPickup:this.coordsPickup,coordsDest:this.coordsDestination,coordsCenter:this.coordsCenter,ha:s.d.centerOnCoords(this.pickup.position,this.destination.position),hmm:s.e.toGeoJSON(s.d.centerOnCoords(this.pickup.position,this.destination.position))};console.log("WTF",{...o})}}}};const u=["top","bottom","left","right","top-left","top-right","bottom-left","bottom-right"];var l={name:"JourneyLocationMapMarker",props:{location:r,locationTypeLabel:{type:String,default:"Location"},color:{type:String,default:"blue"},showPopup:{type:Boolean,default:!1},popupAnchor:{type:String,default:u[0],validator:o=>u.indexOf(o)>-1},debugging:{type:Boolean,default:!1}},computed:{...c},methods:{},components:{"map-marker":a.c,"map-popup":a.d}},d=e(18),g=Object(d.a)(l,(function(){var o=this,t=o.$createElement,e=o._self._c||t;return e("map-marker",{attrs:{coordinates:o.geoJSONLocation,color:o.color}},[o.showPopup?e("map-popup",{attrs:{anchor:o.popupAnchor}},[e("div",[e("ul",[e("li",[o._v(o._s(o.locationTypeLabel)+" : "+o._s(o.location))]),o._v(" "),e("li",[o._v(o._s(o.locationTypeLabel)+" Coords : "+o._s(o.coordsLocation))]),o._v(" "),e("li",[o._v(o._s(o.locationTypeLabel)+" GeoJSON : "+o._s(o.geoJSONLocation))])])])]):o._e()],1)}),[],!1,null,null,null).exports,h=e(17),m=e.n(h);const y=(o,t,e)=>`https://api.mapbox.com/directions/v5/mapbox/driving/${o.join(",")+";"+t.join(",")}?geometries=geojson&access_token=${e}`,b=async(o,t,e,n)=>{const i=y(o,t,e);n&&console.log("Mapbox API URL",i);const a=await m.a.get(i);return n&&console.log("Mapbox API Response",a),a.data.routes[0].geometry.coordinates},f={streets:"mapbox://styles/mapbox/streets-v11",night:"mapbox://styles/mapbox/navigation-night-v1",day:"mapbox://styles/mapbox/navigation-day-v1",custom:"mapbox://styles/taxicode-testing/cke2xdy4u1chp19n2abb4516w"};const _={mapboxPublicKey:{type:String,required:!0,default:""},mapboxStyle:{type:String,default:f.night},mapboxLayerId:{type:String,default:"myLayer"},mapboxLayerSourceId:{type:String,default:"thisIsMySource"},loadingJourney:{type:Boolean,default:!1},journeyError:{type:Boolean,default:!1},journeyLoaded:{type:Boolean,default:!0},debugging:{type:Boolean,default:!1}},S={name:"directionsError"};var O={name:"JourneyRouteMap",props:_,computed:{geoJSONLayerSource:function(){const o=this.geo_json.coords;return{type:"geojson",data:{id:this.mapboxLayerSourceId,type:"Feature",properties:{},geometry:{type:"LineString",coordinates:o}}}}},methods:{calcRoute:async function(){void 0!==this.$refs.mpbx&&this.snapTo(this.$refs.mpbx.actions)},snapTo:async function(o){console.log("actions",o);const{fitBounds:t,zoomOut:e}=o;await t([this.geoJSONPickup,this.geoJSONDestination],{animate:!0}),await e()},onMapLoaded:async function(o){const t=this;console.log("load event",o),this.wtf(),this.map=o.map;try{this.geo_json.coords=await b(this.geoJSONPickup,this.geoJSONDestination,this.mapboxPublicKey,this.debugging),this.wtf()}catch(o){t.debugging&&(console.log("Mapbox API Error",{...o}),console.error(o),this.wtf()),t.$emit(S.name,o)}}},mixins:[p],components:{"route-map":a.b,"map-geo-json-layer":a.a,"map-popup":a.d,"location-map-marker":g},data(){return{show_debug:!0,map_conf:{repaint:!1,controls:!1},map:null,style:this.mapboxStyle,geo_json:{conf:{active:!0,replace:!0,replace_source:!0},coords:[this.geoJSONPickup,this.geoJSONDestination],layer:{type:"line",layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#0876BA","line-width":4,"line-opacity":.5}}}}},created(){this.mapbox=i.a,console.log("created"),this.wtf()},mounted(){console.log("mounted"),this.wtf()},updated(){console.log("updated"),this.journeyLoaded&&(console.log("updated journey loaded"),this.calcRoute())}},v=Object(d.a)(O,(function(){var o=this,t=o.$createElement,e=o._self._c||t;return e("route-map",{ref:"mpbx",attrs:{repaint:o.map_conf.repaint,"attribution-control":o.map_conf.controls,"access-token":o.mapboxPublicKey,"map-style":o.style,center:o.geoJSONCenter},on:{load:o.onMapLoaded}},[o.loadingJourney?o._e():e("location-map-marker",{attrs:{location:o.pickup,"show-popup":o.show_debug,debugging:o.debugging,"location-type-label":"Pickup",color:"green","popup-anchor":"top"}}),o._v(" "),o.loadingJourney?o._e():e("location-map-marker",{attrs:{location:o.destination,"show-popup":o.show_debug,debugging:o.debugging,"location-type-label":"Destination",color:"blue","popup-anchor":"top"}}),o._v(" "),o.show_debug?e("map-popup",{attrs:{coordinates:o.geoJSONCenter}},[e("div",[e("ul",[e("li",[o._v("Center : "+o._s(o.center))]),o._v(" "),e("li",[o._v("Center GeoJSON : "+o._s(o.geoJSONCenter))]),o._v(" "),e("li",[o._v("Center Coords : "+o._s(o.coordsCenter))])])])]):o._e(),o._v(" "),o.geo_json.conf.active?e("map-geo-json-layer",{attrs:{"layer-id":o.mapboxLayerId,"source-id":o.mapboxLayerSourceId,layer:o.geo_json.layer,source:o.geoJSONLayerSource,replace:o.geo_json.conf.replace,replaceSource:o.geo_json.conf.replace_source}}):o._e()],1)}),[],!1,null,null,null);t.default=v.exports}}]);
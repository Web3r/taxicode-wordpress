(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{438:function(t,e,i){"use strict";i.r(e);var s=i(17),a=i.n(s),o=i(225),n=i(227),r=i(408),c=i.n(r),l=i(409),p=i(6),u=i.n(p),d=i(410);const m={};var h={name:"search",components:{"vue-typeahead-bootstrap":o.a,MglMap:l.b,MglMarker:l.c,MglGeojsonLayer:l.a},props:{postData:[]},data:()=>({journey_options:["One Way","Return"],type_map:{cheapest:"Cheapest Price",exec:"Best Executive",luxury:"Best Luxury",chauffeur:"Best Chauffeur"},journey_type:"One Way",pickup:"",via:"",vialocations:[],pickuplocations:[],destinationlocations:[],destination:"",date:"",time:"",return_date:"",return_time:"",people:"1",quotes:[],journey_id:"",loading:!1,errors:{pickup:!1,destination:!1,date:null,time:null,people:!1},quote_settings:"",asset_url:"",noquotes:!1,quotesloaded:!1,mindate:new Date,accessToken:"pk.eyJ1IjoidGF4aWNvZGUiLCJhIjoiY2p2d2FiMmVoMXpvNjQ4bHE2aGc2ejZibiJ9.7cygLzU4V1K1CH8S_elamQ",mapStyleC:"mapbox://styles/taxicode-testing/cke2xdy4u1chp19n2abb4516w",mapStyleN:"mapbox://styles/mapbox/navigation-night-v1",mapStyleD:"mapbox://styles/mapbox/navigation-day-v1",mapStyleS:"mapbox://styles/mapbox/streets-v11",pickup_coords:[51.509865,-.118092],destination_coords:[51.509865,-.118092],distance:1,geoJsonSource:{type:"geojson",data:{id:"thisIsMySource",type:"Feature",properties:{},geometry:{type:"LineString",coordinates:[[0,0]]}}},geoJsonLayer:{type:"line",layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#0876BA","line-width":4,"line-opacity":1}}}),watch:{pickup:n.a.debounce((function(t){this.locationSearch(t,"pickup")}),500),destination:n.a.debounce((function(t){this.locationSearch(t,"destination")}),500),via:n.a.debounce((function(t){this.locationSearch(t,"via")}),500)},computed:{mapCentre:function(){return[(this.pickup_coords[0]+this.destination_coords[0])/2,(this.pickup_coords[1]+this.destination_coords[1])/2]},mapStyle:function(){return this.mapStyleN}},created(){this.postData=m,this.mapPostToForm(),this.quote_settings="type_class",this.mapbox=c.a,this.asset_url="/taxicode/assets"},mounted(){this.$refs.pickupfield.inputValue=this.pickup,this.$refs.destinationfield.inputValue=this.destination,this.$refs.viafield.inputValue=this.via,this.postData.search_on_load&&this.submitForm()},filters:{readable_date:t=>u()(String(t)).format("ll")},methods:{mapPostToForm:function(){void 0!==this.postData.journey_type&&(this.journey_type=this.postData.journey_type),void 0!==this.postData.pickup&&(this.pickup=this.postData.pickup),void 0!==this.postData.destination&&(this.destination=this.postData.destination),void 0!==this.postData.via&&(this.via=this.postData.via),void 0!==this.postData.date&&(this.date=this.postData.date),void 0!==this.postData.time&&(this.time=this.postData.time),void 0!==this.postData.people&&(this.people=this.postData.people),void 0!==this.postData.return_date&&(this.return_date=this.postData.return_date),void 0!==this.postData.return_time&&(this.return_time=this.postData.return_time)},setPrice:function(t){this.$store.commit("setPrice",t)},queryApi:function(){this.loading=!0,this.noquotes=!1,this.quotesloaded=!1;let t=config.QUOTE_URL+"?key="+tc_public_key+"&pickup="+this.pickup+"&destination="+this.destination+"&date="+this.date+" "+this.time+"&people="+this.people;"Return"==this.journey_type&&(t=t+"&return="+this.return_date+" "+this.return_time),""!=this.via&&(t=t+"&via="+this.via),a.a.get(t).then(function(t){this.loading=!1,0!=t.data.quotes.length?("type_class"==this.quote_settings?this.quotes=this.reduceToTypeAndClass(t.data.quotes):this.quotes=t.data.quotes,this.journey_id=t.data.journey_id,this.pickup_coords=[t.data.journey.pickup.position[1],t.data.journey.pickup.position[0]],this.destination_coords=[t.data.journey.destination.position[1],t.data.journey.destination.position[0]],this.distance=t.data.journey.distance,this.quotesloaded=!0,this.onMapChange()):(this.quotes=[],this.noquotes=!0,this.quotesloaded=!1)}.bind(this))},async onMapChange(){if(void 0!==this.$refs.mpbx){const e=this.$refs.mpbx.actions;await e.fitBounds([this.pickup_coords,this.destination_coords],{animate:!1}),await e.zoomOut();var t="https://api.mapbox.com/directions/v5/mapbox/driving/"+(this.pickup_coords.join(",")+";"+this.destination_coords.join(","))+"?geometries=geojson&access_token="+this.accessToken;a.a.get(t).then(function(t){this.geoJsonSource.data.geometry.coordinates=t.data.routes[0].geometry.coordinates}.bind(this))}},async onMapLoaded(t){const e=t.component.actions;await e.fitBounds([this.pickup_coords,this.destination_coords],{animate:!1}),await e.zoomOut();var i="https://api.mapbox.com/directions/v5/mapbox/driving/"+(this.pickup_coords.join(",")+";"+this.destination_coords.join(","))+"?geometries=geojson&access_token="+this.accessToken;a.a.get(i).then(function(t){this.geoJsonSource.data.geometry.coordinates=t.data.routes[0].geometry.coordinates}.bind(this))},reduceToTypeAndClass:function(t){let e=this.formatQuotes(t),i={};return i.cheapest=e.sorted.recommended[0],i.exec=e.sorted.executive[0],i.luxury=e.sorted.vip[0],i.chauffeur=e.sorted.chauffeur[0],i},formatQuotes:function(t){let e={},i={};for(let s in t){let a=t[s];if(a.active){e[s]=a,a.quote_id=s;for(let t=0;t<a.vehicles.length;t++){let e={...a};e.vehicle=a.vehicles[t],e.vehicle.index=t,e.price=e.vehicle.price;let s=e.vehicle.type.class;delete e.vehicles,i.hasOwnProperty("recommended")||(i.recommended=[]),e.highlight&&(0===t?i.recommended.push(e):e.highlight=!1),i.hasOwnProperty("all")||(i.all=[]),i.all.push(e),i.hasOwnProperty(s)||(i[s]=[]),i[s].push(e)}}}for(let t in i)i[t]=this.sortQuotes(i[t],"SORT_BY_PRICE");return{raw:e,sorted:i}},sortQuotes:function(t,e){switch(e){case"SORT_BY_PRICE":return t.sort((function(t,e){return t.price>e.price?1:e.price>t.price?-1:0}));case"SORT_BY_RATING":return t.sort((function(t,e){return t.rating.score>e.rating.score?-1:e.rating.score>t.rating.score?1:0}));default:return t}},submitForm:function(){this.validQuote()&&this.queryApi()},validQuote(){var t=!0;return""==this.pickup?(this.errors.pickup="Pickup location must be set",t=!1):this.errors.pickup=!1,""==this.destination?(this.errors.destination="Pickup location must be set",t=!1):this.errors.destination=!1,""==this.date?(this.errors.date=!1,t=!1):this.errors.date=null,""==this.time?(this.errors.time=!1,t=!1):this.errors.time=null,""==this.people?(this.errors.people,t=!1):this.errors.people=!1,t},flipImage:function(t,e){let i=this.quotes[t].vehicles[e.target.value].price;this.$refs[t][2].$el.setAttribute("data-price",i),this.$refs[t][0].src=this.quotes[t].vehicles[e.target.value].image,this.$refs[t][1].innerHTML="&pound;"+i+".00",this.setPrice(i+".00")},setPriceBeforeTransition:function(t,e){this.setPrice(e.target.dataset.price+".00")},locationSearch(t,e="pickup"){let i=[],s=[],o=[];a.a.get("https://api.taxicode.com/places/?term="+t).then(a=>{void 0!==a.data.results.STATION&&(s=a.data.results.STATION.map((function(t){return{string:t,type:"station"}}))),void 0!==a.data.results.AIRPORT&&(i=a.data.results.AIRPORT.map((function(t){return{string:t,type:"airport"}}))),void 0!==a.data.results.LOCATION&&(o=a.data.results.LOCATION.map((function(e){let i=Object(d.a)(t);if(i.length>0){let t=Object(d.a)(e);if(t.length>0&&i[0].indexOf(" ")>=0){let i=Object(d.b)(t[0]);e=e.replace(t[0],i)}}return{string:e,type:"location"}})));const n=i.concat(s.concat(o.concat(a.data.results.GOOGLE)));"pickup"==e?this.pickuplocations=n:"via"==e?this.vialocations=n:this.destinationlocations=n})}}},_=i(18),v=Object(_.a)(h,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row justify-content-between"},[i("div",{staticClass:"col-lg-4 pr-3 pr-lg-0 d-none d-lg-block"},[t.pickup_coords.length>0?i("MglMap",{ref:"mpbx",attrs:{center:t.mapCentre,accessToken:t.accessToken,mapStyle:t.mapStyle},on:{load:t.onMapLoaded}},[i("MglMarker",{attrs:{coordinates:t.pickup_coords,color:"blue"}}),t._v(" "),i("MglMarker",{attrs:{coordinates:t.destination_coords,color:"blue"}}),t._v(" "),i("MglGeojsonLayer",{attrs:{sourceId:t.geoJsonSource.data.id,source:t.geoJsonSource,layerId:"myLayer",layer:t.geoJsonLayer}})],1):t._e()],1),t._v(" "),i("div",{staticClass:"col-lg-8 pl-3 pl-lg-0"},[i("div",{staticClass:"form_1"},[i("form",{staticClass:"trav-quote-form",attrs:{id:"taxicode-quote"}},[i("input",{attrs:{name:"tcplugin_include_post",type:"hidden",value:"1"}}),t._v(" "),i("div",{staticClass:"top_form"},[i("b-form-select",{staticClass:"journey",attrs:{title:"One way or Return",options:t.journey_options},model:{value:t.journey_type,callback:function(e){t.journey_type=e},expression:"journey_type"}}),t._v(" "),i("vue-typeahead-bootstrap",{ref:"pickupfield",staticClass:"pickup",attrs:{inputClass:t.errors.pickup?"is-invalid":"",data:t.pickuplocations,serializer:function(t){return t.string},placeholder:"Pickup postcode or place name","max-matches":30},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.pickup,callback:function(e){t.pickup=e},expression:"pickup"}}),t._v(" "),i("vue-typeahead-bootstrap",{ref:"viafield",staticClass:"via-input",attrs:{inputClass:t.errors.via?"is-invalid":"",data:t.vialocations,serializer:function(t){return t.string},placeholder:"Via postcode or place name","max-matches":30},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.via,callback:function(e){t.via=e},expression:"via"}}),t._v(" "),i("vue-typeahead-bootstrap",{ref:"destinationfield",staticClass:"destination",attrs:{inputClass:t.errors.destination?"is-invalid":"",data:t.destinationlocations,serializer:function(t){return t.string},placeholder:"Destination postcode or place name","max-matches":30},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.destination,callback:function(e){t.destination=e},expression:"destination"}})],1),t._v(" "),i("div",{staticClass:"top_form mt-0"},[i("b-form-datepicker",{staticClass:"date",attrs:{locale:"en",min:t.mindate,state:t.errors.date},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}},[i("template",{slot:"button-content"},[i("img",{attrs:{src:"https://www.x0101.co.uk/clients/travaroo/wp-content/uploads/2020/07/form-date.png"}})])],2),t._v(" "),i("b-form-timepicker",{staticClass:"time",attrs:{locale:"en",state:t.errors.time},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}},[i("template",{slot:"button-content"},[i("img",{attrs:{src:"https://www.x0101.co.uk/clients/travaroo/wp-content/uploads/2020/07/form-time.png"}})])],2),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.people,expression:"people"}],staticClass:"form-control",class:t.errors.people?"is-invalid":"",attrs:{type:"number",placeholder:"People"},domProps:{value:t.people},on:{input:function(e){e.target.composing||(t.people=e.target.value)}}}),t._v(" "),i("input",{staticClass:"submit-btn",attrs:{title:"Get Quotes",type:"submit",value:"Get a Quote"},on:{click:t.submitForm}})],1)])]),t._v(" "),i("div",{staticClass:"process_data"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-xl-9"},[i("div",{staticClass:"line_data"}),t._v(" "),i("ul",{staticClass:"list-inline data_line mb-0"},[i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/icon1.png"}}),t._v(" "),i("span",[t._v(t._s(t.journey_type))])]),t._v(" "),i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/icon2.png"}}),t._v(" "),i("span",[t._v(t._s(t.pickup))])]),t._v(" "),i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/icon3.png"}}),t._v(" "),i("span",[t._v(t._s(t.destination))])]),t._v(" "),i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/icon4.png"}}),t._v(" "),i("span",[t._v(t._s(t._f("readable_date")(t.date))+" @ "+t._s(t.time))])]),t._v(" "),i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/icon5.png"}}),t._v(" "),i("span",[t._v(t._s(t.people))])])])]),t._v(" "),t._m(0)])]),t._v(" "),i("div",{staticClass:"car_sec",attrs:{id:"results"}},[t.loading?i("div",[t._v("\n                Loading...\n            ")]):t._e(),t._v(" "),t.noquotes?i("div",[t._v("\n                Sorry, we could not find any quotes for the selected journey.  Please try a different journey.\n            ")]):t._e(),t._v(" "),t.quotesloaded?i("div",{staticClass:"row"},t._l(t.quotes,(function(e,s){return i("div",{staticClass:"col-md-6"},[i("div",{staticClass:"car_box"},[i("h2",{staticClass:"mb-0"},[t._v(t._s(t.type_map[s]))]),t._v(" "),i("div",{staticClass:"car_detail px-4"},[i("div",{staticClass:"car_img py-4 text-center"},[i("img",{ref:e.quote_id,refInFor:!0,attrs:{src:e.vehicle.image,alt:"Vehicle type image"}})]),t._v(" "),i("p",{staticClass:"mb-1"},[t._v(t._s(e.company_name))]),t._v(" "),i("p",[i("img",{attrs:{src:t.asset_url+"/images/star_icon.png"}}),t._v(" ("+t._s(e.rating.ratings)+")")]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col-7"},[i("div",{staticClass:"price_box text-center"},[i("div",{staticClass:"position-relative main_price"},[i("span",[t._v("£")]),t._v(t._s(e.price)+"\n                                        ")]),t._v(" "),i("p",[t._v("£"+t._s((e.price/t.distance).toFixed(2))+" per mile")])])]),t._v(" "),i("div",{staticClass:"col-5"},[i("div",{staticClass:"price_box text-center"},[i("ul",{staticClass:"list-inline mb-0 small_box"},[i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/price_icon1.png"}})]),t._v(" "),i("li",{staticClass:"list-inline-item"},[t._v(t._s(e.vehicle.passengers))])])]),t._v(" "),i("div",{staticClass:"price_box mt-2 text-center"},[i("ul",{staticClass:"list-inline mb-0 small_box"},[i("li",{staticClass:"list-inline-item"},[i("img",{attrs:{src:t.asset_url+"/images/price_icon2.png"}})]),t._v(" "),i("li",{staticClass:"list-inline-item"},[t._v(t._s(e.vehicle.luggage_small))])])])])]),t._v(" "),i("router-link",{ref:e.quote_id,refInFor:!0,staticClass:"booknow mt-3",attrs:{"data-price":e.price,to:{name:"Checkout",params:{quote_id:e.quote_id,journey_id:t.journey_id}}},nativeOn:{click:function(e){return t.setPriceBeforeTransition(t.id,e)}}},[t._v("Book Now")])],1)])])})),0):t._e()])])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"col-md-12 pr-3 pr-lg-0 d-block d-lg-none"},[e("img",{attrs:{src:"image/map.jpg"}})])}],!1,null,null,null);e.default=v.exports}}]);
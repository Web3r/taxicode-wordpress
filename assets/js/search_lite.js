(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{15:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"c",(function(){return n})),o.d(t,"f",(function(){return r})),o.d(t,"e",(function(){return s})),o.d(t,"b",(function(){return a}));const i={base:{fontFamily:"'Muli', sans-serif",fontSize:"14px",color:"#333"},invalid:{color:"red"}},n=(e,t)=>{if(t){console.log("stripe_cardform_style",e.stripe_cardform_style),console.info("type",typeof e.stripe_cardform_style);try{console.log("parse attempt",JSON.parse(e.stripe_cardform_style))}catch(e){console.error(e)}}return{biq_pk:e.taxicode_public,biq_api_host:e.biq_api_host,paypal_pk:e.paypal_public,stripe_pk:e.stripe_public,stripe_cardform_style:e.stripe_cardform_style,booking_test_mode:"1"==e.test_mode,quote_type:e.quote_type,recommend_upgrade:"1"==e.recommend_upgrade,complete_page_text:e.complete_page_text}},r=e=>({headers:{"X-WP-Nonce":e}}),s=function(e,t){this.appDebugEnabled&&(console.group("Updating BIQ App Settings"),console.log("BIQ App Settings",{...this.settings}),console.log("New BIQ Settings",e));const o="function"==typeof t?t.call(this,e):n(e,this.appDebugEnabled);this.settings=o,this.appDebugEnabled&&(console.info("Updated Settings"),console.log("Settings",o),console.log("BIQ App Settings",{...this.settings}),console.groupEnd())},a={LIVE_API_HOST:"https://api.taxicode.com/",TEST_API_HOST:"https://api.stagingtaxis.co.uk/",PLACES_URI:"places/?term=",AUTH_URI:"auth/",QUOTE_URI:"booking/quote/",JOURNEY_URI:"booking/journey/?id=",CLIENT_SECRET_URI:"booking/client_gateway_secret/",PAYMENT_URI:"booking/pay/",PGH_CONF:{hidePostalCode:!0}};t.d=a},157:function(e,t,o){},17:function(e,t,o){"use strict";o.d(t,"a",(function(){return c})),o.d(t,"e",(function(){return d})),o.d(t,"d",(function(){return p})),o.d(t,"c",(function(){return h})),o.d(t,"b",(function(){return g}));const i=(e,t)=>e.price>t.price?1:t.price>e.price?-1:0,n=(e,t)=>e.rating.score>t.rating.score?-1:t.rating.score>e.rating.score?1:0,r=(e,t)=>{switch(t){case"SORT_BY_PRICE":return e.sort(i);case"SORT_BY_RATING":return e.sort(n);default:return e}};const s=(e,t,o)=>{const i=[];console.group("Formatting BIQ Quotes"),console.log("Quotes",{...e}),console.log("Type",t),console.log("Sort Order",o),Object.keys(e).forEach(o=>{const n={...e[o],quote_id:o,selected_vehicle:0};("best"!=t||"best"==t&&n.highlight)&&i.push(n)});const n=r(i,o);return console.log("Sorted",n),console.groupEnd(),n},a=(e,t)=>{console.group("Reducing BIQ Quotes to type & class only"),console.log("Quotes",{...e}),console.log("Sort Order",t);const o=u(e,t);console.log({...o});const i=o.sorted,n={};return i.hasOwnProperty("recommended")&&i.recommended.length&&(n.cheapest=i.recommended[0]),i.hasOwnProperty("executive")&&i.executive.length&&(n.exec=i.executive[0]),i.hasOwnProperty("vip")&&i.vip.length&&(n.luxury=i.vip[0]),i.hasOwnProperty("chauffeur")&&i.chauffeur.length&&(n.chauffeur=i.chauffeur[0]),console.log("Sorted",n),console.groupEnd(),n},u=(e,t)=>{let o={},i={};for(let t in e){let n=e[t];if(n.active){o[t]=n,n.quote_id=t;for(let e=0;e<n.vehicles.length;e++){let t={...n};t.selected_vehicle=e,t.vehicle=n.vehicles[e],t.vehicle.index=t.selected_vehicle,t.price=t.vehicle.price;let o=t.vehicle.type.class;delete t.vehicles,i.hasOwnProperty("recommended")||(i.recommended=[]),t.highlight&&(0===e?i.recommended.push(t):t.highlight=!1),i.hasOwnProperty("all")||(i.all=[]),i.all.push(t),i.hasOwnProperty(o)||(i[o]=[]),i[o].push(t)}}}for(let e in i)i[e]=r(i[e],t);return{raw:o,sorted:i}};var l=o(18);const c="SORT_BY_PRICE",d={biqQuotesSearched:{name:"biqQuotesSearched"},biqZeroQuotes:{name:"biqZeroQuotes"},biqQuotesError:{name:"biqQuotesError"}},p={biqQuoteBookNow:{name:"biqQuoteBookNow"}},h=(e,t,o)=>({type:t,quotes:"type_class"==t?a(e,"SORT_BY_PRICE"):s(e,t,o)}),g=()=>({quoting:!1,quotes_loaded:!1,api_error:!1,journey_id:"",journey_details:Object(l.d)(l.a),journey_quotes:{}})},18:function(e,t,o){"use strict";o.d(t,"a",(function(){return n})),o.d(t,"d",(function(){return r})),o.d(t,"f",(function(){return s})),o.d(t,"g",(function(){return a})),o.d(t,"b",(function(){return u})),o.d(t,"c",(function(){return l})),o.d(t,"e",(function(){return c}));const i={string:"",postcode:"",position:[0,0]},n={pickup:i,destination:i,vias:[],people:1,return:!1,date:"",distance:1,duration:116,duration_text:"1 min",quote_type:"mileage",is_airport:!1,hourly:!1},r=e=>({pickup:e.pickup,destination:e.destination,vias:e.vias,people:e.people,return:e.return,date:e.date,distance:e.distance,duration:e.duration,duration_text:e.duration_text,quote_type:e.quote_type,is_airport:e.is_airport,hourly:e.hourly}),s=e=>null!==e?e.toDateString():"",a=e=>null!==e?e.toLocaleTimeString():"",u=e=>new Date(Date.parse(e)),l=e=>s(u(e)),c=e=>a(u(e))},26:function(e,t,o){"use strict";var i=o(25),n=o.n(i);const r={props:{appURL:{type:String,required:!0,default:"//"},appDebugEnabled:{type:Boolean,default:!1}},computed:{appSettings:function(){return{...this.settings}}},methods:{getAppSettings:function(e,t){const o=this,i=this.appURL+"settings/";this.appDebugEnabled&&console.group(`Loading App Settings from '${i}'`);const r="function"==typeof e?e.call(this):{};n.a.get(i,r).then(e=>{o.appSettingsUpdated(e.data,t),o.initialised=!0}).catch(e=>{o.appDebugEnabled&&(console.info("Updated Settings Error"),console.log(e)),console.error(e)}).finally(()=>{o.appDebugEnabled&&console.groupEnd()})},appSettingsUpdated:function(e,t){this.appDebugEnabled&&(console.group("Updating App Settings"),console.log("App Settings",{...this.settings}),console.log("New Settings",e));const o="function"==typeof t?t.call(this,e):{...e};this.settings=o,this.appDebugEnabled&&(console.info("Updated Settings"),console.log("Settings",o),console.log("App Settings",{...this.settings}),console.groupEnd())}},data:()=>({initialised:!1,settings:{}})};t.a=r},265:function(e,t,o){"use strict";o.r(t);var i=o(46),n=(o(157),o(13)),r=o(20),s=o(26),a=o(15),u=o(88);var l={name:"BIQAppSearchLite",version:"1.0.1",props:{biqAppConfig:{type:Object,required:!0,default:function(){return{biq:a.b}}},biqSearchTarget:{type:String,required:!0,default:"/booking-instant-quotes/"}},computed:{...Object(r.c)(["searchDetails","searchOnLoad","hasSearchResults","displayType","displayQuotes","loadingQuotes","quotesError","quotesLoaded","zeroQuotes","journeyID","journeyDetails","journeyDate","journeyTime","journeyHasReturn","journeyReturnDate","journeyReturnTime","journeyHasVias","journeyQuotes"]),appConfig:function(){return{...this.biqAppConfig}},placesLookup:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.PLACES_URI}`},quotesFrom:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.QUOTE_URI}`}},methods:{appSettingsUpdated:a.e,...Object(r.b)(["resetSearch","searchingQuotes","searchedQuotes","changeDisplayType","resetQuotes","quoting","apiQuotesError","quoted"]),onSearchQuotes:function(e){if(!e.data.validate())return e.preventDefault();this.$store.commit("searchForQuotes",e.data.formValues())}},mixins:[s.a],components:{"the-biq-search-form":u.a},data(){return{...s.a.data.call(this),settings:{biq_api_host:this.biqAppConfig.biq.LIVE_API_HOST,biq_pk:"",paypal_pk:"",stripe_pk:"",stripe_cardform_style:a.a,booking_test_mode:!1,quote_type:"",recommend_upgrade:!1,complete_page_text:""},app_title:"Booking Instant Quotes - Search Lite v1.0.1",search_on_load:!1}},created(){this.getAppSettings()}},c=o(19),d=Object(c.a)(l,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"biq-search-lite-vue-app"}},[e.initialised?o("the-biq-search-form",{attrs:{"biq-public-key":e.appSettings.biq_pk,"biq-places-lookup":e.placesLookup,"biq-quotes-from":e.quotesFrom,"search-on-load":e.search_on_load,debugging:e.appDebugEnabled,layout:"compact",action:e.biqSearchTarget,method:"GET"},on:{submit:e.onSearchQuotes}}):e._e()],1)}),[],!1,null,null,null).exports,p=o(49),h=o(48);new n.default({store:p.a,render:e=>e(d,{props:{appURL:biqAppURL,appDebugEnabled:i.a||biqAppDebugEnabled,biqAppConfig:h.a,biqSearchTarget:biqSearchTarget}}),el:"#biq-vue-app"})},29:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"c",(function(){return s})),o.d(t,"b",(function(){return c}));const i="Return",n=["One Way",i],r=n[0],s=e=>({journey_type:{selected:r,options:n,label:"Journey type",required:!1,error:null,errorMsg:"",id:e+"-journey",placeholder:""},pickup:{value:"",label:"Pickup",required:!0,error:null,errorMsg:"Pickup location must be set",id:e+"-pickup",placeholder:"Pickup postcode or place name"},destination:{value:"",label:"Destination",required:!0,error:null,errorMsg:"Destination location must be set",id:e+"-destination",placeholder:"Destination postcode or place name"},via:{value:"",label:"(Optional) Via",required:!1,error:null,errorMsg:"",id:e+"-via",placeholder:"Via postcode or place name"},people:{value:"1",label:"Number of People",required:!0,error:null,errorMsg:"Invalid number of people travelling",id:e+"-people",placeholder:""}}),a=(e,t,o)=>(e.setDate(e.getDate()+t),e.setHours(e.getHours()+o),e),u=()=>a(new Date,1,2),l=e=>e<10?"0"+e:e,c=()=>{const e=u();return{search_details:{journey_type:r,pickup:"",vias:[],destination:"",date:e.getFullYear()+"-"+l(e.getMonth()+1)+"-"+l(e.getDate()),time:l(e.getHours())+":"+l(e.getMinutes())+":"+l(e.getSeconds()),people:"1",returning:{date:"",time:""}},search_on_load:!1,results:!1,display_type:"",display_quotes:[]}}},35:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"b",(function(){return n})),o.d(t,"e",(function(){return a})),o.d(t,"f",(function(){return u})),o.d(t,"c",(function(){return l})),o.d(t,"d",(function(){return c}));const i="Pay with Card",n="Pay with Paypal",r=[i,n],s=i,a=e=>({method:{selected:s,options:r,label:"Select Payment Method:",errorMsg:"Invalid Payment Method",id:e+"-method"}}),u={submit:{name:"submit"},transactionSuccess:{name:"transactionSuccess"},transactionError:{name:"transactionError"}},l={biqCheckoutSubmit:{name:"biqCheckoutSubmit"},biqCheckoutComplete:{name:"biqCheckoutComplete"},biqCheckoutError:{name:"biqCheckoutError"}},c=()=>({processing:!1,processed:!1,basket:{quote_id:"",vehicle_index:0,amount:0},quote:{},vehicle:{},booking_ref:""})},46:function(e,t,o){"use strict";o.d(t,"a",(function(){return l}));var i=o(13),n=o(67),r=o(47),s=(o(91),o(92),o(27)),a=o(23),u=o(65);o(70),o(71),o(72);const l=!1;i.default.config.productionTip=!1,i.default.config.devtools=l,i.default.use(n.a),i.default.use(r.a),s.c.add(a.b,a.d,a.a,a.e,a.c),i.default.component("font-awesome-icon",u.a)},48:function(e,t,o){"use strict";const i={biq:{...o(15).d},BOOKING_DETALS_URI:"booking-details/?booking_ref="};t.a=i},49:function(e,t,o){"use strict";var i=o(13),n=o(20),r=o(66),s=o(29),a=o(17);var u={state:Object(s.b)(),getters:{searchDetails:e=>e.search_details,searchOnLoad:e=>e.search_on_load,hasSearchResults:e=>e.results,displayType:e=>e.display_type,displayQuotes:e=>e.display_quotes},actions:{resetSearch({commit:e,dispatch:t}){t("resetQuotes",null,{root:!0}),e("resetSearchState")},searchingQuotes({commit:e,dispatch:t},o){e("resetSearchState"),t("quoting",null,{root:!0}),e("searchingQuotesFor",o)},searchedQuotes({commit:e,dispatch:t},o){t("quoted",o,{root:!0}),o.count&&e("displaying",Object(a.c)(o.quotes,o.display_type,a.a))},changeDisplayType({commit:e,rootGetters:t},o){e("displaying",Object(a.c)(t.journeyQuotes,o,a.a))}},mutations:{resetSearchState(e){Object.assign(e,Object(s.b)())},searchingQuotesFor(e,t){e.search_details=t},searchForQuotes(e,t){e.search_details=t,e.search_on_load=!0},displaying(e,t){e.display_quotes=t.quotes,e.display_type=t.type,e.results=!0}}},l=o(18);var c={state:Object(a.b)(),getters:{loadingQuotes:e=>e.quoting,quotesError:e=>e.api_error,quotesLoaded:e=>e.quotes_loaded,zeroQuotes:e=>!!e.quotes_loaded&&0===Object.keys(e.journey_quotes).length,journeyID:e=>e.journey_id,journeyDetails:e=>e.journey_details,journeyDate:e=>Object(l.c)(e.journey_details.date),journeyTime:e=>Object(l.e)(e.journey_details.date),journeyReturnDate:e=>e.journey_details.return&&Object(l.c)(e.journey_details.return),journeyReturnTime:e=>e.journey_details.return&&Object(l.e)(e.journey_details.return),journeyHasReturn:e=>!!e.journey_details.return,journeyHasVias:e=>Array.isArray(e.journey_details.vias)&&e.journey_details.vias.length>0,journeyQuotes:e=>e.journey_quotes},actions:{resetQuotes({commit:e}){e("resetQuotesState")},quoting({commit:e,dispatch:t}){e("resetQuotesState"),t("resetCheckout",null,{root:!0}),e("searching")},apiQuotesError({commit:e},t){e("quotesError",{api_error:t}),e("searched")},quoted({commit:e},t){e("searched"),e("quotes",t)}},mutations:{resetQuotesState(e){Object.assign(e,Object(a.b)())},searching(e){e.quoting=!0},quotesError(e,t){e.api_error=t.api_error},searched(e){e.quoting=!1},quotes(e,t){e.journey_id=t.journey_id,e.journey_quotes=t.quotes,e.journey_details=Object(l.d)(t.journey),e.quotes_loaded=!0}}},d=o(35);var p={search:u,quotes:c,checkout:{state:Object(d.d)(),getters:{processed:e=>e.processed,processing:e=>e.processing,basket:e=>({quote:e.basket.quote_id,vehicle:e.basket.vehicle_index,price:e.basket.amount}),quoteID:e=>e.basket.quote_id,vehicleIndex:e=>e.basket.vehicle_index,price:e=>e.basket.amount,quoteData:e=>e.quote,quoteVehicleData:e=>e.vehicle,bookingRef:e=>e.booking_ref},actions:{resetCheckout({commit:e}){e("resetCheckoutState")},bookNow({commit:e},t){e("resetCheckoutState"),e("buildBasket",t)},booking({commit:e}){e("processing",{processing:!0,processed:!1})},bookingFailed({commit:e}){e("processing",{processing:!1,processed:!1})},booked({commit:e},t){e("resetCheckoutState"),e("processing",{processing:!1,processed:!1}),e("booked",{p:t})}},mutations:{resetCheckoutState(e){Object.assign(e,Object(d.d)())},buildBasket(e,t){e.basket.quote_id=t.quote,e.basket.vehicle_index=t.vehicle,e.basket.amount=t.quote_data.vehicles[t.vehicle].price,e.quote=t.quote_data,e.vehicle=t.quote_data.vehicles[t.vehicle]},processing(e,t){e.processing=t.processing,e.processed=t.processed},booked(e,t){e.booking_ref=t.booking_ref}}}};i.default.use(n.a);t.a=new n.a.Store({modules:{BIQSearchStateStore:p.search,BIQQuotesStateStore:p.quotes,BIQCheckoutStateStore:p.checkout},plugins:[Object(r.a)({paths:["BIQSearchStateStore","BIQQuotesStateStore","BIQCheckoutStateStore"],storage:window.localStorage})]})},51:function(e,t,o){"use strict";o.d(t,"c",(function(){return n})),o.d(t,"a",(function(){return r}));const i={validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},values:{type:Object,default:function(){return{}}},debugging:{type:Boolean,default:!1}},n={submit:{name:"submit"},validated:{name:"validated"},validationError:{name:"validationError"}},r={props:i,methods:{validate:function(){return this.validateValues()},specialValidationErrors:function(){return{}},specialInputValues:function(){return{}},errorStateClass:function(e){return null==this.fields[e].error?"":this.fields[e].error?this.errorClass:this.validClass},setFieldValues:function(){const e=this;this.debugging&&(console.group(`Setting ${this.$options._componentTag} values`),console.log("Fields Before",{...this.fields}),console.log("Values",this.values)),Object.keys(this.values).forEach(t=>{if(!e.fields.hasOwnProperty(t))return void(e.debugging&&console.info(`${e.$options._componentTag} does not contain field '${t}'`));const o=e.fields[t].hasOwnProperty("value")?"value":"selected";e.fields[t][o]=e.values[t]}),this.debugging&&(console.log("Fields After",{...this.fields}),console.groupEnd())},validateValues:function(){const e=this;let t=0;return this.debugging&&console.group(`Validating ${this.$options._componentTag} values`),Object.keys(this.fields).forEach(o=>{if(e.fields[o].error=null,!e.fields[o].required)return;const i=e.fields[o].hasOwnProperty("value")?"value":"selected";""==e.fields[o][i]?(e.fields[o].error=e.fields[o].errorMsg,e.debugging&&console.info(`Invalid field value for '${o}' -- ${e.fields[o].error}`),t++):e.fields[o].error=""}),this.debugging&&console.groupEnd(),0==t},validationErrors:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{t[o]=e.fields[o].error}),{...this.specialValidationErrors(),...t}},inputValues:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{const i=e.fields[o].hasOwnProperty("value")?"value":"selected";t[o]=e.fields[o][i]}),{...this.specialInputValues(),...t}}},data:()=>({fields:{}})};t.b=r},52:function(e,t,o){"use strict";o.d(t,"b",(function(){return a})),o.d(t,"c",(function(){return u})),o.d(t,"a",(function(){return l}));var i=o(25),n=o.n(i);const r=(e,t,o,i)=>{if(i&&console.log("BIQ API response for - "+e,o),"OK"!=o.data.status)throw new ErrorEvent(o.data.status,{error:new Error("BIQ API Error"),message:o.data[o.data.status.toLowerCase()]});return o.data},s=(e,t,o,i)=>({data:{URL:e,key:t,message:i||o.message,error:o}}),a=(e,t,o,i,a)=>new Promise((u,l)=>{n.a.get(`${e}${o}&key=${t}`).then(t=>r(e,0,t,a)).then(e=>e.results).then(e=>{let t=[],o=[],n=[];void 0!==e.AIRPORT&&(t=e.AIRPORT.map(e=>i(e,"airport"))),void 0!==e.STATION&&(o=e.STATION.map(e=>i(e,"station"))),void 0!==e.LOCATION&&(n=e.LOCATION.map(e=>i(e,"location")));const r=e.GOOGLE.map(e=>i(e.string,e.poi?"poi":"general"));u(t.concat(o,n,r))}).catch(o=>{const i=o.message||"Unknown";l(s(e,t,o,"BIQ Places lookup API Error - "+i))})}),u=(e,t,o,i)=>{let a=`pickup=${o.pickup}&destination=${o.destination}&date=${o.date} ${o.time}&people=${o.people}`;return o.hasReturn&&(a=`${a}&return=${o.returning.date} ${o.returning.time}`),o.vias.length&&(a=`${a}&via=${o.vias[0]}`),new Promise((o,u)=>{n.a.get(`${e}?key=${t}&${a}`).then(t=>r(e,0,t,i)).then(e=>{const t={journey_id:e.journey_id,journey:e.journey,quotes:e.quotes,count:Object.keys(e.quotes).length};t.count||(t.warnings=e.warnings),o(t)}).catch(o=>{const i=o.message||"Unknown";u(s(e,t,o,"BIQ Quotes Search API Error - "+i))})})},l=(e,t,o,i)=>{o.append("key",t);const a={headers:{"Content-Type":"application/application/x-www-form-urlencoded"}};return new Promise((u,l)=>{n.a.post(e,o,a).then(t=>r(e,0,t,i)).then(e=>u(e)).catch(i=>{const n=i.message||"Unknown",r=s(e,t,i,"BIQ API Booking Error - "+n);r.data.type="booking",r.data.booking={token:o.get("token"),method:o.get("method"),formData:o},l(r)})})}},68:function(e,t,o){"use strict";o.d(t,"c",(function(){return m})),o.d(t,"b",(function(){return f}));var i=o(20),n=o(51),r=o(29),s=o(17),a=o(52),u=o(129),l=o(128);const c={name:"input"},d={name:"biqPlacesLookupError"};var p={name:"PlacesLookup",components:{"vue-typeahead-bootstrap":l.a},props:{biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqPublicKey:{type:String,required:!0,default:""},id:{type:String,default:"biq-places-lookup"},placeholder:{type:String,default:"Location postcode or place name"},label:{type:String,default:""},value:{type:String,default:""},required:{type:Boolean,default:!1},size:{type:String,default:null,validator:e=>["lg","sm"].indexOf(e)>-1},containerClass:{type:String,default:""},validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},debugging:{type:Boolean,default:!1}},data:()=>({locations:[],force_lookup:!0}),updated(){this.force_lookup?this.locationSearch(this.value):this.$refs.locationfield.inputValue=this.value},watch:{location:{handler:u.a.debounce((function(e){this.locationSearch(e)}),500),immediate:!0}},computed:{location:{get(){return this.value},set(e){this.$emit(c.name,e)}},inputID:function(){return this.id+"-input"},errorStateClass:function(){const e=null==this.errorState?"":this.errorState?this.errorClass:this.validClass;return`${this.id} ${e}`}},methods:{locationSearch:function(e){if(null===e||"string"!=typeof e||e.length<1)return;this.debugging&&(console.info(),console.log(`BIQ Places ${this.label} lookup to API '${this.biqPlacesLookup}'`,e)),this.force_lookup=!1,this.$refs.locationfield.inputValue=e;const t=this;Object(a.b)(this.biqPlacesLookup,this.biqPublicKey,e,(e,t)=>({string:e,type:t}),this.debugging).then(e=>{t.locations=e}).catch(e=>{t.locations=[],t.$emit(d.name,e)})},validate:function(){return!(this.required&&(null==this.value||""==this.value))}}},h=o(19),g=Object(h.a)(p,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{class:e.containerClass},[e.label?o("label",{attrs:{id:e.inputID,for:e.id}},[e._v(e._s(e.label))]):e._e(),e._v(" "),o("vue-typeahead-bootstrap",{ref:"locationfield",attrs:{id:e.id,placeholder:e.placeholder,size:e.size,inputClass:e.errorStateClass,"show-all-results":!0,"show-on-focus":!0,data:e.locations,serializer:function(e){return e.string}},on:{hit:function(t){e.selectedLocation=t}},scopedSlots:e._u([{key:"suggestion",fn:function(t){var i=t.data,n=t.htmlText;return[o("div",{staticClass:"d-flex align-items-center"},["station"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"plane"}})],1):o("span",[o("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),e._v(" "),o("span",{staticClass:"ml-4",domProps:{innerHTML:e._s(n)}})])]}}]),model:{value:e.location,callback:function(t){e.location=t},expression:"location"}},[o("template",{slot:"prepend"}),e._v(" "),e._v(" "),o("template",{slot:"append"})],2)],1)}),[],!1,null,null,null).exports;const m={biqPublicKey:{type:String,required:!0,default:""},biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqQuotesFrom:{type:String,required:!0,default:"//booking/quote/"},idPrefix:{type:String,default:"biq"},searchOnLoad:{type:Boolean,default:!1},debugging:{type:Boolean,default:!1}},f={...n.c,...s.e},b={hasReturn:function(){return this.fields.journey_type.selected===r.a}},y={journeyDateTimeErrorState:function(e){return null!==this.errors[e]?!this.errors[e].length:null},onPlacesLookupError:function(e){this.debugging&&(console.group(e.data.message),console.log(e),console.groupEnd())}},_={props:{...n.a.props,...m},components:{"biq-places-lookup":g,"biq-process-form-submit":()=>o.e(7).then(o.bind(null,267))},data(){return{fields:Object(r.c)(this.idPrefix),date:"",time:"",return_date:"",return_time:"",errors:{date:null,time:null,return_date:null,return_time:null},date_picker_formats:{short:{year:"numeric",month:"short",day:"2-digit"},medium:{year:"numeric",month:"short",day:"2-digit",weekday:"short"}}}},mounted(){this.setFieldValues(),this.searchOnLoad&&this.onSearchQuotesFormSubmit({})},computed:{...Object(i.c)(["searchDetails","loadingQuotes"]),...b},methods:{...Object(i.b)(["searchingQuotes","apiQuotesError"]),...n.a.methods,...y,setFieldValues:function(){const e=this.searchDetails;this.debugging&&console.log("BIQ Search Form from State",e),this.fields.journey_type.selected=e.journey_type,this.fields.pickup.value=e.pickup,this.fields.destination.value=e.destination,e.vias.length&&(this.fields.via.value=e.vias[0]),this.fields.people.value=e.people,this.date=e.date,this.time=e.time,this.hasReturn&&null!==e.returning.date&&(this.return_date=e.returning.date),this.hasReturn&&null!==e.returning.time&&(this.return_time=e.returning.time),this.$nextTick(()=>{this.$refs.pickupfield.inputValue=this.fields.pickup.value,this.$refs.destinationfield.inputValue=this.fields.destination.value,this.$refs.viafield.inputValue=this.fields.via.value})},onSearchQuotesFormSubmit:function(e){e.data={validate:()=>this.validate(),formValues:()=>this.formValues(),defaultAction:()=>{this.validate()&&this.searchApiQuotes(this.formValues())},searchApiQuotes:()=>this.searchApiQuotes(this.formValues())},this.$emit(f.submit.name,e)},validate:function(){this.errors={date:null,time:null,return_date:null,return_time:null};let e=0;this.validateValues()||e++,null!=this.date&&""!=this.date||(this.errors.date="Journey date is invalid",e++),null!=this.time&&""!=this.time||(this.errors.time="Journey time is invalid",e++),this.hasReturn&&(null!=this.return_date&&""!=this.return_date||(this.errors.return_date="Journey return date is invalid",e++),null!=this.return_time&&""!=this.return_time||(this.errors.return_time="Journey return time is invalid",e++));const t=0===e;return this.emitValidationEvent(t),t},emitValidationEvent:function(e){let t=f.validated.name;const o={data:{values:{...this.inputValues()}}};e||(t=f.validationError.name,o.data.errors={...this.validationErrors(),...this.errors},this.debugging&&(console.group("BIQ Search Form Validation Error"),console.log("Validation Error Fields",{...this.validationErrors()}),console.log("Validation Error",o.data.errors),console.groupEnd())),this.$emit(t,o)},formValues:function(){const e=this.inputValues(),t={journey_type:e.journey_type,pickup:e.pickup,destination:e.destination,people:e.people,date:this.date,time:this.time,hasReturn:this.hasReturn};t.hasReturn?t.returning={date:this.return_date,time:this.return_time}:t.returning={date:null,time:null};const o=this.fields.via.value;return t.vias=""!=o?[o]:[],t},searchApiQuotes:function(e){const t=this;this.searchingQuotes(e),this.debugging&&console.group(`Searching BIQ API Quotes from '${this.biqQuotesFrom}'`),Object(a.c)(this.biqQuotesFrom,this.biqPublicKey,e,this.debugging).then(e=>{const o=e.count?f.biqQuotesSearched.name:f.biqZeroQuotes.name;t.$emit(o,e),t.debugging&&(console.info("BIQ API Quotes Searched"),console.groupEnd())}).catch(e=>{t.$emit(f.biqQuotesError.name,e),t.debugging&&(console.info("BIQ API Quotes Search Error"),console.groupEnd())})}}};t.a=_},70:function(e,t,o){},71:function(e,t,o){},72:function(e,t,o){},88:function(e,t,o){"use strict";var i=o(68);const n={column:{name:"column",tag:"the-biq-search-form-column",component:()=>o.e(13).then(o.bind(null,281))},compact:{name:"compact",tag:"the-biq-search-form-compact",component:()=>o.e(14).then(o.bind(null,282))}},r={...i.c,layout:{type:String,default:n.compact.name,required:!0,validator:e=>Object.keys(n).indexOf(e)>-1}},s={...i.b};var a={name:"TheSearchForm",props:r,computed:{useLayout:function(){switch(this.layout){case n.compact.name:return n.compact.tag;case n.column.name:return n.column.tag}}},methods:{validate:function(){return this.$refs.searchForm.validate()},formValues:function(){return this.$refs.searchForm.formValues()},onSubmit:function(e){this.$emit(s.submit.name,e)},onValidated:function(e){this.$emit(s.validated.name,e)},onValidationError:function(e){this.$emit(s.validationError.name,e)},onBiqQuotesSearched:function(e){this.$emit(s.biqQuotesSearched.name,e)},onBiqZeroQuotes:function(e){this.$emit(s.biqZeroQuotes.name,e)},onBiqQuotesError:function(e){this.$emit(s.biqQuotesError.name,e)}},components:{...(e=>{const t=Object.keys(e).map(t=>[e[t].tag,e[t].component]);return Object.fromEntries(t)})(n)}},u=o(19),l=Object(u.a)(a,(function(){var e=this,t=e.$createElement;return(e._self._c||t)(e.useLayout,{ref:"searchForm",tag:"component",attrs:{"biq-public-key":e.biqPublicKey,"biq-places-lookup":e.biqPlacesLookup,"biq-quotes-from":e.biqQuotesFrom,"search-on-load":e.searchOnLoad,debugging:e.debugging,"id-prefix":"biq"},on:{submit:e.onSubmit,validated:e.onValidated,validationError:e.onValidationError,biqQuotesSearched:e.onBiqQuotesSearched,biqZeroQuotes:e.onBiqZeroQuotes,biqQuotesError:e.onBiqQuotesError}})}),[],!1,null,null,null);t.a=l.exports}},[[265,1,0]],[7]]);
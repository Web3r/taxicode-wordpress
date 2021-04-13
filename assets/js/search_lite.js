(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{156:function(e,t,o){},16:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"c",(function(){return r})),o.d(t,"f",(function(){return n})),o.d(t,"e",(function(){return s})),o.d(t,"b",(function(){return a}));const i={base:{fontFamily:"'Muli', sans-serif",fontSize:"14px",color:"#333"},invalid:{color:"red"}},r=(e,t)=>{if(t){console.log("stripe_cardform_style",e.stripe_cardform_style),console.info("type",typeof e.stripe_cardform_style);try{console.log("parse attempt",JSON.parse(e.stripe_cardform_style))}catch(e){console.error(e)}}return{biq_pk:e.taxicode_public,biq_api_host:e.biq_api_host,paypal_pk:e.paypal_public,stripe_pk:e.stripe_public,stripe_cardform_style:e.stripe_cardform_style,booking_test_mode:"1"==e.test_mode,quote_type:e.quote_type,recommend_upgrade:"1"==e.recommend_upgrade,complete_page_text:e.complete_page_text}},n=e=>({headers:{"X-WP-Nonce":e}}),s=function(e,t){this.appDebugEnabled&&(console.group("Updating BIQ App Settings"),console.log("BIQ App Settings",{...this.settings}),console.log("New BIQ Settings",e));const o="function"==typeof t?t.call(this,e):r(e,this.appDebugEnabled);this.settings=o,this.appDebugEnabled&&(console.info("Updated Settings"),console.log("Settings",o),console.log("BIQ App Settings",{...this.settings}),console.groupEnd())},a={LIVE_API_HOST:"https://api.taxicode.com/",TEST_API_HOST:"https://api.stagingtaxis.co.uk/",PLACES_URI:"places/?term=",AUTH_URI:"auth/",QUOTE_URI:"booking/quote/",JOURNEY_URI:"booking/journey/?id=",CLIENT_SECRET_URI:"booking/client_gateway_secret/",PAYMENT_URI:"booking/pay/",PGH_CONF:{hidePostalCode:!0}};t.d=a},17:function(e,t,o){"use strict";o.d(t,"a",(function(){return c})),o.d(t,"e",(function(){return d})),o.d(t,"d",(function(){return p})),o.d(t,"c",(function(){return h})),o.d(t,"b",(function(){return g}));const i=(e,t)=>e.price>t.price?1:t.price>e.price?-1:0,r=(e,t)=>e.rating.score>t.rating.score?-1:t.rating.score>e.rating.score?1:0,n=(e,t)=>{switch(t){case"SORT_BY_PRICE":return e.sort(i);case"SORT_BY_RATING":return e.sort(r);default:return e}};const s=(e,t,o)=>{const i=[];console.group("Formatting BIQ Quotes"),console.log("Quotes",{...e}),console.log("Type",t),console.log("Sort Order",o),Object.keys(e).forEach(o=>{const r={...e[o],quote_id:o,selected_vehicle:0};("best"!=t||"best"==t&&r.highlight)&&i.push(r)});const r=n(i,o);return console.log("Sorted",r),console.groupEnd(),r},a=(e,t)=>{console.group("Reducing BIQ Quotes to type & class only"),console.log("Quotes",{...e}),console.log("Sort Order",t);const o=u(e,t);console.log({...o});const i=o.sorted,r={};return i.hasOwnProperty("recommended")&&i.recommended.length&&(r.cheapest=i.recommended[0]),i.hasOwnProperty("executive")&&i.executive.length&&(r.exec=i.executive[0]),i.hasOwnProperty("vip")&&i.vip.length&&(r.luxury=i.vip[0]),i.hasOwnProperty("chauffeur")&&i.chauffeur.length&&(r.chauffeur=i.chauffeur[0]),console.log("Sorted",r),console.groupEnd(),r},u=(e,t)=>{let o={},i={};for(let t in e){let r=e[t];if(r.active){o[t]=r,r.quote_id=t;for(let e=0;e<r.vehicles.length;e++){let t={...r};t.selected_vehicle=e,t.vehicle=r.vehicles[e],t.vehicle.index=t.selected_vehicle,t.price=t.vehicle.price;let o=t.vehicle.type.class;delete t.vehicles,i.hasOwnProperty("recommended")||(i.recommended=[]),t.highlight&&(0===e?i.recommended.push(t):t.highlight=!1),i.hasOwnProperty("all")||(i.all=[]),i.all.push(t),i.hasOwnProperty(o)||(i[o]=[]),i[o].push(t)}}}for(let e in i)i[e]=n(i[e],t);return{raw:o,sorted:i}};var l=o(18);const c="SORT_BY_PRICE",d={biqQuotesSearched:{name:"biqQuotesSearched"},biqZeroQuotes:{name:"biqZeroQuotes"},biqQuotesError:{name:"biqQuotesError"}},p={biqQuoteBookNow:{name:"biqQuoteBookNow"}},h=(e,t,o)=>({type:t,quotes:"type_class"==t?a(e,"SORT_BY_PRICE"):s(e,t,o)}),g=()=>({quoting:!1,quotes_loaded:!1,api_error:!1,journey_id:"",journey_details:Object(l.d)(l.a),journey_quotes:{}})},18:function(e,t,o){"use strict";o.d(t,"a",(function(){return r})),o.d(t,"d",(function(){return n})),o.d(t,"f",(function(){return s})),o.d(t,"g",(function(){return a})),o.d(t,"b",(function(){return u})),o.d(t,"c",(function(){return l})),o.d(t,"e",(function(){return c}));const i={string:"",postcode:"",position:[0,0]},r={pickup:i,destination:i,vias:[],people:1,return:!1,date:"",distance:1,duration:116,duration_text:"1 min",quote_type:"mileage",is_airport:!1,hourly:!1},n=e=>({pickup:e.pickup,destination:e.destination,vias:e.vias,people:e.people,return:e.return,date:e.date,distance:e.distance,duration:e.duration,duration_text:e.duration_text,quote_type:e.quote_type,is_airport:e.is_airport,hourly:e.hourly}),s=e=>null!==e?e.toDateString():"",a=e=>null!==e?e.toLocaleTimeString():"",u=e=>new Date(Date.parse(e)),l=e=>s(u(e)),c=e=>a(u(e))},26:function(e,t,o){"use strict";var i=o(25),r=o.n(i);const n={props:{appURL:{type:String,required:!0,default:"//"},appDebugEnabled:{type:Boolean,default:!1}},computed:{appSettings:function(){return{...this.settings}}},methods:{getAppSettings:function(e,t){const o=this,i=this.appURL+"settings/";this.appDebugEnabled&&console.group(`Loading App Settings from '${i}'`);const n="function"==typeof e?e.call(this):{};r.a.get(i,n).then(e=>{o.appSettingsUpdated(e.data,t),o.initialised=!0}).catch(e=>{o.appDebugEnabled&&(console.info("Updated Settings Error"),console.log(e)),console.error(e)}).finally(()=>{o.appDebugEnabled&&console.groupEnd()})},appSettingsUpdated:function(e,t){this.appDebugEnabled&&(console.group("Updating App Settings"),console.log("App Settings",{...this.settings}),console.log("New Settings",e));const o="function"==typeof t?t.call(this,e):{...e};this.settings=o,this.appDebugEnabled&&(console.info("Updated Settings"),console.log("Settings",o),console.log("App Settings",{...this.settings}),console.groupEnd())}},data:()=>({initialised:!1,settings:{}})};t.a=n},264:function(e,t,o){"use strict";o.r(t);var i=o(46),r=(o(156),o(13)),n=o(20),s=o(26),a=o(16),u=o(87);var l={name:"BIQAppSearchLite",version:"1.0.1",props:{biqAppConfig:{type:Object,required:!0,default:function(){return{biq:a.b}}},biqSearchTarget:{type:String,required:!0,default:"/booking-instant-quotes/"}},computed:{...Object(n.c)(["searchDetails","searchOnLoad","hasSearchResults","displayType","displayQuotes","loadingQuotes","quotesError","quotesLoaded","zeroQuotes","journeyID","journeyDetails","journeyDate","journeyTime","journeyHasReturn","journeyReturnDate","journeyReturnTime","journeyHasVias","journeyQuotes"]),appConfig:function(){return{...this.biqAppConfig}},placesLookup:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.PLACES_URI}`},quotesFrom:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.QUOTE_URI}`}},methods:{appSettingsUpdated:a.e,...Object(n.b)(["resetSearch","searchingQuotes","searchedQuotes","changeDisplayType","resetQuotes","quoting","apiQuotesError","quoted"]),onSearchQuotes:function(e){if(!e.data.validate())return e.preventDefault();this.$store.commit("searchForQuotes",e.data.formValues())}},mixins:[s.a],components:{"the-biq-search-form":u.a},data(){return{...s.a.data.call(this),settings:{biq_api_host:this.biqAppConfig.biq.LIVE_API_HOST,biq_pk:"",paypal_pk:"",stripe_pk:"",stripe_cardform_style:a.a,booking_test_mode:!1,quote_type:"",recommend_upgrade:!1,complete_page_text:""},app_title:"Booking Instant Quotes - Search Lite v1.0.1",search_on_load:!1}},created(){this.getAppSettings()}},c=o(19),d=Object(c.a)(l,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"biq-search-lite-vue-app"}},[e.initialised?o("the-biq-search-form",{attrs:{"biq-public-key":e.appSettings.biq_pk,"biq-places-lookup":e.placesLookup,"biq-quotes-from":e.quotesFrom,"search-on-load":e.search_on_load,debugging:e.appDebugEnabled,layout:"compact",action:e.biqSearchTarget,method:"GET"},on:{submit:e.onSearchQuotes}}):e._e()],1)}),[],!1,null,null,null).exports,p=o(49),h=o(48);new r.default({store:p.a,render:e=>e(d,{props:{appURL:biqAppURL,appDebugEnabled:i.a||biqAppDebugEnabled,biqAppConfig:h.a,biqSearchTarget:biqSearchTarget}}),el:"#biq-vue-app"})},29:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"c",(function(){return s})),o.d(t,"b",(function(){return c}));const i="Return",r=["One Way",i],n=r[0],s=e=>({journey_type:{selected:n,options:r,label:"Journey type",required:!1,error:null,errorMsg:"",id:e+"-journey",placeholder:""},pickup:{value:"",label:"Pickup",required:!0,error:null,errorMsg:"Pickup location must be set",id:e+"-pickup",placeholder:"Pickup postcode or place name"},destination:{value:"",label:"Destination",required:!0,error:null,errorMsg:"Destination location must be set",id:e+"-destination",placeholder:"Destination postcode or place name"},via:{value:"",label:"(Optional) Via",required:!1,error:null,errorMsg:"",id:e+"-via",placeholder:"Via postcode or place name"},people:{value:"1",label:"Number of People",required:!0,error:null,errorMsg:"Invalid number of people travelling",id:e+"-people",placeholder:""}}),a=(e,t,o)=>(e.setDate(e.getDate()+t),e.setHours(e.getHours()+o),e),u=()=>a(new Date,1,2),l=e=>e<10?"0"+e:e,c=()=>{const e=u();return{search_details:{journey_type:n,pickup:"",vias:[],destination:"",date:e.getFullYear()+"-"+l(e.getMonth()+1)+"-"+l(e.getDate()),time:l(e.getHours())+":"+l(e.getMinutes())+":"+l(e.getSeconds()),people:"1",returning:{date:"",time:""}},search_on_load:!1,results:!1,display_type:"",display_quotes:[]}}},35:function(e,t,o){"use strict";o.d(t,"a",(function(){return i})),o.d(t,"b",(function(){return r})),o.d(t,"e",(function(){return a})),o.d(t,"f",(function(){return u})),o.d(t,"c",(function(){return l})),o.d(t,"d",(function(){return c}));const i="Pay with Card",r="Pay with Paypal",n=[i,r],s=i,a=e=>({method:{selected:s,options:n,label:"Select Payment Method:",errorMsg:"Invalid Payment Method",id:e+"-method"}}),u={submit:{name:"submit"},transactionSuccess:{name:"transactionSuccess"},transactionError:{name:"transactionError"}},l={biqCheckoutSubmit:{name:"biqCheckoutSubmit"},biqCheckoutComplete:{name:"biqCheckoutComplete"},biqCheckoutError:{name:"biqCheckoutError"}},c=()=>({processing:!1,processed:!1,basket:{quote_id:"",vehicle_index:0,amount:0},quote:{},vehicle:{},booking_ref:""})},46:function(e,t,o){"use strict";o.d(t,"a",(function(){return l}));var i=o(13),r=o(66),n=o(47),s=(o(90),o(91),o(27)),a=o(23),u=o(64);o(69),o(70),o(71);const l=!1;i.default.config.productionTip=!1,i.default.config.devtools=l,i.default.use(r.a),i.default.use(n.a),s.c.add(a.b,a.d,a.a,a.e,a.c),i.default.component("font-awesome-icon",u.a)},48:function(e,t,o){"use strict";const i={biq:{...o(16).d},BOOKING_DETALS_URI:"booking-details/?booking_ref="};t.a=i},49:function(e,t,o){"use strict";var i=o(13),r=o(20),n=o(65),s=o(29),a=o(17);var u={state:Object(s.b)(),getters:{searchDetails:e=>e.search_details,searchOnLoad:e=>e.search_on_load,hasSearchResults:e=>e.results,displayType:e=>e.display_type,displayQuotes:e=>e.display_quotes},actions:{resetSearch({commit:e,dispatch:t}){t("resetQuotes",null,{root:!0}),e("resetSearchState")},searchingQuotes({commit:e,dispatch:t},o){e("resetSearchState"),t("quoting",null,{root:!0}),e("searchingQuotesFor",o)},searchedQuotes({commit:e,dispatch:t},o){t("quoted",o,{root:!0}),Object.keys(o.quotes).length>0&&e("displaying",Object(a.c)(o.quotes,o.display_type,a.a))},changeDisplayType({commit:e,rootGetters:t},o){e("displaying",Object(a.c)(t.journeyQuotes,o,a.a))}},mutations:{resetSearchState(e){Object.assign(e,Object(s.b)())},searchingQuotesFor(e,t){e.search_details=t},searchForQuotes(e,t){e.search_details=t,e.search_on_load=!0},displaying(e,t){e.display_quotes=t.quotes,e.display_type=t.type,e.results=!0}}},l=o(18);var c={state:Object(a.b)(),getters:{loadingQuotes:e=>e.quoting,quotesError:e=>e.api_error,quotesLoaded:e=>e.quotes_loaded,zeroQuotes:e=>!!e.quotes_loaded&&0===Object.keys(e.journey_quotes).length,journeyID:e=>e.journey_id,journeyDetails:e=>e.journey_details,journeyDate:e=>Object(l.c)(e.journey_details.date),journeyTime:e=>Object(l.e)(e.journey_details.date),journeyReturnDate:e=>e.journey_details.return&&Object(l.c)(e.journey_details.return),journeyReturnTime:e=>e.journey_details.return&&Object(l.e)(e.journey_details.return),journeyHasReturn:e=>!!e.journey_details.return,journeyHasVias:e=>Array.isArray(e.journey_details.vias)&&e.journey_details.vias.length>0,journeyQuotes:e=>e.journey_quotes},actions:{resetQuotes({commit:e}){e("resetQuotesState")},quoting({commit:e,dispatch:t}){e("resetQuotesState"),t("resetCheckout",null,{root:!0}),e("searching")},apiQuotesError({commit:e},t){e("quotesError",{api_error:t}),e("searched")},quoted({commit:e},t){e("searched"),e("quotes",t)}},mutations:{resetQuotesState(e){Object.assign(e,Object(a.b)())},searching(e){e.quoting=!0},quotesError(e,t){e.api_error=t.api_error},searched(e){e.quoting=!1},quotes(e,t){e.journey_id=t.journey_id,e.journey_quotes=t.quotes,e.journey_details=Object(l.d)(t.journey),e.quotes_loaded=!0}}},d=o(35);var p={search:u,quotes:c,checkout:{state:Object(d.d)(),getters:{processed:e=>e.processed,processing:e=>e.processing,basket:e=>({quote:e.basket.quote_id,vehicle:e.basket.vehicle_index,price:e.basket.amount}),quoteID:e=>e.basket.quote_id,vehicleIndex:e=>e.basket.vehicle_index,price:e=>e.basket.amount,quoteData:e=>e.quote,quoteVehicleData:e=>e.vehicle,bookingRef:e=>e.booking_ref},actions:{resetCheckout({commit:e}){e("resetCheckoutState")},bookNow({commit:e},t){e("resetCheckoutState"),e("buildBasket",t)},booking({commit:e}){e("processing",{processing:!0,processed:!1})},bookingFailed({commit:e}){e("processing",{processing:!1,processed:!1})},booked({commit:e},t){e("resetCheckoutState"),e("processing",{processing:!1,processed:!1}),e("booked",{p:t})}},mutations:{resetCheckoutState(e){Object.assign(e,Object(d.d)())},buildBasket(e,t){e.basket.quote_id=t.quote,e.basket.vehicle_index=t.vehicle,e.basket.amount=t.quote_data.vehicles[t.vehicle].price,e.quote=t.quote_data,e.vehicle=t.quote_data.vehicles[t.vehicle]},processing(e,t){e.processing=t.processing,e.processed=t.processed},booked(e,t){e.booking_ref=t.booking_ref}}}};i.default.use(r.a);t.a=new r.a.Store({modules:{BIQSearchStateStore:p.search,BIQQuotesStateStore:p.quotes,BIQCheckoutStateStore:p.checkout},plugins:[Object(n.a)({paths:["BIQSearchStateStore","BIQQuotesStateStore","BIQCheckoutStateStore"],storage:window.localStorage})]})},51:function(e,t,o){"use strict";o.d(t,"c",(function(){return i})),o.d(t,"a",(function(){return r}));const i={submit:{name:"submit"},validated:{name:"validated"},validationError:{name:"validationError"}},r={props:{validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},values:{type:Object,default:function(){return{}}},debugging:{type:Boolean,default:!1}},data:()=>({fields:{}}),methods:{validate:function(){return this.validateValues()},specialValidationErrors:function(){return{}},specialInputValues:function(){return{}},errorStateClass:function(e){return null==this.fields[e].error?"":this.fields[e].error?this.errorClass:this.validClass},setFieldValues:function(){const e=this;this.debugging&&(console.group(`Setting ${this.$options._componentTag} values`),console.log("Fields Before",{...this.fields}),console.log("Values",this.values)),Object.keys(this.values).forEach(t=>{if(!e.fields.hasOwnProperty(t))return void(e.debugging&&console.info(`${e.$options._componentTag} does not contain field '${t}'`));const o=e.fields[t].hasOwnProperty("value")?"value":"selected";e.fields[t][o]=e.values[t]}),this.debugging&&(console.log("Fields After",{...this.fields}),console.groupEnd())},validateValues:function(){const e=this;let t=0;return this.debugging&&console.group(`Validating ${this.$options._componentTag} values`),Object.keys(this.fields).forEach(o=>{if(e.fields[o].error=null,!e.fields[o].required)return;const i=e.fields[o].hasOwnProperty("value")?"value":"selected";""==e.fields[o][i]?(e.fields[o].error=e.fields[o].errorMsg,e.debugging&&console.info(`Invalid field value for '${o}' -- ${e.fields[o].error}`),t++):e.fields[o].error=""}),this.debugging&&console.groupEnd(),0==t},validationErrors:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{t[o]=e.fields[o].error}),{...this.specialValidationErrors(),...t}},inputValues:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{const i=e.fields[o].hasOwnProperty("value")?"value":"selected";t[o]=e.fields[o][i]}),{...this.specialInputValues(),...t}}}};t.b=r},67:function(e,t,o){"use strict";o.d(t,"c",(function(){return m})),o.d(t,"b",(function(){return b}));var i=o(25),r=o.n(i),n=o(20),s=o(51),a=o(29),u=o(17),l=o(128),c=o(127);const d={name:"input"},p={name:"biqPlacesLookupError"};var h={name:"PlacesLookup",components:{"vue-typeahead-bootstrap":c.a},props:{biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqPublicKey:{type:String,required:!0,default:""},id:{type:String,default:"biq-places-lookup"},placeholder:{type:String,default:"Location postcode or place name"},label:{type:String,default:""},value:{type:String,default:""},required:{type:Boolean,default:!1},size:{type:String,default:null,validator:e=>["lg","sm"].indexOf(e)>-1},containerClass:{type:String,default:""},validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},debugging:{type:Boolean,default:!1}},data:()=>({locations:[],force_lookup:!0}),updated(){this.force_lookup?this.locationSearch(this.value):this.$refs.locationfield.inputValue=this.value},watch:{location:{handler:l.a.debounce((function(e){this.locationSearch(e)}),500),immediate:!0}},computed:{location:{get(){return this.value},set(e){this.$emit(d.name,e)}},inputID:function(){return this.id+"-input"},errorStateClass:function(){const e=null==this.errorState?"":this.errorState?this.errorClass:this.validClass;return`${this.id} ${e}`}},methods:{locationSearch:function(e){if(null===e||"string"!=typeof e||e.length<3)return;this.debugging&&(console.info(),console.log(`BIQ Places ${this.label} lookup to API '${this.biqPlacesLookup}'`,e)),this.force_lookup=!1,this.$refs.locationfield.inputValue=e;const t=this,o=`${this.biqPlacesLookup}${e}`;let i=[],n=[],s=[];r.a.get(`${o}&key=${this.biqPublicKey}`).then(e=>{if(t.debugging&&console.log(`BIQ Places ${this.label} response`,e),"OK"!=e.data.status)throw new ErrorEvent(e.data.status,{error:new Error(`BIQ Places ${t.label} lookup to API Error`),message:e.data[e.data.status.toLowerCase()]});const o=e.data.results,r=(e,t)=>({string:e,type:t});void 0!==o.STATION&&(n=o.STATION.map(e=>r(e,"station"))),void 0!==o.AIRPORT&&(i=o.AIRPORT.map(e=>r(e,"airport"))),void 0!==o.LOCATION&&(s=o.LOCATION.map(e=>r(e,"location")));const a=o.GOOGLE.map(e=>r(e.string,e.poi?"poi":"general"));t.locations=i.concat(n,s,a)}).catch(e=>{t.locations=[];const i={data:{id:t.id,URL:o,message:e.message||`Unknown BIQ Places ${t.label} lookup to API Error`,error:e}};t.$emit(p.name,i)})},validate:function(){return!(this.required&&(null==this.value||""==this.value))}}},g=o(19),f=Object(g.a)(h,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{class:e.containerClass},[e.label?o("label",{attrs:{id:e.inputID,for:e.id}},[e._v(e._s(e.label))]):e._e(),e._v(" "),o("vue-typeahead-bootstrap",{ref:"locationfield",attrs:{id:e.id,placeholder:e.placeholder,size:e.size,inputClass:e.errorStateClass,"show-all-results":!0,"show-on-focus":!0,data:e.locations,serializer:function(e){return e.string}},on:{hit:function(t){e.selectedLocation=t}},scopedSlots:e._u([{key:"suggestion",fn:function(t){var i=t.data,r=t.htmlText;return[o("div",{staticClass:"d-flex align-items-center"},["station"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"plane"}})],1):o("span",[o("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),e._v(" "),o("span",{staticClass:"ml-4",domProps:{innerHTML:e._s(r)}})])]}}]),model:{value:e.location,callback:function(t){e.location=t},expression:"location"}},[o("template",{slot:"prepend"}),e._v(" "),e._v(" "),o("template",{slot:"append"})],2)],1)}),[],!1,null,null,null).exports;const m={biqPublicKey:{type:String,required:!0,default:""},biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqQuotesFrom:{type:String,required:!0,default:"//booking/quote/"},idPrefix:{type:String,default:"biq"},searchOnLoad:{type:Boolean,default:!1},debugging:{type:Boolean,default:!1}},b={...s.c,...u.e},y={components:{"biq-places-lookup":f,"biq-process-form-submit":()=>o.e(7).then(o.bind(null,266))},props:{...s.a.props,...m},data(){return{fields:Object(a.c)(this.idPrefix),date:"",time:"",return_date:"",return_time:"",errors:{date:null,time:null,return_date:null,return_time:null},date_picker_formats:{short:{year:"numeric",month:"short",day:"2-digit"},medium:{year:"numeric",month:"short",day:"2-digit",weekday:"short"}}}},mounted(){this.setFieldValues(),this.searchOnLoad&&this.onSearchQuotesFormSubmit({})},computed:{...Object(n.c)(["searchDetails","loadingQuotes"]),hasReturn:function(){return this.fields.journey_type.selected===a.a}},methods:{...s.a.methods,...Object(n.b)(["searchingQuotes","apiQuotesError"]),journeyDateTimeErrorState:function(e){return null!==this.errors[e]?!this.errors[e].length:null},onPlacesLookupError:function(e){this.debugging&&(console.group(e.data.message),console.log(e),console.groupEnd())},setFieldValues:function(){const e=this.searchDetails;this.debugging&&console.log("BIQ Search Form from State",e),this.fields.journey_type.selected=e.journey_type,this.fields.pickup.value=e.pickup,this.fields.destination.value=e.destination,e.vias.length&&(this.fields.via.value=e.vias[0]),this.fields.people.value=e.people,this.date=e.date,this.time=e.time,this.hasReturn&&null!==e.returning.date&&(this.return_date=e.returning.date),this.hasReturn&&null!==e.returning.time&&(this.return_time=e.returning.time),this.$nextTick(()=>{this.$refs.pickupfield.inputValue=this.fields.pickup.value,this.$refs.destinationfield.inputValue=this.fields.destination.value,this.$refs.viafield.inputValue=this.fields.via.value})},onSearchQuotesFormSubmit:function(e){e.data={validate:()=>this.validate(),formValues:()=>this.formValues(),defaultAction:()=>{this.validate()&&this.searchApiQuotes(this.formValues())},searchApiQuotes:()=>this.searchApiQuotes(this.formValues())},this.$emit(b.submit.name,e)},validate:function(){this.errors={date:null,time:null,return_date:null,return_time:null};let e=0;this.validateValues()||e++,null!=this.date&&""!=this.date||(this.errors.date="Journey date is invalid",e++),null!=this.time&&""!=this.time||(this.errors.time="Journey time is invalid",e++),this.hasReturn&&(null!=this.return_date&&""!=this.return_date||(this.errors.return_date="Journey return date is invalid",e++),null!=this.return_time&&""!=this.return_time||(this.errors.return_time="Journey return time is invalid",e++));const t=0===e;return this.emitValidationEvent(t),t},emitValidationEvent:function(e){let t=b.validated.name;const o={data:{values:{...this.inputValues()}}};e||(t=b.validationError.name,o.data.errors={...this.validationErrors(),...this.errors},this.debugging&&(console.group("BIQ Search Form Validation Error"),console.log("Validation Error Fields",{...this.validationErrors()}),console.log("Validation Error",o.data.errors),console.groupEnd())),this.$emit(t,o)},formValues:function(){const e=this.inputValues(),t={journey_type:e.journey_type,pickup:e.pickup,destination:e.destination,people:e.people,date:this.date,time:this.time};this.hasReturn?t.returning={date:this.return_date,time:this.return_time}:t.returning={date:null,time:null};const o=this.fields.via.value;return t.vias=""!=o?[o]:[],t},searchApiQuotes:function(e){const t=this;this.searchingQuotes(e);let o=null,i=`pickup=${e.pickup}&destination=${e.destination}&date=${e.date} ${e.time}&people=${e.people}`;this.hasReturn&&(i=`${i}&return=${e.returning.date} ${e.returning.time}`),e.vias.length&&(i=`${i}&via=${e.vias[0]}`),this.debugging&&console.group(`Searching BIQ API Quotes from '${this.biqQuotesFrom}'`),r.a.get(`${this.biqQuotesFrom}?key=${this.biqPublicKey}&${i}`).then(e=>{if(t.debugging&&console.log(e),"OK"!=e.data.status)throw new ErrorEvent(e.data.status,{error:new Error("BIQ API Quotes Error"),message:e.data[e.data.status.toLowerCase()]});o=e.data.journey_id;const i={data:{journey_id:o,journey:e.data.journey,quotes:e.data.quotes}};let r=b.biqQuotesSearched.name;Object.keys(e.data.quotes).length<=0&&(r=b.biqZeroQuotes.name,i.data.error={message:e.data.warnings[0]}),t.$emit(r,i),t.debugging&&(console.info("BIQ API Quotes Searched"),console.groupEnd())}).catch(i=>{const r={data:{quotes:[],journey_id:o,journey:e,error:i}};t.$emit(b.biqQuotesError.name,r),t.debugging&&(console.info("BIQ API Quotes Search Error"),console.groupEnd())})}}};t.a=y},69:function(e,t,o){},70:function(e,t,o){},71:function(e,t,o){},87:function(e,t,o){"use strict";var i=o(67);const r={column:{name:"column",tag:"the-biq-search-form-column",component:()=>o.e(13).then(o.bind(null,285))},compact:{name:"compact",tag:"the-biq-search-form-compact",component:()=>o.e(14).then(o.bind(null,282))}},n={...i.c,layout:{type:String,default:r.compact.name,required:!0,validator:e=>Object.keys(r).indexOf(e)>-1}},s={...i.b};var a={name:"TheSearchForm",props:n,computed:{useLayout:function(){switch(this.layout){case r.compact.name:return r.compact.tag;case r.column.name:return r.column.tag}}},methods:{validate:function(){return this.$refs.searchForm.validate()},formValues:function(){return this.$refs.searchForm.formValues()},onSubmit:function(e){this.$emit(s.submit.name,e)},onValidated:function(e){this.$emit(s.validated.name,e)},onValidationError:function(e){this.$emit(s.validationError.name,e)},onBiqQuotesSearched:function(e){this.$emit(s.biqQuotesSearched.name,e)},onBiqZeroQuotes:function(e){this.$emit(s.biqZeroQuotes.name,e)},onBiqQuotesError:function(e){this.$emit(s.biqQuotesError.name,e)}},components:{...(e=>{const t=Object.keys(e).map(t=>[e[t].tag,e[t].component]);return Object.fromEntries(t)})(r)}},u=o(19),l=Object(u.a)(a,(function(){var e=this,t=e.$createElement;return(e._self._c||t)(e.useLayout,{ref:"searchForm",tag:"component",attrs:{"biq-public-key":e.biqPublicKey,"biq-places-lookup":e.biqPlacesLookup,"biq-quotes-from":e.biqQuotesFrom,"search-on-load":e.searchOnLoad,debugging:e.debugging,"id-prefix":"biq"},on:{submit:e.onSubmit,validated:e.onValidated,validationError:e.onValidationError,biqQuotesSearched:e.onBiqQuotesSearched,biqZeroQuotes:e.onBiqZeroQuotes,biqQuotesError:e.onBiqQuotesError}})}),[],!1,null,null,null);t.a=l.exports}},[[264,1,0]],[7]]);
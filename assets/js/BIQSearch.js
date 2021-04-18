(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{266:function(e,t,o){"use strict";const i={props:{appConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},debugging:{type:Boolean,default:!1}}};t.a=i},281:function(e,t,o){"use strict";o.r(t);var i=o(20),n=o(266),s=o(88);var r={name:"HomePage",computed:{...Object(i.c)(["searchOnLoad","hasSearchResults","displayType","loadingQuotes","quotesError","quotesLoaded","journeyID","journeyDetails","journeyQuotes","quoteID","vehicleIndex"]),placesLookup:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.PLACES_URI}`},quotesFrom:function(){return`${this.appSettings.biq_api_host}${this.appConfig.biq.QUOTE_URI}`},showResults:function(){return this.loadingQuotes||this.quotesError||this.quotesLoaded},showRecommendedUpgrade:function(){return this.appSettings.recommend_upgrade&&this.show_upgrade}},methods:{...Object(i.b)(["searchingQuotes","searchedQuotes","changeDisplayType","apiQuotesError","bookNow"]),onQuotesSearchSubmit:function(e){if(e.data.validate()){const t=e.data.formValues();this.searchingQuotes(t),e.data.searchApiQuotes(t)}},onQuotesSearched:function(e){this.debugging&&(console.group("BIQ Quotes Searched"),console.log(e)),this.updateSearchState(e),this.debugging&&console.groupEnd()},onZeroQuotes:function(e){this.debugging&&(console.group("BIQ Quotes Search Zero Results"),console.log(e)),console.error(e.warnings[0]),this.updateSearchState(e),this.debugging&&console.groupEnd()},onQuotesError:function(e){this.debugging&&(console.group("BIQ Quotes Search Error"),console.log(e),console.groupEnd());const t=e.data.error.message||"Unknown BIQ Quotes API Error";console.error(e.data.error),this.apiQuotesError(t)},onBookNowClicked:function(e){this.debugging&&(console.group("BIQ Quote Book Now Clicked"),console.log(e)),e.preventDefault();const{quoteID:t,selectedVehicleIndex:o}=e.data;this.debugging&&(console.log("Quote ID",t),console.log("Vehicle Index",o),console.log("Quote",this.journeyQuotes[t]),console.log("Vehicle",this.journeyQuotes[t].vehicles[o]),console.groupEnd());const i={journey:this.journeyID,quote:{id:t,vehicle:o}};return this.selected=i,this.appSettings.recommend_upgrade?this.show_upgrade=!0:this.gotoCheckout()},onUpgradeUnavailable:function(e){this.debugging&&console.log("No Quote Upgrade Available Event",e),this.show_upgrade=!1,this.gotoCheckout()},onUpgradeModalCancel:function(e){this.debugging&&console.log("Cancel Upgrade Modal Event",e),this.show_upgrade=!1,this.gotoCheckout()},onUpgradeModalConfirm:function(e){this.debugging&&console.log("Confirm Modal Event",e);const t=e.data.recommendedUpgrade;this.debugging&&(console.group("Quote Upgrade Recommendation Accepted"),console.log("recommendedUpgrade",t),console.groupEnd()),this.show_upgrade=!1,this.selected.quote={id:t.upgradeQuoteId,vehicle:t.upgradeVehicleIndex},this.gotoCheckout()},gotoCheckout:function(){this.bookNow({quote:this.selected.quote.id,vehicle:this.selected.quote.vehicle,quote_data:this.journeyQuotes[this.selected.quote.id]}),this.$router.push({name:"CheckoutPage",params:{journey:this.journeyID,quote:this.quoteID,vehicle:this.vehicleIndex}})},updateSearchState:function(e){this.debugging&&(console.group("BIQ Quotes Search State Updated"),console.log("Search data",e),console.log("Quote type",this.appSettings.quote_type),console.groupEnd()),this.searchedQuotes({...e,display_type:this.appSettings.quote_type})}},mixins:[n.a],components:{"the-biq-search-form":s.a,"the-biq-search-results":()=>o.e(12).then(o.bind(null,285)),"biq-quote-upgrade-offer-modal":()=>o.e(10).then(o.bind(null,279))},data:()=>({selected:{journey:"",quote:{id:"",vehicle:0}},show_upgrade:!1}),created(){this.hasSearchResults&&this.displayType!==this.appSettings.quote_type&&this.changeDisplayType(this.appSettings.quote_type)}},a=o(19),u=Object(a.a)(r,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"biq-home-page"}},[o("the-biq-search-form",{attrs:{"biq-public-key":e.appSettings.biq_pk,"biq-places-lookup":e.placesLookup,"biq-quotes-from":e.quotesFrom,"search-on-load":e.searchOnLoad,debugging:e.debugging,layout:"column"},on:{submit:e.onQuotesSearchSubmit,biqQuotesSearched:e.onQuotesSearched,biqZeroQuotes:e.onZeroQuotes,biqQuotesError:e.onQuotesError}}),e._v(" "),e.showResults?o("the-biq-search-results",{attrs:{"display-results-type":e.appSettings.quote_type,debugging:e.debugging},on:{biqQuoteBookNow:e.onBookNowClicked},scopedSlots:e._u([{key:"loading-quotes",fn:function(){return[o("div",{staticClass:"d-flex"},[o("div",{staticClass:"spinner-border"}),e._v(" Generating Quotes...\n            ")])]},proxy:!0}],null,!1,2065268608)}):e._e(),e._v(" "),e.showRecommendedUpgrade?o("biq-quote-upgrade-offer-modal",{attrs:{journey:e.selected.journey,quote:e.selected.quote.id,vehicle:e.selected.quote.vehicle,debugging:e.debugging},on:{unavailable:e.onUpgradeUnavailable,cancel:e.onUpgradeModalCancel,confirm:e.onUpgradeModalConfirm},scopedSlots:e._u([{key:"body",fn:function(t){var i=t.upgrade;return[o("p",[e._v(e._s(i.description))])]}}],null,!1,99690981)}):e._e()],1)}),[],!1,null,null,null);t.default=u.exports},38:function(e,t,o){"use strict";o.d(t,"c",(function(){return n})),o.d(t,"a",(function(){return s}));const i={validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},values:{type:Object,default:function(){return{}}},debugging:{type:Boolean,default:!1}},n={submit:{name:"submit"},validated:{name:"validated"},validationError:{name:"validationError"}},s={props:i,methods:{validate:function(){return this.validateValues()},specialValidationErrors:function(){return{}},specialInputValues:function(){return{}},errorStateClass:function(e){return null==this.fields[e].error?"":this.fields[e].error?this.errorClass:this.validClass},setFieldValues:function(){const e=this;this.debugging&&(console.group(`Setting ${this.$options._componentTag} values`),console.log("Fields Before",{...this.fields}),console.log("Values",this.values)),Object.keys(this.values).forEach(t=>{if(!e.fields.hasOwnProperty(t))return void(e.debugging&&console.info(`${e.$options._componentTag} does not contain field '${t}'`));const o=e.fields[t].hasOwnProperty("value")?"value":"selected";e.fields[t][o]=e.values[t]}),this.debugging&&(console.log("Fields After",{...this.fields}),console.groupEnd())},validateValues:function(){const e=this;let t=0;return this.debugging&&console.group(`Validating ${this.$options._componentTag} values`),Object.keys(this.fields).forEach(o=>{if(e.fields[o].error=null,!e.fields[o].required)return;const i=e.fields[o].hasOwnProperty("value")?"value":"selected";""==e.fields[o][i]?(e.fields[o].error=e.fields[o].errorMsg,e.debugging&&console.info(`Invalid field value for '${o}' -- ${e.fields[o].error}`),t++):e.fields[o].error=""}),this.debugging&&console.groupEnd(),0==t},validationErrors:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{t[o]=e.fields[o].error}),{...this.specialValidationErrors(),...t}},inputValues:function(){const e=this,t={};return Object.keys(this.fields).forEach(o=>{const i=e.fields[o].hasOwnProperty("value")?"value":"selected";t[o]=e.fields[o][i]}),{...this.specialInputValues(),...t}}},data:()=>({fields:{}})};t.b=s},52:function(e,t,o){"use strict";o.d(t,"b",(function(){return a})),o.d(t,"c",(function(){return u})),o.d(t,"a",(function(){return l}));var i=o(25),n=o.n(i);const s=(e,t,o,i)=>{if(i&&console.log("BIQ API response for - "+e,o),"OK"!=o.data.status)throw new ErrorEvent(o.data.status,{error:new Error("BIQ API Error"),message:o.data[o.data.status.toLowerCase()]});return o.data},r=(e,t,o,i)=>({data:{URL:e,key:t,message:i||o.message,error:o}}),a=(e,t,o,i,a)=>new Promise((u,l)=>{n.a.get(`${e}${o}&key=${t}`).then(t=>s(e,0,t,a)).then(e=>e.results).then(e=>{let t=[],o=[],n=[];void 0!==e.AIRPORT&&(t=e.AIRPORT.map(e=>i(e,"airport"))),void 0!==e.STATION&&(o=e.STATION.map(e=>i(e,"station"))),void 0!==e.LOCATION&&(n=e.LOCATION.map(e=>i(e,"location")));const s=e.GOOGLE.map(e=>i(e.string,e.poi?"poi":"general"));u(t.concat(o,n,s))}).catch(o=>{const i=o.message||"Unknown";l(r(e,t,o,"BIQ Places lookup API Error - "+i))})}),u=(e,t,o,i)=>{let a=`pickup=${o.pickup}&destination=${o.destination}&date=${o.date} ${o.time}&people=${o.people}`;return o.hasReturn&&(a=`${a}&return=${o.returning.date} ${o.returning.time}`),o.vias.length&&(a=`${a}&via=${o.vias[0]}`),new Promise((o,u)=>{n.a.get(`${e}?key=${t}&${a}`).then(t=>s(e,0,t,i)).then(e=>{const t={journey_id:e.journey_id,journey:e.journey,quotes:e.quotes,count:Object.keys(e.quotes).length};t.count||(t.warnings=e.warnings),o(t)}).catch(o=>{const i=o.message||"Unknown";u(r(e,t,o,"BIQ Quotes Search API Error - "+i))})})},l=(e,t,o,i)=>{o.append("key",t);const a={headers:{"Content-Type":"application/application/x-www-form-urlencoded"}};return new Promise((u,l)=>{n.a.post(e,o,a).then(t=>s(e,0,t,i)).then(e=>u(e)).catch(i=>{const n=i.message||"Unknown",s=r(e,t,i,"BIQ API Booking Error - "+n);s.data.type="booking",s.data.booking={token:o.get("token"),method:o.get("method"),formData:o},l(s)})})}},87:function(e,t,o){"use strict";o.d(t,"b",(function(){return g}));var i=o(20),n=o(38),s=o(29),r=o(52),a=o(129),u=o(128);const l={name:"input"},c={name:"biqPlacesLookupError"};var d={name:"PlacesLookup",components:{"vue-typeahead-bootstrap":u.a},props:{biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqPublicKey:{type:String,required:!0,default:""},id:{type:String,default:"biq-places-lookup"},placeholder:{type:String,default:"Location postcode or place name"},label:{type:String,default:""},value:{type:String,default:""},required:{type:Boolean,default:!1},size:{type:String,default:null,validator:e=>["lg","sm"].indexOf(e)>-1},containerClass:{type:String,default:""},validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},debugging:{type:Boolean,default:!1}},data:()=>({locations:[],force_lookup:!0}),updated(){this.force_lookup?this.locationSearch(this.value):this.$refs.locationfield.inputValue=this.value},watch:{location:{handler:a.a.debounce((function(e){this.locationSearch(e)}),500),immediate:!0}},computed:{location:{get(){return this.value},set(e){this.$emit(l.name,e)}},inputID:function(){return this.id+"-input"},errorStateClass:function(){const e=null==this.errorState?"":this.errorState?this.errorClass:this.validClass;return`${this.id} ${e}`}},methods:{locationSearch:function(e){if(null===e||"string"!=typeof e||e.length<1)return;this.debugging&&console.log(`BIQ Places ${this.label} lookup to API '${this.biqPlacesLookup}'`,e),this.force_lookup=!1,this.$refs.locationfield.inputValue=e;const t=this;Object(r.b)(this.biqPlacesLookup,this.biqPublicKey,e,(e,t)=>({string:e,type:t}),this.debugging).then(e=>{t.locations=e}).catch(e=>{t.locations=[],t.$emit(c.name,e)})},validate:function(){return!(this.required&&(null==this.value||""==this.value))}}},h=o(19),p=Object(h.a)(d,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{class:e.containerClass},[e.label?o("label",{attrs:{id:e.inputID,for:e.id}},[e._v(e._s(e.label))]):e._e(),e._v(" "),o("vue-typeahead-bootstrap",{ref:"locationfield",attrs:{id:e.id,placeholder:e.placeholder,size:e.size,inputClass:e.errorStateClass,"show-all-results":!0,"show-on-focus":!0,data:e.locations,serializer:function(e){return e.string}},on:{hit:function(t){e.selectedLocation=t}},scopedSlots:e._u([{key:"suggestion",fn:function(t){var i=t.data,n=t.htmlText;return[o("div",{staticClass:"d-flex align-items-center"},["station"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==i.type?o("span",[o("font-awesome-icon",{attrs:{icon:"plane"}})],1):o("span",[o("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),e._v(" "),o("span",{staticClass:"ml-4",domProps:{innerHTML:e._s(n)}})])]}}]),model:{value:e.location,callback:function(t){e.location=t},expression:"location"}},[o("template",{slot:"prepend"}),e._v(" "),e._v(" "),o("template",{slot:"append"})],2)],1)}),[],!1,null,null,null).exports;const g={biqPublicKey:{type:String,required:!0,default:""},biqPlacesLookup:{type:String,required:!0,default:"//places/?term="},biqQuotesFrom:{type:String,required:!0,default:"//booking/quote/"},idPrefix:{type:String,default:"biq"},searchOnLoad:{type:Boolean,default:!1},debugging:{type:Boolean,default:!1}},m={...n.c},f={hasReturn:function(){return this.fields.journey_type.selected===s.a}},b={journeyDateTimeErrorState:function(e){return null!==this.errors[e]?!this.errors[e].length:null},onPlacesLookupError:function(e){this.debugging&&(console.group(e.data.message),console.log(e),console.groupEnd())}},v={props:{...n.a.props,...g},components:{"biq-places-lookup":p,"biq-process-form-submit":()=>o.e(7).then(o.bind(null,267))},data(){return{fields:Object(s.c)(this.idPrefix),date:"",time:"",return_date:"",return_time:"",errors:{date:null,time:null,return_date:null,return_time:null},date_picker_formats:{short:{year:"numeric",month:"short",day:"2-digit"},medium:{year:"numeric",month:"short",day:"2-digit",weekday:"short"}}}},mounted(){this.setFieldValues(),this.searchOnLoad&&this.onSearchQuotesFormSubmit({})},computed:{...Object(i.c)(["searchDetails","loadingQuotes"]),...f},methods:{...n.a.methods,...b,setFieldValues:function(){const e=this.searchDetails;this.debugging&&console.log("BIQ Search Form from State",e),this.fields.journey_type.selected=e.journey_type,this.fields.pickup.value=e.pickup,this.fields.destination.value=e.destination,e.vias.length&&(this.fields.via.value=e.vias[0]),this.fields.people.value=e.people,this.date=e.date,this.time=e.time,this.hasReturn&&null!==e.returning.date&&(this.return_date=e.returning.date),this.hasReturn&&null!==e.returning.time&&(this.return_time=e.returning.time),this.$nextTick(()=>{this.$refs.pickupfield.inputValue=this.fields.pickup.value,this.$refs.destinationfield.inputValue=this.fields.destination.value,this.$refs.viafield.inputValue=this.fields.via.value})},onSearchQuotesFormSubmit:function(e){e.data={validate:()=>this.validate(),formValues:()=>this.formValues()},this.$emit(m.submit.name,e)},validate:function(){this.errors={date:null,time:null,return_date:null,return_time:null};let e=0;this.validateValues()||e++,null!=this.date&&""!=this.date||(this.errors.date="Journey date is invalid",e++),null!=this.time&&""!=this.time||(this.errors.time="Journey time is invalid",e++),this.hasReturn&&(null!=this.return_date&&""!=this.return_date||(this.errors.return_date="Journey return date is invalid",e++),null!=this.return_time&&""!=this.return_time||(this.errors.return_time="Journey return time is invalid",e++));const t=0===e;return this.emitValidationEvent(t),t},emitValidationEvent:function(e){let t=m.validated.name;const o={data:{values:{...this.inputValues()}}};e||(t=m.validationError.name,o.data.errors={...this.validationErrors(),...this.errors},this.debugging&&(console.group("BIQ Search Form Validation Error"),console.log("Validation Error Fields",{...this.validationErrors()}),console.log("Validation Error",o.data.errors),console.groupEnd())),this.$emit(t,o)},formValues:function(){const e=this.inputValues(),t={journey_type:e.journey_type,pickup:e.pickup,destination:e.destination,people:e.people,date:this.date,time:this.time,hasReturn:this.hasReturn};t.hasReturn?t.returning={date:this.return_date,time:this.return_time}:t.returning={date:null,time:null};const o=this.fields.via.value;return t.vias=""!=o?[o]:[],t}}};t.a=v},88:function(e,t,o){"use strict";var i=o(52),n=o(87),s=o(38),r=o(17);const a={column:{name:"column",tag:"the-biq-search-form-column",component:()=>o.e(13).then(o.bind(null,282))},compact:{name:"compact",tag:"the-biq-search-form-compact",component:()=>o.e(14).then(o.bind(null,283))}},u={...n.b,layout:{type:String,default:a.compact.name,required:!0,validator:e=>Object.keys(a).indexOf(e)>-1}},l={...s.c,...r.e};var c={name:"TheSearchForm",props:u,computed:{useLayout:function(){switch(this.layout){case a.compact.name:return a.compact.tag;case a.column.name:return a.column.tag}}},methods:{onSubmit:function(e){e.data.defaultAction=()=>{const{validate:t,formValues:o}=e.data;t()&&this.searchApiQuotes(o())},e.data.searchApiQuotes=e=>this.searchApiQuotes(e),this.$emit(l.submit.name,e)},onValidated:function(e){this.$emit(l.validated.name,e)},onValidationError:function(e){this.$emit(l.validationError.name,e)},searchApiQuotes:function(e){const t=this;this.debugging&&console.group(`Searching BIQ API Quotes from '${this.biqQuotesFrom}'`),Object(i.c)(this.biqQuotesFrom,this.biqPublicKey,e,this.debugging).then(e=>{const o=e.count?l.biqQuotesSearched.name:l.biqZeroQuotes.name;t.$emit(o,e),t.debugging&&(console.info("BIQ API Quotes Searched"),console.groupEnd())}).catch(e=>{t.$emit(l.biqQuotesError.name,e),t.debugging&&(console.info("BIQ API Quotes Search Error"),console.groupEnd())})},onBiqQuotesSearched:function(e){this.$emit(l.biqQuotesSearched.name,e)},onBiqZeroQuotes:function(e){this.$emit(l.biqZeroQuotes.name,e)},onBiqQuotesError:function(e){this.$emit(l.biqQuotesError.name,e)}},components:{...(e=>{const t=Object.keys(e).map(t=>[e[t].tag,e[t].component]);return Object.fromEntries(t)})(a)}},d=o(19),h=Object(d.a)(c,(function(){var e=this,t=e.$createElement;return(e._self._c||t)(e.useLayout,{tag:"component",attrs:{"biq-public-key":e.biqPublicKey,"biq-places-lookup":e.biqPlacesLookup,"biq-quotes-from":e.biqQuotesFrom,"search-on-load":e.searchOnLoad,debugging:e.debugging,"id-prefix":"biq"},on:{submit:e.onSubmit,validated:e.onValidated,validationError:e.onValidationError}})}),[],!1,null,null,null);t.a=h.exports}},0,[7,10,12]]);
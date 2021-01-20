(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{75:function(t,e){t.exports={QUOTE_URL:"https://api.taxicode.com/booking/quote/",JOURNEY_URL:"https://api.taxicode.com/booking/journey/?id=",CLIENT_SECRET_URL:"https://api.taxicode.com/booking/client_gateway_secret/",PAYMENT_URL:"https://api.taxicode.com/booking/pay/",PGH_CONF:{style:{base:{fontFamily:"'Muli', sans-serif",fontSize:"14px",color:"#333"},invalid:{color:"red"}},hidePostalCode:!0}}},79:function(t,e,i){"use strict";i.r(e);var s=i(15),a=i(30),o=i(37),n=i(36),r=i(33),l=i(22),c=i(28),d=i(52),u=i(53),p=(i(41),i(42),{name:"App"}),m=i(16),h=Object(m.a)(p,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"vue-frontend-app"}},[e("router-view")],1)}),[],!1,null,null,null).exports,_=i(26),v=i(18),g=i.n(v),f=i(34),b={name:"search",components:{"vue-bootstrap-typeahead":r.a},props:{postData:[]},data:()=>({journey_options:["One Way","Return"],type_map:{cheapest:"Cheapest Price",exec:"Best Executive",luxury:"Best Luxury",chauffeur:"Best Chauffeur"},journey_type:"One Way",pickup:"",via:"",vialocations:[],pickuplocations:[],destinationlocations:[],destination:"",date:"",time:"",return_date:"",return_time:"",people:"1",quotes:[],journey_id:"",loading:!1,errors:{pickup:!1,destination:!1,date:null,time:null,people:!1},quote_settings:"",noquotes:!1}),watch:{pickup:f.a.debounce((function(t){this.locationSearch(t,"pickup")}),500),destination:f.a.debounce((function(t){this.locationSearch(t,"destination")}),500),via:f.a.debounce((function(t){this.locationSearch(t,"via")}),500)},created(){this.postData=postData,this.mapPostToForm(),this.quote_settings=quote_settings},mounted(){this.$refs.pickupfield.inputValue=this.pickup,this.$refs.destinationfield.inputValue=this.destination,this.$refs.viafield.inputValue=this.via,this.postData.search_on_load&&this.submitForm()},methods:{mapPostToForm:function(){void 0!==this.postData.journey_type&&(this.journey_type=this.postData.journey_type),void 0!==this.postData.pickup&&(this.pickup=this.postData.pickup),void 0!==this.postData.destination&&(this.destination=this.postData.destination),void 0!==this.postData.via&&(this.via=this.postData.via),void 0!==this.postData.date&&(this.date=this.postData.date),void 0!==this.postData.time&&(this.time=this.postData.time),void 0!==this.postData.people&&(this.people=this.postData.people),void 0!==this.postData.return_date&&(this.return_date=this.postData.return_date),void 0!==this.postData.return_time&&(this.return_time=this.postData.return_time)},setPrice:function(t){this.$store.commit("setPrice",t)},queryApi:function(){this.loading=!0,this.noquotes=!1;let t=config.QUOTE_URL+"?key="+tc_public_key+"&pickup="+this.pickup+"&destination="+this.destination+"&date="+this.date+" "+this.time+"&people="+this.people;"Return"==this.journey_type&&(t=t+"&return="+this.return_date+" "+this.return_time),""!=this.via&&(t=t+"&via="+this.via),g.a.get(t).then(function(t){this.loading=!1,0!=t.data.quotes.length?("type_class"==this.quote_settings?this.quotes=this.reduceToTypeAndClass(t.data.quotes):this.quotes=t.data.quotes,this.journey_id=t.data.journey_id):(this.quotes=[],this.noquotes=!0)}.bind(this))},reduceToTypeAndClass:function(t){let e=this.formatQuotes(t);console.log(e);let i={};return i.cheapest=e.sorted.recommended[0],i.exec=e.sorted.executive[0],i.luxury=e.sorted.vip[0],i.chauffeur=e.sorted.chauffeur[0],console.log(i),i},formatQuotes:function(t){let e={},i={};for(let s in t){let a=t[s];if(a.active){e[s]=a,a.quote_id=s;for(let t=0;t<a.vehicles.length;t++){let e={...a};e.vehicle=a.vehicles[t],e.vehicle.index=t,e.price=e.vehicle.price;let s=e.vehicle.type.class;delete e.vehicles,i.hasOwnProperty("recommended")||(i.recommended=[]),e.highlight&&(0===t?i.recommended.push(e):e.highlight=!1),i.hasOwnProperty("all")||(i.all=[]),i.all.push(e),i.hasOwnProperty(s)||(i[s]=[]),i[s].push(e)}}}for(let t in i)i[t]=this.sortQuotes(i[t],"SORT_BY_PRICE");return{raw:e,sorted:i}},sortQuotes:function(t,e){switch(e){case"SORT_BY_PRICE":return t.sort((function(t,e){return t.price>e.price?1:e.price>t.price?-1:0}));case"SORT_BY_RATING":return t.sort((function(t,e){return t.rating.score>e.rating.score?-1:e.rating.score>t.rating.score?1:0}));default:return t}},submitForm:function(){this.validQuote()&&this.queryApi()},validQuote(){var t=!0;return""==this.pickup?(this.errors.pickup="Pickup location must be set",t=!1):this.errors.pickup=!1,""==this.destination?(this.errors.destination="Pickup location must be set",t=!1):this.errors.destination=!1,""==this.date?(this.errors.date=!1,t=!1):this.errors.date=null,""==this.time?(this.errors.time=!1,t=!1):this.errors.time=null,""==this.people?(this.errors.people,t=!1):this.errors.people=!1,t},flipImage:function(t,e){let i=this.quotes[t].vehicles[e.target.value].price;this.$refs[t][2].$el.setAttribute("data-price",i),this.$refs[t][0].src=this.quotes[t].vehicles[e.target.value].image,this.$refs[t][1].innerHTML="&pound;"+i+".00",this.setPrice(i+".00")},setPriceBeforeTransition:function(t,e){this.setPrice(e.target.dataset.price+".00")},locationSearch(t,e="pickup"){let i=[],s=[],a=[];g.a.get("https://api.taxicode.com/places/?term="+t).then(t=>{void 0!==t.data.results.STATION&&(s=t.data.results.STATION.map((function(t){return{string:t,type:"station"}}))),void 0!==t.data.results.AIRPORT&&(i=t.data.results.AIRPORT.map((function(t){return{string:t,type:"airport"}}))),void 0!==t.data.results.LOCATION&&(a=t.data.results.LOCATION.map((function(t){return{string:t,type:"location"}})));const o=i.concat(s.concat(a.concat(t.data.results.GOOGLE)));"pickup"==e?this.pickuplocations=o:"via"==e?this.vialocations=o:this.destinationlocations=o})}}},y=Object(m.a)(b,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("form",{attrs:{id:"searchform"}},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-6",attrs:{id:"tcplugin-journey-type"}},[i("div",{staticClass:"form-group"},[i("label",[t._v("Journey type")]),t._v(" "),i("b-form-select",{attrs:{options:t.journey_options},model:{value:t.journey_type,callback:function(e){t.journey_type=e},expression:"journey_type"}})],1)])]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-pickup"}},[i("label",[t._v("Pickup")]),t._v(" "),i("vue-bootstrap-typeahead",{ref:"pickupfield",attrs:{inputClass:t.errors.pickup?"is-invalid":"",data:t.pickuplocations,serializer:function(t){return t.string},placeholder:"Pickup postcode or place name"},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.pickup,callback:function(e){t.pickup=e},expression:"pickup"}})],1)]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-destination"}},[i("label",[t._v("Destination")]),t._v(" "),i("vue-bootstrap-typeahead",{ref:"destinationfield",attrs:{inputClass:t.errors.destination?"is-invalid":"",data:t.destinationlocations,serializer:function(t){return t.string},placeholder:"Destination postcode or place name"},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.destination,callback:function(e){t.destination=e},expression:"destination"}})],1)])]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-via"}},[i("label",[t._v("(Optional) Via")]),t._v(" "),i("vue-bootstrap-typeahead",{ref:"viafield",attrs:{inputClass:t.errors.via?"is-invalid":"",data:t.vialocations,serializer:function(t){return t.string},placeholder:"Via postcode or place name"},on:{hit:function(e){t.selectedLocation=e}},scopedSlots:t._u([{key:"suggestion",fn:function(e){var s=e.data,a=e.htmlText;return[i("div",{staticClass:"d-flex align-items-center"},["station"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"train"}})],1):"airport"==s.type?i("span",[i("font-awesome-icon",{attrs:{icon:"plane"}})],1):i("span",[i("font-awesome-icon",{attrs:{icon:"map-marker-alt"}})],1),t._v(" "),i("span",{staticClass:"ml-4",domProps:{innerHTML:t._s(a)}})])]}}]),model:{value:t.via,callback:function(e){t.via=e},expression:"via"}})],1),t._v(" "),i("div",{staticClass:"col",attrs:{id:"tcplugin-people"}},[i("div",{staticClass:"form-group"},[i("label",[t._v("Number of People")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.people,expression:"people"}],staticClass:"form-control",class:t.errors.people?"is-invalid":"",attrs:{type:"number",placeholder:"People"},domProps:{value:t.people},on:{input:function(e){e.target.composing||(t.people=e.target.value)}}})])])]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-date"}},[i("label",[t._v("Date")]),t._v(" "),i("b-form-datepicker",{staticClass:"form-control",attrs:{locale:"en",state:t.errors.date},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}})],1)]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-time"}},[i("label",[t._v("Time")]),t._v(" "),i("b-form-timepicker",{attrs:{locale:"en",state:t.errors.time},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}})],1)])]),t._v(" "),"Return"==t.journey_type?i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-return-date"}},[i("div",{staticClass:"form-group"},[i("label",[t._v("Return Date")]),t._v(" "),i("b-form-datepicker",{staticClass:"form-control",attrs:{locale:"en",state:t.errors.return_date},model:{value:t.return_date,callback:function(e){t.return_date=e},expression:"return_date"}})],1)]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-return-time"}},[i("label",[t._v("Return Time")]),t._v(" "),i("b-form-timepicker",{attrs:{locale:"en",state:t.errors.return_time},model:{value:t.return_time,callback:function(e){t.return_time=e},expression:"return_time"}})],1)])]):t._e(),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col"}),t._v(" "),i("div",{staticClass:"col",attrs:{id:"tcplugin-search-submit"}},[i("div",{staticClass:"form-group"},[i("label"),t._v(" "),i("input",{staticClass:"form-control",attrs:{type:"button",value:"Search"},on:{click:t.submitForm}})])])])]),t._v(" "),i("div",{attrs:{id:"results"}},[t.loading?i("div",[t._v("\n            Loading...\n        ")]):t._e(),t._v(" "),t.noquotes?i("div",[t._v("\n            Sorry, we could not find any quotes for the selected journey.  Please try a different journey.\n        ")]):t._e(),t._v(" "),"type_class"!=t.quote_settings?i("div",{staticClass:"row"},t._l(t.quotes,(function(e,s){return i("div",{staticClass:"col-sm-auto"},["best"==t.quote_settings?i("div",[e.highlight?i("div",{staticClass:"card",staticStyle:{width:"18rem"}},[i("img",{ref:s,refInFor:!0,staticClass:"card-img-top",attrs:{src:e.vehicles[0].image,alt:"Vehicle type image"}}),t._v(" "),i("div",{staticClass:"card-header"},[t._v("\n                            "+t._s(e.highlight)+"\n                        ")]),t._v(" "),i("div",{staticClass:"card-body"},[i("h5",{staticClass:"card-title"},[t._v(t._s(e.company_name))]),t._v(" "),i("p",{ref:s,refInFor:!0,staticClass:"card-text text-center display-4",attrs:{id:"selected_price"}},[t._v("£"+t._s(e.vehicles[0].price)+".00")]),t._v(" "),i("select",{staticClass:"custom-select",on:{change:function(e){return t.flipImage(s,e)}}},t._l(e.vehicles,(function(s,a){return i("option",{attrs:{"data-image":s.image,"data-price":s.price},domProps:{value:a},model:{value:e.selected_vehicle,callback:function(i){t.$set(e,"selected_vehicle",i)},expression:"quote.selected_vehicle"}},[t._v("\n                                    "+t._s(s.name)+"\n                                ")])})),0),t._v(" "),i("router-link",{ref:s,refInFor:!0,staticClass:"btn btn-primary btn-block",attrs:{"data-price":e.vehicles[0].price,to:{name:"Checkout",params:{quote_id:s,journey_id:t.journey_id}}},nativeOn:{click:function(e){return t.setPriceBeforeTransition(s,e)}}},[t._v("Book Now")])],1)]):t._e()]):i("div",{staticClass:"card",staticStyle:{width:"18rem"}},[i("img",{ref:s,refInFor:!0,staticClass:"card-img-top",attrs:{src:e.vehicles[0].image,alt:"Vehicle type image"}}),t._v(" "),i("div",{staticClass:"card-body"},[i("h5",{staticClass:"card-title"},[t._v(t._s(e.company_name))]),t._v(" "),i("p",{ref:s,refInFor:!0,staticClass:"card-text text-center display-4",attrs:{id:"selected_price"}},[t._v("£"+t._s(e.vehicles[0].price)+".00")]),t._v(" "),i("select",{staticClass:"custom-select",on:{change:function(e){return t.flipImage(s,e)}}},t._l(e.vehicles,(function(s,a){return i("option",{attrs:{"data-image":s.image,"data-price":s.price},domProps:{value:a},model:{value:e.selected_vehicle,callback:function(i){t.$set(e,"selected_vehicle",i)},expression:"quote.selected_vehicle"}},[t._v("\n                                "+t._s(s.name)+"\n                            ")])})),0),t._v(" "),i("router-link",{ref:s,refInFor:!0,staticClass:"btn btn-primary btn-block",attrs:{"data-price":e.vehicles[0].price,to:{name:"Checkout",params:{quote_id:s,journey_id:t.journey_id}}},nativeOn:{click:function(e){return t.setPriceBeforeTransition(s,e)}}},[t._v("Book Now")])],1)])])})),0):i("div",{staticClass:"row"},t._l(t.quotes,(function(e,s){return i("div",{staticClass:"col-sm-auto"},[i("div",{staticClass:"card",staticStyle:{width:"18rem"}},[i("img",{ref:e.quote_id,refInFor:!0,staticClass:"card-img-top",attrs:{src:e.vehicle.image,alt:"Vehicle type image"}}),t._v(" "),i("div",{staticClass:"card-header"},[t._v("\n                        "+t._s(t.type_map[s])+"\n                    ")]),t._v(" "),i("div",{staticClass:"card-body"},[i("h6",{staticClass:"card-subtitle mb-2 text-muted"},[t._v(t._s(e.vehicle.name))]),t._v(" "),i("div",{staticClass:"card-text d-flex justify-content-center align-items-center"},[i("div",{staticClass:"badge badge-pill badge-secondary"},[i("font-awesome-icon",{attrs:{icon:"users"}}),t._v(" "+t._s(e.vehicle.passengers))],1),t._v(" "),i("div",[t._v(" ")]),t._v(" "),i("div",{staticClass:"badge badge-pill badge-secondary"},[i("font-awesome-icon",{attrs:{icon:"suitcase"}}),t._v(" "+t._s(e.vehicle.luggage_small))],1)]),t._v(" "),i("p",{ref:e.quote_id,refInFor:!0,staticClass:"card-text text-center display-4",attrs:{id:"selected_price"}},[t._v("£"+t._s(e.price)+".00")]),t._v(" "),i("router-link",{ref:e.quote_id,refInFor:!0,staticClass:"btn btn-primary btn-block",attrs:{"data-price":e.price,to:{name:"Checkout",params:{quote_id:e.quote_id,journey_id:t.journey_id}}},nativeOn:{click:function(e){return t.setPriceBeforeTransition(t.id,e)}}},[t._v("Book Now")])],1)])])})),0)])])}),[],!1,null,null,null).exports;class C{constructor(t,e,i,s){this.setAmount=this.setAmount.bind(this),this.getHandlerName=this.getHandlerName.bind(this),this.getAmount=this.getAmount.bind(this),this.getDescription=this.getDescription.bind(this),this.updateAmount=this.updateAmount.bind(this),this.initialise=this.initialise.bind(this),this.getSourceCardToken=this.getSourceCardToken.bind(this),this.getClientSecretIntent=this.getClientSecretIntent.bind(this),this.getCustomerToken=this.getCustomerToken.bind(this),this.setCustomerToken=this.setCustomerToken.bind(this),this.paymentHandlerName="jstoken_stripe",this.country="GB",this.currency="gbp",this.amount=0,this.description="",this.pk=t,this.transactionSuccessCB=e,this.transactionFailCB=i,this.customer_token=null,this.intent_secret_uri=s,this.stripe=Stripe(this.pk),this.stripeElements=this.stripe.elements(),this.elementCreated=!1,this.elementMounted=!1,this.elementMountedOn="card",this.handler={transactionSuccess:this.transactionSuccessCB,transactionFail:this.transactionFailCB,getClientSecretIntent:this.getClientSecretIntent,stripe:this.stripe,stripeElements:this.stripeElements},this.publicHandler={getHandlerName:this.getHandlerName,getAmount:this.getAmount,getDescription:this.getDescription,updateAmount:this.updateAmount,getCustomerToken:this.getCustomerToken,setCustomerToken:this.setCustomerToken}}getHandlerName(){return this.paymentHandlerName}getAmount(){return this.amount}getDescription(){return this.description}setAmount(t,e){this.amount=100*t,this.description=e}updateAmount(t){this.amount=100*t}getCustomerToken(){return this.customer_token}setCustomerToken(t){this.customer_token=t}getClientSecretIntent(t,e,i){this.getAmount();const s=this.getHandlerName(),a=(this.getCustomerToken(),this.intent_secret_uri);return new Promise((function(o,n){const r={key:t,quote:e,vehicle:i,handler:s};$.ajax({type:"POST",url:a,data:r,dataType:"json",success:function(t){o(t.client_secret)},error:function(t,e,i){let s;console.group("Failed to get a client secret response from `${intent_secret_uri}`."),console.warn(`The error message received was: '${e}'`),console.info(r);try{const e=JSON.parse(t.responseText);s=e.error,console.log(e)}catch(t){s=t}console.groupEnd(),n(s)}})}))}getSourceCardToken(t,e,i,s,a){const o=this.handler,n=this.publicHandler,r=this.card;this.getClientSecretIntent(t,e,i).then((function(t){o.stripe.confirmCardPayment(t,{payment_method:{card:r,billing_details:{name:s,address:{postal_code:a}}}},{handleActions:!1}).then((function(e){if(e.error)o.transactionFail(n,e.error);else{if(e.paymentIntent.hasOwnProperty("status")&&"succeeded"===e.paymentIntent.status)return void o.transactionSuccess(n,e.paymentIntent);o.stripe.confirmCardPayment(t).then((function(t){t.error?o.transactionFail(n,t.error):o.transactionSuccess(n,t.paymentIntent)}))}}))}))}mountElement(){this.elementMounted||(this.card.mount(this.elementMountedOn),this.elementMounted=!0)}unmountElement(){this.elementMounted&&(this.card.unmount(this.elementMountedOn),this.elementMounted=!1)}initialise(t,e){console.log(e),console.log(t),this.card=this.stripeElements.create("card",e),this.elementMountedOn=t}}var k={name:"Checkout",props:{cardFormHandler:{type:Object,default:null}},computed:{price(){return this.$store.state.price}},data:()=>({name:"",email:"",telephone:"",flight_number:null,quote_id:null,journey_id:null,vehicle:0,journey_data:{},amount:0,cardholder_name:"",billing_postcode:"",errors:{name:!1,email:!1,telephone:!1},test_mode:0,loading:!1,payment_method:"Pay with card",payment_options:["Pay with card","Pay with Paypal"],posterror:!1}),created(){const t=this;this.paypal_token=paypal_token,this.test_mode=test_mode,this.quote_id=this.$route.params.quote_id,this.journey_id=this.$route.params.journey_id,g.a.get(config.JOURNEY_URL+this.journey_id+"&include_quote=true").then(function(e){console.log(e.data),t.journey_data=e.data.journey}.bind(this)),this.cardFormHandler=new C(gateway_api_key,(function(e,i){t.makeBooking(i.id,e.getHandlerName())}),(function(e,i){t.loading=0,t.hasCardErrors=!0,t.$forceUpdate()}),config.CLIENT_SECRET_URL),console.log("created")},mounted:function(){this.cardFormHandler.setAmount(this.$store.state.price,"Taxi journey"),this.cardFormHandler.initialise(this.$refs.card,config.PGH_CONF),this.cardFormHandler.mountElement(),console.log("mounted")},methods:{isCardPayment:function(){return"Pay with card"==this.payment_method},validate:function(){this.errors={name:!1,email:!1,telephone:!1};let t=0;return""==this.name&&(this.errors.name="Booking name must be set",t++),""==this.email&&(this.errors.email="Email location must be set",t++),""==this.telephone&&(this.errors.telephone="Telephone must be set",t++),this.isCardPayment()&&(this.errors.cardholder_name=!1,this.errors.billing_postcode=!1,""==this.cardholder_name&&(this.errors.cardholder_name="Cardholder name must be set",t++),""==this.billing_postcode&&(this.errors.billing_postcode="Billing address postcode must be set",t++)),0==t},onMethodChanged:function(){if(this.isCardPayment()){const t=this;this.$nextTick((function(){console.log("mounting card"),t.cardFormHandler.mountElement()}))}else this.cardFormHandler.UnmountElement()},onPaypalSubmit:function(t){this.validate()&&(this.posterror=!1,this.loading=1,this.makeBooking(t.nonce,"paypal"))},onPaypalError:function(t){console.error(t)},onLoadFail:function(t){console.error(t)},onStripeSubmit:function(){this.validate()&&(this.posterror=!1,this.loading=1,this.cardFormHandler.getSourceCardToken(this.cardholder_name,this.billing_postcode))},makeBooking:function(t,e){const i=new FormData;i.append("email",this.email),i.append("name",this.name),i.append("telephone",this.telephone),i.append("key",tc_public_key),i.append("quote",this.quote_id),i.append("vehicle",this.vehicle),i.append("test",this.test_mode),i.append("new_pay",!0),i.append("payment_token",t),i.append("method",e),g.a.post(config.PAYMENT_URL,i,{headers:{"Content-Type":"application/application/x-www-form-urlencoded"}}).then(function(t){"OK"==t.data.status?this.$router.push({name:"Complete",params:{booking_ref:t.data.reference}}):(this.posterror=t.data.error,this.loading=0)}.bind(this)).catch(function(t){this.loading=0}.bind(this))}}},w=Object(m.a)(k,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("form",{attrs:{id:"purchaseform"}},[t._m(0),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-passenger-name"}},[i("div",{staticClass:"form-group"},[i("label",{attrs:{for:"customer_name"}},[t._v("Name")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"form-control",class:t.errors.name?"is-invalid":"",attrs:{type:"text",id:"customer_name","aria-describedby":"nameHelp",placeholder:"Enter your name",required:""},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),t._v(" "),i("small",{staticClass:"form-text text-muted",attrs:{id:"nameHelp"}},[t._v("The name of the person travelling,")])])]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-email"}},[i("label",{attrs:{for:"customer_email"}},[t._v("Email")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"form-control",class:t.errors.email?"is-invalid":"",attrs:{type:"email",id:"customer_email","aria-describedby":"emailHelp",placeholder:"Enter your email",required:""},domProps:{value:t.email},on:{input:function(e){e.target.composing||(t.email=e.target.value)}}}),t._v(" "),i("small",{staticClass:"form-text text-muted",attrs:{id:"emailHelp"}},[t._v("We'll never share your email with anyone else.")])])])]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-passenger-telephone"}},[i("div",{staticClass:"form-group"},[i("label",{attrs:{for:"telephone"}},[t._v("Mobile telephone")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.telephone,expression:"telephone"}],staticClass:"form-control",class:t.errors.telephone?"is-invalid":"",attrs:{type:"text",id:"telephone","aria-describedby":"mobileHelp",placeholder:"Enter a mobile number",required:""},domProps:{value:t.telephone},on:{input:function(e){e.target.composing||(t.telephone=e.target.value)}}}),t._v(" "),i("small",{staticClass:"form-text text-muted",attrs:{id:"mobileHelp"}},[t._v("Valid UK mobile numbers only, please")])])]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"form-group",attrs:{id:"tcplugin-flight-number"}},[i("label",{attrs:{for:"flight_number"}},[t._v("Flight #")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.flight_number,expression:"flight_number"}],staticClass:"form-control",attrs:{type:"text",id:"flight_number","aria-describedby":"flightHelp",placeholder:"Enter your flight number"},domProps:{value:t.flight_number},on:{input:function(e){e.target.composing||(t.flight_number=e.target.value)}}}),t._v(" "),i("small",{staticClass:"form-text text-muted",attrs:{id:"flightHelp"}},[t._v("If this is an airport pickup or dropoff, the relevent flight number")])])])]),t._v(" "),t._m(1),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-payament-select"}},[t._v("\n                Select Payment Method:\n            ")]),t._v(" "),i("div",{staticClass:"col"},[i("b-form-select",{attrs:{options:t.payment_options},on:{change:t.onMethodChanged},model:{value:t.payment_method,callback:function(e){t.payment_method=e},expression:"payment_method"}})],1)]),t._v(" "),"Pay with card"==t.payment_method?i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-cardholder-name"}},[i("div",{staticClass:"form-group"},[i("label",{staticClass:"control-label",attrs:{for:"card-holder-name"}},[t._v("Cardholder Name")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.cardholder_name,expression:"cardholder_name"}],staticClass:"form-control",class:t.errors.cardholder_name?"is-invalid":"",attrs:{id:"card-holder-name",type:"text",placeholder:"Cardholder name"},domProps:{value:t.cardholder_name},on:{input:function(e){e.target.composing||(t.cardholder_name=e.target.value)}}})])]),t._v(" "),i("div",{staticClass:"col",attrs:{id:"tcplugin-stripe-card-details"}},[i("div",{staticClass:"form-group"},[i("label",{staticClass:"control-label",attrs:{for:"card"}},[t._v("Card Details")]),t._v(" "),i("div",{ref:"card",staticClass:"form-control",attrs:{id:"card"}})]),t._v(" "),i("div",{staticClass:"col",attrs:{id:"tcplugin-billing_postcode"}},[i("div",{staticClass:"form-group"},[i("label",{staticClass:"control-label",attrs:{for:"billing-postcode"}},[t._v("Billing Postcode")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.billing_postcode,expression:"billing_postcode"}],staticClass:"form-control",class:t.errors.billing_postcode?"is-invalid":"",attrs:{id:"billing-postcode",type:"text",placeholder:"Billing Postcode"},domProps:{value:t.billing_postcode},on:{input:function(e){e.target.composing||(t.billing_postcode=e.target.value)}}})])]),t._v(" "),i("div",{staticClass:"form-group"},[i("input",{staticClass:"btn btn-primary",attrs:{type:"button",value:0==t.loading?"Book Now":"Processing",disabled:1==t.loading},on:{click:t.onStripeSubmit}})])])]):i("div",{staticClass:"row"},[i("div",{staticClass:"col"}),t._v(" "),i("div",{staticClass:"col",attrs:{id:"tcplugin-paypal-plugin"}},[i("div",{staticClass:"form-group"},[i("label",{staticClass:"control-label",attrs:{for:"paypal"}},[t._v("Or Pay With Paypal")]),t._v(" "),i("v-braintree",{attrs:{authorization:t.paypal_token,paypal:{flow:"checkout",amount:t.price,currency:"GBP"}},on:{success:t.onPaypalSubmit,error:t.onPaypalError,loadFail:t.onLoadFail},scopedSlots:t._u([{key:"button",fn:function(e){return[i("div",{staticClass:"form-group"},[i("input",{staticClass:"btn btn-primary",attrs:{type:"button",value:0==t.loading?"Book Now":"Processing",disabled:1==t.loading},on:{click:e.submit}})])]}}])})],1)])]),t._v(" "),t.posterror?i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-payment-error"}},[t._v("\n                "+t._s(t.posterror)+"\n            ")])]):t._e(),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col",attrs:{id:"tcplugin-checkout-booking-details"}},[i("div",{staticClass:"card"},[i("div",{staticClass:"card-header"},[t._v("\n                        Booking Details\n                    ")]),t._v(" "),i("ul",{staticClass:"list-group list-group-flush"},[i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Date:")]),t._v(" "+t._s(t.journey_data.date)+" at "+t._s(t.journey_data.time)+"\n                        ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Travelling From:")]),t._v(" "+t._s(t.journey_data.pickup)+"\n                        ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Going To:")]),t._v(" "+t._s(t.journey_data.destination)+"\n                        ")]),t._v(" "),t.journey_data.via?i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Via:")]),t._v(" "+t._s(t.journey_data.vias[0].string)+"\n                        ")]):t._e(),t._v(" "),t.journey_data.return?i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Returning:")]),t._v(" "+t._s(t.journey_data.return)+" at "+t._s(t.journey_data.return_time)+"\n                        ")]):t._e(),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Price:")]),t._v(" £"+t._s(t.price)+"\n                        ")])])])])])])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"row"},[e("div",{staticClass:"col"},[e("h4",{attrs:{id:"tc_plugin-passenger-heading"}},[this._v("Passenger Details")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"row"},[e("div",{staticClass:"col"},[e("h4",{attrs:{id:"tc_plugin-payment-heading"}},[this._v("Payment Details")])])])}],!1,null,"5405e480",null).exports,x={name:"Complete.vue",data:()=>({booking_ref:"",booking_name:"",booking_date:"",booking_from:"",booking_to:"",complete_page_text:""}),created(){this.complete_page_text=complete_page_text,this.booking_ref=this.$route.params.booking_ref,g.a.get("/wp-json/taxicode/v1/booking-details/?booking_ref="+this.booking_ref).then(function(t){this.booking_name=t.data.booking.passenger.name,this.booking_date=t.data.booking.date_elements.day+" "+t.data.booking.date_elements.month+" "+t.data.booking.date_elements.year+" at "+t.data.booking.date_elements.hours+":"+t.data.booking.date_elements.minutes,this.booking_from=t.data.booking.pickup.string,this.booking_to=t.data.booking.destination.string}.bind(this))}},P=Object(m.a)(x,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"completePage"}},[i("h3",[t._v("Your booking is complete")]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("p",[t._v(t._s(t.complete_page_text))])]),t._v(" "),i("div",{staticClass:"col"},[i("div",{staticClass:"card"},[i("div",{staticClass:"card-header"},[t._v("\n                    Booking Details\n                ")]),t._v(" "),i("ul",{staticClass:"list-group list-group-flush"},[i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Booking Reference:")]),t._v(" "+t._s(t.booking_ref)+"\n                    ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Name:")]),t._v(" "+t._s(t.booking_name)+"\n                    ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Date:")]),t._v(" "+t._s(t.booking_date)+"\n                    ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Travelling From:")]),t._v(" "+t._s(t.booking_from)+"\n                    ")]),t._v(" "),i("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[i("strong",[t._v("Going To:")]),t._v(" "+t._s(t.booking_to)+"\n                    ")])])])])])])}),[],!1,null,"1f022d16",null).exports;s.default.use(_.a);var T=new _.a({routes:[{path:"/",name:"Home",component:y},{path:"/checkout/:quote_id/:journey_id",name:"Checkout",component:w},{path:"/complete/:booking_ref",name:"Complete",component:P}]}),j=i(55),S=i(38);s.default.use(a.a);var q=new a.a.Store({state:{price:0},mutations:{setPrice(t,e){t.price=e}},plugins:[Object(j.a)({getState:t=>S.getJSON(t),setState:(t,e)=>S.set(t,e,{expires:3,secure:!0})})]});l.c.add(c.b,c.d,c.a,c.e,c.c),s.default.component("font-awesome-icon",d.a);const O=i(75);window.config=O,s.default.use(o.a),s.default.use(n.a),s.default.use(a.a),s.default.use(r.a),s.default.use(u.a),s.default.config.productionTip=!1,new s.default({el:"#vue-frontend-app",router:T,store:q,render:t=>t(h)})}},[[79,0,1]]]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{268:function(e,t,s){"use strict";const i={props:{appConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},debugging:{type:Boolean,default:!1}}};t.a=i},272:function(e,t,s){},273:function(e,t,s){},278:function(e,t,s){"use strict";s.r(t);var i=s(23),a=s(268),r=s(17),n=s(41),l=s(38);var o={name:"PassengerDetailsForm",props:{heading:{type:String,default:"Passenger Details"},values:{type:Object,default:function(){return{name:"",email:"",telephone:"",flight_number:""}}}},mixins:[n.b],data(){return{fields:(e="biq",{name:{value:"",label:"Name",required:!0,error:null,errorMsg:"Booking name must be set",id:e+"-customer_name",placeholder:"Enter your name",help:"The name of the person travelling."},email:{value:"",label:"Email",required:!0,error:null,errorMsg:"Email location must be set",id:e+"-customer_email",placeholder:"Enter your email",help:"We'll never share your email with anyone else."},telephone:{value:"",label:"Mobile telephone",required:!0,error:null,errorMsg:"Telephone must be set",id:e+"-telephone",placeholder:"Enter a mobile number",help:"Valid UK mobile numbers only, please."},flight_number:{value:"",label:"Flight #",required:!1,error:null,errorMsg:"",id:e+"-flight_number",placeholder:"Enter your flight number",help:"If this is an airport pickup or dropoff, the relevent flight number"}})};var e}},d=s(22),u=Object(d.a)(o,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"biq-passenger-details-form-section"}},[e.$slots.heading||e.heading?s("div",{staticClass:"d-flex",attrs:{id:"biq-passenger-details-form-heading"}},[e._t("heading",[s("h4",[e._v(e._s(e.heading))])],{heading:e.heading})],2):e._e(),e._v(" "),s("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[s("div",{staticClass:"flex-fill",attrs:{id:"biq-passenger-name"}},[s("label",{attrs:{for:e.fields.name.id}},[e._v(e._s(e.fields.name.label))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.name.value,expression:"fields.name.value"}],staticClass:"flex-fill",class:e.errorStateClass("name"),attrs:{id:e.fields.name.id,placeholder:e.fields.name.placeholder,required:e.fields.name.required,type:"text","aria-describedby":"nameHelp"},domProps:{value:e.fields.name.value},on:{input:function(t){t.target.composing||e.$set(e.fields.name,"value",t.target.value)}}}),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"nameHelp"}},[e._v(e._s(e.fields.name.help))])]),e._v(" "),s("div",{staticClass:"flex-fill",attrs:{id:"biq-passenger-email"}},[s("label",{attrs:{for:e.fields.email.id}},[e._v(e._s(e.fields.email.label))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.email.value,expression:"fields.email.value"}],staticClass:"flex-fill",class:e.errorStateClass("email"),attrs:{id:e.fields.email.id,placeholder:e.fields.email.placeholder,required:e.fields.email.required,type:"email","aria-describedby":"emailHelp"},domProps:{value:e.fields.email.value},on:{input:function(t){t.target.composing||e.$set(e.fields.email,"value",t.target.value)}}}),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"emailHelp"}},[e._v(e._s(e.fields.email.help))])])]),e._v(" "),s("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[s("div",{staticClass:"flex-fill",attrs:{id:"biq-passenger-telephone"}},[s("label",{attrs:{for:e.fields.telephone.id}},[e._v(e._s(e.fields.telephone.label))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.telephone.value,expression:"fields.telephone.value"}],staticClass:"flex-fill",class:e.errorStateClass("telephone"),attrs:{id:e.fields.telephone.id,placeholder:e.fields.telephone.placeholder,required:e.fields.telephone.required,type:"text","aria-describedby":"mobileHelp"},domProps:{value:e.fields.telephone.value},on:{input:function(t){t.target.composing||e.$set(e.fields.telephone,"value",t.target.value)}}}),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"mobileHelp"}},[e._v(e._s(e.fields.telephone.label))])]),e._v(" "),s("div",{staticClass:"flex-fill",attrs:{id:"biq-passenger-flight-number"}},[s("label",{attrs:{for:e.fields.flight_number.id}},[e._v(e._s(e.fields.flight_number.label))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.flight_number.value,expression:"fields.flight_number.value"}],staticClass:"flex-fill",class:e.errorStateClass("flight_number"),attrs:{id:e.fields.flight_number.id,placeholder:e.fields.flight_number.placeholder,required:e.fields.flight_number.required,type:"text","aria-describedby":"flightHelp"},domProps:{value:e.fields.flight_number.value},on:{input:function(t){t.target.composing||e.$set(e.fields.flight_number,"value",t.target.value)}}}),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"flightHelp"}},[e._v(e._s(e.fields.flight_number.help))])])])])}),[],!1,null,null,null).exports,c=s(28);const p={biqConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},stripeCardFormStyle:{type:Object,required:!0,default:function(){return r.a}},paypalClientToken:{type:String,required:!0,default:""},processing:{type:Boolean,default:!1}},f={...l.c};var m={name:"TheCheckoutForm",props:p,computed:{...Object(i.c)(["journeyID","processed","basket","quoteID","vehicleIndex","price"]),isCardPayment:function(){return this.fields.method.selected===l.a},isPaypalPayment:function(){return this.fields.method.selected===l.b},formSections:function(){const e=["passengerForm"];switch(this.fields.method.selected){case l.a:e.push("cardForm")}return e}},methods:{...Object(i.b)(["quoting","quoted","bookNow","booking","booked","bookingFailed"]),onSubmit:function(e){if(this.processing)return;if(this.booking(),!this.validate())return this.debugging&&(console.group(`BIQ CheckoutForm '${e.data.source}' Validation Error`),console.log(e),console.log(this.validation_errors),console.groupEnd()),this.bookingFailed(),!1;this.debugging&&(console.group(`BIQ CheckoutForm '${e.data.source}' Submit Event`),console.log(e),console.groupEnd()),this.error_message="",this.validation_errors={},this.has_errors=!1;let t=null;switch(e.data.source){case"paypal":return t={...e},e.data.paymentHandler.getTransactionToken(this.appSettings.biq_pk,this.quoteID,this.vehicleIndex,t);case"stripe":return t={...this.$refs.cardForm.inputValues()},e.data.paymentHandler.getTransactionToken(this.appSettings.biq_pk,this.quoteID,this.vehicleIndex,t);default:return this.$emit(f.biqCheckoutSubmit.name,e)}},onTransactionSuccess:function(e){const{paymentHandler:t,paymentIntent:s,formdataAppend:i}=e.data;this.makeBooking(s.id,t.getHandlerName(),i)},onTransactionError:function(e){this.error_message=e.data.error.message,this.has_errors=!0,e.data.booking=null,this.bookingFailed(),this.$emit(f.biqCheckoutError.name,e)},validate:function(){let e=0,t={};return this.formSections.forEach(s=>{this.$refs[s].validate()||(t={...t,...this.$refs[s].validationErrors()},e++)}),this.validation_errors=t,0==e},makeBooking:function(e,t,s){const i=this,a=this.assembleData(e,t,s),r=`${this.appSettings.biq_api_host}${this.biqConfig.PAYMENT_URI}`;this.debugging&&console.info(`BIQ Checkout booking attempt to API '${r}'`),Object(c.d)(r,this.appSettings.biq_pk,a,this.debugging).then(e=>{i.checkoutComplete(e)}).catch(e=>{i.has_errors=!0,i.error_message=e.data.message,this.bookingFailed(),e.data.booking.refunded=!1,i.$emit(f.biqCheckoutError.name,e)})},assembleData:function(e,t,s){const i=new FormData,a=this.$refs.passengerForm.inputValues();return console.log(a),i.append("quote",this.quoteID),i.append("vehicle",this.vehicleIndex),i.append("new_pay",!0),i.append("email",a.email),i.append("name",a.name),i.append("telephone",a.telephone),i.append("payment_token",e),i.append("method",t),"function"==typeof s&&s(i),a.flight_number&&i.append("flight_number",a.flight_number),this.appSettings.booking_test_mode&&i.append("test","1"),i},checkoutComplete:function(e){const t=this.booked,s={updateCheckoutState:()=>t({booking_ref:e.reference}),data:{booking_ref:e.reference,status:e.status}};this.$emit(f.biqCheckoutComplete.name,s)}},mixins:[n.b],components:{"biq-passenger-details-form-section":u,"stripe-card-payment":()=>s.e(5).then(s.bind(null,280)),"paypal-payment":()=>s.e(4).then(s.bind(null,282))},data:()=>({payment_heading:"Payment Details",transaction_descriptor:"Taxi Journey",has_errors:!1,error_message:"",validation_errors:{},fields:Object(l.e)("tc_plugin")})},g=Object(d.a)(m,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"biq-checkout-form-container"}},[s("form",{attrs:{id:"biq-checkout-form"}},[s("biq-passenger-details-form-section",{ref:"passengerForm",attrs:{heading:"Passenger Details",debugging:e.debugging}}),e._v(" "),s("div",{attrs:{id:"biq-payment-details-form-section"}},[s("div",{staticClass:"d-flex",attrs:{id:"biq-payment-form-heading"}},[s("h4",[e._v(e._s(e.payment_heading))])]),e._v(" "),s("div",{staticClass:"d-flex flex-wrap justify-content-end"},[s("label",{staticClass:"flex-sm-fill",attrs:{id:e.fields.method.id+"-select",for:e.fields.method.id}},[e._v(e._s(e.fields.method.label))]),e._v(" "),s("div",{staticClass:"flex-sm-fill"},[s("b-form-select",{attrs:{id:e.fields.method.id,options:e.fields.method.options,disabled:e.processing},model:{value:e.fields.method.selected,callback:function(t){e.$set(e.fields.method,"selected",t)},expression:"fields.method.selected"}})],1)]),e._v(" "),e.isCardPayment?s("stripe-card-payment",{ref:"cardForm",attrs:{"biq-config":e.biqConfig,"app-settings":e.appSettings,processing:e.processing,amount:e.price,descriptor:e.transaction_descriptor,"stripe-card-form-style":e.stripeCardFormStyle,debugging:e.debugging,id:"biq-stripe-card-details",label:"Card Details"},on:{submit:e.onSubmit,transactionSuccess:e.onTransactionSuccess,transactionError:e.onTransactionError}}):e.isPaypalPayment?s("paypal-payment",{ref:"paypalForm",attrs:{authorization:e.paypalClientToken,processing:e.processing,amount:e.price,descriptor:e.transaction_descriptor,debugging:e.debugging,useButtons:e.biqConfig.useButtons,id:"biq-paypal-plugin",label:"Or Pay With Paypal"},on:{submit:e.onSubmit,transactionSuccess:e.onTransactionSuccess,transactionError:e.onTransactionError}}):s("div",{staticClass:"d-flex flex-wrap justify-content-between"},[s("div",{staticClass:"flex-fill"})])],1)],1),e._v(" "),e.has_errors?s("div",{staticClass:"d-flex flex-wrap",attrs:{id:"biq-payment-error"}},[e._t("checkout-error",[s("div",{staticClass:"flex-fill"},[e._v(e._s(e.error_message))])],{error:{message:e.error_message}})],2):e._e()])}),[],!1,null,null,null).exports;const h={header:"Booking Details",journey:{...s(20).d,price:"Price : "}},b={li_css:"list-group-item d-flex justify-content-between align-items-center"};var v={name:"QuotedJourneyDetails",props:{price:{type:Number,default:0},labels:{type:Object,default:function(){return h}}},computed:{...Object(i.c)(["journeyDetails","journeyDate","journeyTime","journeyHasReturn","journeyReturnDate","journeyReturnTime","journeyHasVias"]),displayPrice:function(){return"&pound;"+this.price.toFixed(2)}},data:()=>({...b})},_=Object(d.a)(v,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"flex-fill"},[s("h4",{staticClass:"card-header"},[e._v(e._s(e.labels.header))]),e._v(" "),s("ul",{staticClass:"card list-group list-group-flush"},[s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.date))]),e._v(" "),s("span",[e._v(e._s(e.journeyDate)+" @ "+e._s(e.journeyTime))])]),e._v(" "),s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.pickup))]),e._v(" "),s("span",[e._v(e._s(e.journeyDetails.pickup.string))])]),e._v(" "),s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.destination))]),e._v(" "),s("span",[e._v(e._s(e.journeyDetails.destination.string))])]),e._v(" "),e.journeyHasVias?s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.via))]),e._v(" "),s("span",[e._v(e._s(e.journeyDetails.vias[0].string))])]):e._e(),e._v(" "),e.journeyHasReturn?s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.return_date))]),e._v(" "),s("span",[e._v(e._s(e.journeyReturnDate)+" @ "+e._s(e.journeyReturnTime))])]):e._e(),e._v(" "),e.price>0?s("li",{class:e.li_css},[s("strong",[e._v(e._s(e.labels.journey.price))]),e._v(" "),s("span",{domProps:{innerHTML:e._s(e.displayPrice)}})]):e._e()])])}),[],!1,null,null,null).exports;s(272),s(273);const y={journey_details_labels:{header:"Booking Details",journey:{pickup:"Travelling From : ",destination:"Going To : ",via:"Via : ",passengers:"Passengers : ",date:"Date : ",return_date:"Returning : ",price:"Price : "}}};var k={name:"CheckoutPage",props:{stripe_cardform_style:{type:Object,required:!0,default:function(){return r.a}},paypalClientToken:{type:String,required:!0,default:""}},computed:{...Object(i.c)(["processing","price"])},methods:{onSubmit:function(e){this.debugging&&(console.group("BIQ Checkout Form Submit"),console.log(e),console.groupEnd())},onCheckoutSuccess:function(e){this.debugging&&(console.group("BIQ Checkout Success"),console.log(e),console.groupEnd());const t={name:"CompletePage",params:{booking_ref:e.data.booking_ref}};this.$router.replace(t,e.updateCheckoutState,e.updateCheckoutState)},onCheckoutError:function(e){this.debugging&&(console.group("BIQ Checkout Error"),console.log(e),console.groupEnd())}},mixins:[a.a],components:{"the-biq-checkout-form":g,"biq-quoted-journey-details":_},data:()=>({...y}),created(){0==this.price&&this.$router.back()}},C=Object(d.a)(k,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"biq-checkout-page"}},[s("the-biq-checkout-form",{ref:"checkout",attrs:{"biq-config":e.appConfig.biq,"app-settings":e.appSettings,"stripe-card-form-style":e.stripe_cardform_style,"paypal-client-token":e.paypalClientToken,processing:e.processing,debugging:e.debugging},on:{biqCheckoutSubmit:e.onSubmit,biqCheckoutComplete:e.onCheckoutSuccess,biqCheckoutError:e.onCheckoutError},scopedSlots:e._u([{key:"checkout-error",fn:function(t){var i=t.error;return[s("div",{staticClass:"d-flex"},[e._v(e._s(i.message))])]}}])}),e._v(" "),s("div",{staticClass:"d-flex"},[s("biq-quoted-journey-details",{attrs:{price:e.price,labels:e.journey_details_labels,id:"biq-checkout-booking-details"}})],1)],1)}),[],!1,null,null,null);t.default=C.exports},41:function(e,t,s){"use strict";s.d(t,"c",(function(){return a})),s.d(t,"a",(function(){return r}));const i={validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},values:{type:Object,default:function(){return{}}},debugging:{type:Boolean,default:!1}},a={submit:{name:"submit"},validated:{name:"validated"},validationError:{name:"validationError"}},r={props:i,methods:{validate:function(){return this.validateValues()},specialValidationErrors:function(){return{}},specialInputValues:function(){return{}},errorStateClass:function(e){return null==this.fields[e].error?"":this.fields[e].error?this.errorClass:this.validClass},setFieldValues:function(){const e=this;this.debugging&&(console.group(`Setting ${this.$options._componentTag} values`),console.log("Fields Before",{...this.fields}),console.log("Values",this.values)),Object.keys(this.values).forEach(t=>{if(!e.fields.hasOwnProperty(t))return void(e.debugging&&console.info(`${e.$options._componentTag} does not contain field '${t}'`));const s=e.fields[t].hasOwnProperty("value")?"value":"selected";e.fields[t][s]=e.values[t]}),this.debugging&&(console.log("Fields After",{...this.fields}),console.groupEnd())},validateValues:function(){const e=this;let t=0;return this.debugging&&console.group(`Validating ${this.$options._componentTag} values`),Object.keys(this.fields).forEach(s=>{if(e.fields[s].error=null,!e.fields[s].required)return;const i=e.fields[s].hasOwnProperty("value")?"value":"selected";""==e.fields[s][i]?(e.fields[s].error=e.fields[s].errorMsg,e.debugging&&console.info(`Invalid field value for '${s}' -- ${e.fields[s].error}`),t++):e.fields[s].error=""}),this.debugging&&console.groupEnd(),0==t},validationErrors:function(){const e=this,t={};return Object.keys(this.fields).forEach(s=>{t[s]=e.fields[s].error}),{...this.specialValidationErrors(),...t}},inputValues:function(){const e=this,t={};return Object.keys(this.fields).forEach(s=>{const i=e.fields[s].hasOwnProperty("value")?"value":"selected";t[s]=e.fields[s][i]}),{...this.specialInputValues(),...t}}},data:()=>({fields:{}})};t.b=r}},0,[4,5]]);
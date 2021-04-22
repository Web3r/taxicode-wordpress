(window.webpackJsonp=window.webpackJsonp||[]).push([[5,7],{269:function(e,t,n){"use strict";n.r(t);const i={processing:{type:Boolean,default:!1},label:{type:String,default:"Submit"},processingLabel:{type:String,default:"Processing"},styleClass:{type:String,default:"btn btn-primary"}},s={name:"click"};var r={name:"ProcessFormSubmit",props:i,computed:{submitLabel:function(){return this.processing?this.processingLabel:this.label}},methods:{onClick:function(e){this.$emit(s.name,e)}}},a=n(22),o=Object(a.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("button",{class:e.styleClass,attrs:{disabled:e.processing},on:{click:e.onClick}},[e.processing?n("div",{staticClass:"spinner-border spinner-border-sm"}):e._e(),e._v("\n    "+e._s(e.submitLabel)+"\n")])}),[],!1,null,null,null);t.default=o.exports},270:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));class i{constructor(e,t,n){this.getPublicHandler=this.getPublicHandler.bind(this),this.getHandlerName=this.getHandlerName.bind(this),this.getAmount=this.getAmount.bind(this),this.getDescriptor=this.getDescriptor.bind(this),this.setAmount=this.setAmount.bind(this),this.updateAmount=this.updateAmount.bind(this),this.getTransactionToken=this.getTransactionToken.bind(this),this.handle=this.handle.bind(this),this.country="GB",this.currency="gbp",this.transactionSuccessCB=e,this.transactionFailCB=t,this.debugging=n,this.amount=0,this.descriptor="",this.paymentHandlerName="unknown"}getPublicHandler(){return{getHandlerName:this.getHandlerName,getAmount:this.getAmount,getDescriptor:this.getDescriptor,updateAmount:this.updateAmount,getTransactionToken:this.getTransactionToken}}getHandlerName(){return this.paymentHandlerName}getAmount(){return this.amount}getDescriptor(){return this.descriptor}setAmount(e,t){this.amount=100*e,this.descriptor=t}updateAmount(e){this.amount=100*e}getTransactionToken(e,t,n,i){this.handle(this.getPublicHandler,this.transactionSuccessCB,this.transactionFailCB,{...i,key:e,quote:t,vehicle:n})}handle(e,t,n,i){n(e(),"No payment handler to handle the transaction")}}},280:function(e,t,n){"use strict";n.r(t);var i=n(41),s=n(17),r=n(38),a=n(270),o=(n(16),n(28));class l extends a.a{constructor(e,t,n){super(e,t,n),this.getPublicHandler=this.getPublicHandler.bind(this),this.handle=this.handle.bind(this),this.initialise=this.initialise.bind(this),this.mountElement=this.mountElement.bind(this),this.unmountElement=this.unmountElement.bind(this),this.getCustomerToken=this.getCustomerToken.bind(this),this.setCustomerToken=this.setCustomerToken.bind(this),this.paymentHandlerName="jstoken_stripe",this.customer_token=null,this.elementMounted=!1,this.elementMountedOn="stripe-card-form"}initialise(e,t,n,i,s){this.debugging&&(console.group("Stripe card form handler initialising..."),console.info(e),console.info(t),console.info(n),console.info(i),console.info(s)),this.pk=e,this.intent_secret_uri=t,this.elementMountedOn=n,this.stripe=Stripe(this.pk),this.stripeElements=this.stripe.elements();const r={style:i,hidePostalCode:void 0!==s&&!!s};this.debugging&&console.info(r),this.card=this.stripeElements.create("card",r),this.debugging&&(console.log("Stripe card form handler initialised"),console.groupEnd())}getPublicHandler(){return{...super.getPublicHandler(),mountElement:this.mountElement,unmountElement:this.unmountElement,getCustomerToken:this.getCustomerToken,setCustomerToken:this.setCustomerToken}}mountElement(){this.elementMounted||(this.debugging&&console.log("Mounting Stripe card element on "+this.elementMountedOn),this.card.mount(document.getElementById(this.elementMountedOn)),this.elementMounted=!0)}unmountElement(){this.elementMounted&&(this.debugging&&console.log("Unmounting Stripe card element from "+this.elementMountedOn),this.card.unmount(document.getElementById(this.elementMountedOn)),this.elementMounted=!1)}getCustomerToken(){return this.customer_token}setCustomerToken(e){this.customer_token=e}handle(e,t,n,i){const{key:s,quote:r,vehicle:a,cardholder_name:l,billing_postcode:d}=i,c=this.stripe,u=this.card,m=e(),h=this.debugging;return Object(o.c)(this.intent_secret_uri,s,m.getHandlerName(),r,a,h).then(e=>{const i={payment_method:{card:u,billing_details:{name:l,address:{postal_code:d}}}};c.confirmCardPayment(e,i,{handleActions:!1}).then(i=>{if(i.error)n(m,i.error);else{if(i.paymentIntent.hasOwnProperty("status")&&"succeeded"===i.paymentIntent.status)return void t(m,i.paymentIntent);c.confirmCardPayment(e).then(e=>{e.error?n(m,e.error):t(m,e.paymentIntent)})}}).catch(e=>{n(m,e)})}).catch(e=>{h&&(console.error(e),console.log("error",e)),n(m,e.data)})}}var d={name:"StripeCardFormElement",components:{"biq-process-form-submit":n(269).default},props:{biqClientSecretFrom:{type:String,required:!0,default:"//booking/client_gateway_secret/"},stripePublicKey:{type:String,required:!0,default:""},stripeCardFormStyle:{type:Object,required:!0,default:function(){return s.a}},hidePostalCode:{type:Boolean,default:!1},processing:{type:Boolean,default:!1},amount:{type:Number,required:!0,default:0},descriptor:{type:String,default:""},id:{type:String,default:"biq-stripe-card-details"},label:{type:String,default:"Card Details"},validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},debugging:{type:Boolean,default:!1},useButtons:{type:Boolean,default:!0}},data(){return{mount_on:"stripe-card-form",validation_run:!1,has_errors:!1,paymentHandler:new l(this.onHandlerSuccess,this.onHandlerError,this.debugging)}},computed:{errorStateClass:function(){return this.validation_run?this.has_errors?this.errorClass:this.validClass:""}},created(){this.paymentHandler.initialise(this.stripePublicKey,this.biqClientSecretFrom,this.mount_on,this.stripeCardFormStyle,this.hidePostalCode)},mounted(){this.paymentHandler.setAmount(this.amount,this.descriptor),this.paymentHandler.mountElement()},methods:{onSubmit:function(e){this.processing||(e.data={paymentHandler:this.paymentHandler.getPublicHandler()},this.$emit(r.f.submit.name,e))},onHandlerSuccess:function(e,t){const n={data:{paymentHandler:e,paymentIntent:t}};this.$emit(r.f.transactionSuccess.name,n)},onHandlerError:function(e,t){t.hasOwnProperty("message")&&t.message||(t.message="Unknown Stripe Error");const n={data:{paymentHandler:e,error:t}};this.$emit(r.f.transactionError.name,n)},validate:function(){this.validation_run=!0;const e=this.$refs.card.classList;return this.has_errors=e.contains("StripeElement--invalid")||e.contains("StripeElement--empty"),!this.has_errors}}},c=n(22),u=Object(c.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"d-flex flex-wrap justify-content-between row-col",attrs:{id:e.id}},[n("div",{staticClass:"flex-fill"},[n("label",{staticClass:"control-label",attrs:{for:e.mount_on}},[e._v(e._s(e.label))]),e._v(" "),n("div",{ref:"card",staticClass:"form-control stripe-card-container",class:e.errorStateClass,attrs:{id:e.mount_on}})]),e._v(" "),n("div",{staticClass:"flex-fill"},[n("biq-process-form-submit",{attrs:{processing:e.processing,"style-class":"btn-primary",label:"Book Now"},on:{click:e.onSubmit}})],1)])}),[],!1,null,null,null).exports,m={name:"StripeCardPayment",mixins:[i.b],components:{"stripe-card-form-element":u},props:{biqConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},stripeCardFormStyle:{type:Object,required:!0,default:function(){return s.a}},values:{type:Object,default:function(){return{cardholder_name:"",billing_postcode:""}}},processing:{type:Boolean,default:!1},amount:{type:Number,required:!0,default:0},descriptor:{type:String,default:""},id:{type:String,default:"biq-stripe-card-details"},name:{type:String,default:"stripe"},label:{type:String,default:"Card Details"}},data:()=>({fields:{cardholder_name:{value:"",label:"Cardholder Name",required:!0,error:!1,errorMsg:"Cardholder name must be set",id:"card-holder-name",placeholder:"Cardholder Name"},billing_postcode:{value:"",label:"Billing Postcode",required:!0,error:!1,errorMsg:"Billing address postcode must be set",id:"billing-postcode",placeholder:"Billing Postcode"}},card_error:!1,card_error_message:""}),methods:{onSubmit:function(e){this.processing||(this.card_error=!1,this.card_error_message="",e.data={source:this.name,...e.data},this.$emit(r.f.submit.name,e))},onTransactionSuccess:function(e){const{cardholder_name:t,billing_postcode:n}=this.fields;e.data={source:this.name,...e.data,formdataAppend:i=>(this.debugging&&console.log(e.data.paymentIntent),i.append("card_cardholder",t.value),i.append("postcode",n.value),i)},this.$emit(r.f.transactionSuccess.name,e)},onTransactionError:function(e){this.card_error=!0,this.card_error_message=e.data.error.message,e.data={source:this.name,type:"transaction",...e.data},this.$emit(r.f.transactionError.name,e)},specialValidationErrors:function(){const e={};return this.$refs.card.has_errors&&(e.card=this.card_error?this.card_error_message:"Please provide valid card details"),{...e}},validate:function(){let e=0;return this.$refs.card.validate()||e++,this.validateValues()||e++,0==e}}},h=Object(c.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[n("div",{staticClass:"d-flex flex-wrap justify-content-between flex-fill row-col",attrs:{id:"tcplugin-cardholder-details"}},[n("div",{staticClass:"flex-fill"},[n("label",{attrs:{for:e.fields.cardholder_name.id}},[e._v(e._s(e.fields.cardholder_name.label))]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.cardholder_name.value,expression:"fields.cardholder_name.value"}],staticClass:"flex-fill",class:e.errorStateClass("cardholder_name"),attrs:{id:e.fields.cardholder_name.id,placeholder:e.fields.cardholder_name.placeholder,required:e.fields.cardholder_name.required,type:"text"},domProps:{value:e.fields.cardholder_name.value},on:{input:function(t){t.target.composing||e.$set(e.fields.cardholder_name,"value",t.target.value)}}})]),e._v(" "),n("div",{staticClass:"flex-fill"},[n("label",{attrs:{for:e.fields.billing_postcode.id}},[e._v(e._s(e.fields.billing_postcode.label))]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.billing_postcode.value,expression:"fields.billing_postcode.value"}],staticClass:"flex-fill",class:e.errorStateClass("billing_postcode"),attrs:{id:e.fields.billing_postcode.id,placeholder:e.fields.billing_postcode.placeholder,required:e.fields.billing_postcode.required,type:"text"},domProps:{value:e.fields.billing_postcode.value},on:{input:function(t){t.target.composing||e.$set(e.fields.billing_postcode,"value",t.target.value)}}})])]),e._v(" "),n("stripe-card-form-element",{ref:"card",attrs:{"biq-client-secret-from":""+e.appSettings.biq_api_host+e.biqConfig.CLIENT_SECRET_URI,"stripe-public-key":e.appSettings.stripe_pk,amount:e.amount,"stripe-card-form-style":e.stripeCardFormStyle,"hide-postal-code":e.biqConfig.PGH_CONF.hidePostalCode,processing:e.processing,id:e.id,label:e.label,descriptor:e.descriptor,debugging:e.debugging,"use-buttons":e.biqConfig.useButtons},on:{submit:e.onSubmit,transactionSuccess:e.onTransactionSuccess,transactionError:e.onTransactionError}})],1)}),[],!1,null,null,null);t.default=h.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[5,10],{413:function(t,e,n){"use strict";n.r(e);const s={processing:{type:Boolean,default:!1},label:{type:String,default:"Submit"},processingLabel:{type:String,default:"Processing"},styleClass:{type:String,default:"btn btn-primary"}},a={name:"click"};var o={name:"ProcessFormSubmit",props:s,computed:{submitLabel:function(){return this.processing?this.processingLabel:this.label}},methods:{onClick:function(t){this.$emit(a.name,t)}}},r=n(18),i=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("button",{class:t.styleClass,attrs:{disabled:t.processing},on:{click:t.onClick}},[t.processing?n("div",{staticClass:"spinner-border spinner-border-sm"}):t._e(),t._v("\n    "+t._s(t.submitLabel)+"\n")])}),[],!1,null,null,null);e.default=i.exports},414:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));class s{constructor(t,e,n){this.getPublicHandler=this.getPublicHandler.bind(this),this.getHandlerName=this.getHandlerName.bind(this),this.getAmount=this.getAmount.bind(this),this.getDescriptor=this.getDescriptor.bind(this),this.setAmount=this.setAmount.bind(this),this.updateAmount=this.updateAmount.bind(this),this.getTransactionToken=this.getTransactionToken.bind(this),this.handle=this.handle.bind(this),this.country="GB",this.currency="gbp",this.transactionSuccessCB=t,this.transactionFailCB=e,this.debugging=n,this.amount=0,this.descriptor="",this.paymentHandlerName="unknown"}getPublicHandler(){return{getHandlerName:this.getHandlerName,getAmount:this.getAmount,getDescriptor:this.getDescriptor,updateAmount:this.updateAmount,getTransactionToken:this.getTransactionToken}}getHandlerName(){return this.paymentHandlerName}getAmount(){return this.amount}getDescriptor(){return this.descriptor}setAmount(t,e){this.amount=100*t,this.descriptor=e}updateAmount(t){this.amount=100*t}getTransactionToken(t,e,n,s){this.handle(this.getPublicHandler,this.transactionSuccessCB,this.transactionFailCB,{...s,key:t,quote:e,vehicle:n})}handle(t,e,n,s){n(t(),"No payment handler to handle the transaction")}}},432:function(t,e,n){"use strict";n.r(e);var s=n(40),a=n(414);class o extends a.a{constructor(t,e,n){super(t,e,n),this.handle=this.handle.bind(this),this.paymentHandlerName="paypal"}handle(t,e,n,s){const{key:a,quote:o,vehicle:r,nonce:i}=s;this.debugging&&(console.group("Paypal payment transaction handler"),console.log(s),console.log(a),console.log(o),console.log(r),console.log(i),console.groupEnd());const l={id:i};e(t(),l)}}var r={name:"PaypalPayment",components:{"biq-process-form-submit":n(413).default},props:{authorization:{type:String,required:!0,default:""},processing:{type:Boolean,default:!1},amount:{type:Number,required:!0,default:0},descriptor:{type:String,default:""},id:{type:String,default:"biq-paypal-plugin"},name:{type:String,default:"paypal"},label:{type:String,default:"Pay With Paypal"},debugging:{type:Boolean,default:!1},useButtons:{type:Boolean,default:!0}},data(){return{setup:{flow:"checkout",amount:this.amount,currency:"GBP"},paymentHandler:new o(this.onHandlerSuccess,this.onHandlerError,this.debugging),error:!1,error_message:""}},mounted(){this.paymentHandler.setAmount(this.amount,this.descriptor)},methods:{onHandlerSuccess:function(t,e){const n={data:{source:this.name,type:"transaction",paymentHandler:t,paymentIntent:e,formdataAppend:t=>t}};this.$emit(s.f.transactionSuccess.name,n)},onHandlerError:function(t,e){e.hasOwnProperty("message")&&e.message||(e.message="Unknown Paypal Error");const n={data:{source:this.name,type:"transaction",paymentHandler:t,error:e}};this.$emit(s.f.transactionError.name,n)},onTransactionSuccess:function(t){this.debugging&&(console.group("Paypal transaction succeeded event"),console.log(t),console.groupEnd()),this.processing||(this.card_error=!1,this.card_error_message="",t.data={source:this.name,paymentHandler:this.paymentHandler.getPublicHandler()},this.$emit(s.f.submit.name,t))},onTransactionError:function(t){this.debugging&&(console.group("Paypal transaction error event"),console.log(t),console.groupEnd()),this.onHandlerError(this.paymentHandler.getPublicHandler(),t)},onLoadFail:function(t){this.debugging&&(console.group("Paypal loading error event"),console.log(t),console.groupEnd()),t.hasOwnProperty("message")&&t.message||(t.message="Unknown Paypal Loading Error");const e={data:{source:this.name,type:"loading",paymentHandler:this.paymentHandler.getPublicHandler(),error:t}};this.$emit(s.f.transactionError.name,e)}}},i=n(18),l=Object(i.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row"},[n("div",{staticClass:"col"}),t._v(" "),n("div",{staticClass:"col",attrs:{id:t.id}},[n("div",{staticClass:"form-group"},[n("label",{staticClass:"control-label",attrs:{for:"paypal"}},[t._v(t._s(t.label))]),t._v(" "),n("v-braintree",{attrs:{authorization:t.authorization,paypal:t.setup},on:{success:t.onTransactionSuccess,error:t.onTransactionError,loadFail:t.onLoadFail},scopedSlots:t._u([{key:"button",fn:function(e){return[n("div",{staticClass:"form-group"},[n("biq-process-form-submit",{attrs:{processing:t.processing,"style-class":"btn-primary",label:"Book Now"},on:{click:function(t){return t.preventDefault(),e.submit(t)}}})],1)]}}])})],1)])])}),[],!1,null,null,null);e.default=l.exports}}]);
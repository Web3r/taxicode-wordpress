(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{266:function(e,t,s){"use strict";const a={props:{appConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},debugging:{type:Boolean,default:!1}}};t.a=a},275:function(e,t,s){"use strict";s.r(t);var a=s(266),r=s(15);class i{constructor(){this.errors={}}has(e){return this.errors.hasOwnProperty(e)}any(){return Object.keys(this.errors).length>0}get(e){if(this.errors[e])return this.errors[e][0]}record(e){this.errors=e}clear(e){e?delete this.errors[e]:this.errors={}}}class l{constructor(e){this.originalData=e;for(let t in e)this[t]=e[t];this.errors=new i}data(){let e={};for(let t in this.originalData)e[t]=this[t];return e}reset(){for(let e in this.originalData)this[e]="";this.errors.clear()}post(e,t){return this.submit("post",e,t)}put(e){return this.submit("put",e,config)}patch(e){return this.submit("patch",e,config)}delete(e){return this.submit("delete",e,config)}submit(e,t,s){return new Promise((a,r)=>{axios[e](t,this.data(),s).then(e=>{this.onSuccess(e.data),a(e.data)}).catch(e=>{this.onFail(e.response.data),r(e.response.data)})})}onSuccess(e){return null!=typeof this.originalData.preserve_on_submit&&1==this.originalData.preserve_on_submit||this.reset(),e}onFail(e){this.errors.record(e)}}var o={name:"FlashMessage",props:{messageClass:{type:String,default:""},heading:{type:String,default:""},message:{type:String,default:""}}},n=s(19),d=Object(n.a)(o,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.heading?s("div",{class:e.messageClass},[s("h4",[e._v(e._s(e.heading))]),e._v(" "),e.message?s("p",[e._v(e._s(e.message))]):e._e()]):e._e()}),[],!1,null,null,null).exports,p=s(38);var c={name:"SettingsAPIForm",props:{values:{type:Object,default:function(){return{taxicode_public:"",taxicode_private:"",biq_api_host:"https://api.taxicode.com/"}}}},mixins:[p.b],data(){return{fields:(e="",{taxicode_public:{value:"",label:"Taxicode Public API Key",required:!0,error:null,errorMsg:"Value required for Taxicode Public API Key",id:e+"taxicode_public",placeholder:"Enter your Public Taxicode API Key",help:"The Taxicode affiliate API public key assigned to your account."},taxicode_private:{value:"",label:"Taxicode Private API Key",required:!0,error:null,errorMsg:"Value required for Taxicode Private API Key",id:e+"taxicode_private",placeholder:"Enter your Private Taxicode API Key",help:"The Taxicode affiliate API Private key assigned to your account, do not share your key with anyone else."},biq_api_host:{value:"",label:"Taxicode BIQ API Host",required:!0,error:null,errorMsg:"Value required for Taxicode BIQ API Host",id:e+"biq_api_host",placeholder:"The Taxicode API host address",help:'The hostname of the Taxicode API to use e.g. "https://api.taxicode.com/"'}})};var e},mounted(){this.setFieldValues()}},u=Object(n.a)(c,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("table",{staticClass:"form-table",attrs:{role:"presentation"}},[s("tbody",[s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.taxicode_public.id}},[e._v(e._s(e.fields.taxicode_public.label))])]),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.taxicode_public.value,expression:"fields.taxicode_public.value"}],staticClass:"regular-text",class:e.errorStateClass("taxicode_public"),attrs:{id:e.fields.taxicode_public.id,placeholder:e.fields.taxicode_public.placeholder,required:e.fields.taxicode_public.required,type:"text","aria-describedby":"taxicode_publicHelp"},domProps:{value:e.fields.taxicode_public.value},on:{input:function(t){t.target.composing||e.$set(e.fields.taxicode_public,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"taxicode_publicHelp"}},[e._v(e._s(e.fields.taxicode_public.help))])])]),e._v(" "),s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.taxicode_private.id}},[e._v(e._s(e.fields.taxicode_private.label))])]),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.taxicode_private.value,expression:"fields.taxicode_private.value"}],staticClass:"regular-text",class:e.errorStateClass("taxicode_private"),attrs:{id:e.fields.taxicode_private.id,placeholder:e.fields.taxicode_private.placeholder,required:e.fields.taxicode_private.required,type:"text","aria-describedby":"taxicode_privateHelp"},domProps:{value:e.fields.taxicode_private.value},on:{input:function(t){t.target.composing||e.$set(e.fields.taxicode_private,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"taxicode_privateHelp"}},[e._v(e._s(e.fields.taxicode_private.help))])])]),e._v(" "),s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.biq_api_host.id}},[e._v(e._s(e.fields.biq_api_host.label))])]),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.biq_api_host.value,expression:"fields.biq_api_host.value"}],staticClass:"regular-text",class:e.errorStateClass("biq_api_host"),attrs:{id:e.fields.biq_api_host.id,placeholder:e.fields.biq_api_host.placeholder,required:e.fields.biq_api_host.required,type:"text","aria-describedby":"biq_api_hostHelp"},domProps:{value:e.fields.biq_api_host.value},on:{input:function(t){t.target.composing||e.$set(e.fields.biq_api_host,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"biq_api_hostHelp"}},[e._v(e._s(e.fields.biq_api_host.help))])])])])])}),[],!1,null,null,null).exports;var _={name:"SettingsPaymentForm",props:{values:{type:Object,default:function(){return{paypal_public:"",stripe_public:"",stripe_cardform_style:""}}}},mixins:[p.b],data(){return{fields:(e="",{paypal_public:{value:"",label:"Paypal Client ID",required:!0,error:null,errorMsg:"Value required for Paypal Client ID",id:e+"paypal_public",placeholder:"Enter the Paypal Client ID",help:"The public Paypal Client ID assigned to you."},stripe_public:{value:"",label:"Stripe Public API Key",required:!0,error:null,errorMsg:"Value required for Stripe Public API Key",id:e+"stripe_public",placeholder:"Enter the Stripe Public API Key",help:"The Stripe Public API Key assigned to you."},stripe_cardform_style:{value:"",label:"Stripe Cardform Custom Style",required:!1,error:null,errorMsg:"",id:e+"stripe_cardform_style",placeholder:"",help:""}})};var e},mounted(){this.setFieldValues()}},m=Object(n.a)(_,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("table",{staticClass:"form-table",attrs:{role:"presentation"}},[s("tbody",[s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.paypal_public.id}},[e._v(e._s(e.fields.paypal_public.label))])]),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.paypal_public.value,expression:"fields.paypal_public.value"}],staticClass:"regular-text",class:e.errorStateClass("paypal_public"),attrs:{id:e.fields.paypal_public.id,placeholder:e.fields.paypal_public.placeholder,required:e.fields.paypal_public.required,type:"text","aria-describedby":"paypal_publicHelp"},domProps:{value:e.fields.paypal_public.value},on:{input:function(t){t.target.composing||e.$set(e.fields.paypal_public,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"paypal_publicHelp"}},[e._v(e._s(e.fields.paypal_public.help))])])]),e._v(" "),s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.stripe_public.id}},[e._v(e._s(e.fields.stripe_public.label))])]),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.stripe_public.value,expression:"fields.stripe_public.value"}],staticClass:"regular-text",class:e.errorStateClass("stripe_public"),attrs:{id:e.fields.stripe_public.id,placeholder:e.fields.stripe_public.placeholder,required:e.fields.stripe_public.required,type:"text","aria-describedby":"stripe_publicHelp"},domProps:{value:e.fields.stripe_public.value},on:{input:function(t){t.target.composing||e.$set(e.fields.stripe_public,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"stripe_publicHelp"}},[e._v(e._s(e.fields.stripe_public.help))])])]),e._v(" "),s("tr",[s("th",{attrs:{scope:"row"}},[s("label",{attrs:{for:e.fields.stripe_cardform_style.id}},[e._v(e._s(e.fields.stripe_cardform_style.label))])]),e._v(" "),s("td",[s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.fields.stripe_cardform_style.value,expression:"fields.stripe_cardform_style.value"}],staticClass:"regular-text code",class:e.errorStateClass("stripe_cardform_style"),attrs:{id:e.fields.stripe_cardform_style.id,placeholder:e.fields.stripe_cardform_style.placeholder,required:e.fields.stripe_cardform_style.required,"aria-describedby":"stripe_cardform_styleHelp",rows:"10",cols:"50"},domProps:{value:e.fields.stripe_cardform_style.value},on:{input:function(t){t.target.composing||e.$set(e.fields.stripe_cardform_style,"value",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),e._m(0)])])])])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("small",{staticClass:"form-text text-muted",attrs:{id:"stripe_cardform_styleHelp"}},[this._v("\n                    See "),t("a",{attrs:{href:"https://stripe.com/docs/js/appendix/style",title:"Stripe JS Card Element Style Object",target:"_blank"}},[this._v("Stripe JS Card Element Style Object")]),this._v(" for details of valid options.\n                ")])}],!1,null,null,null).exports;const f={name:"appSettingsUpdated"},g={name:"updateSettingsError"};var h={name:"SettingsPage",mixins:[a.a],components:{"flash-message":d,"biq-api-settings-form-section":u,"biq-payment-settings-form-section":m},props:{adminNonce:{type:String,default:""},appRESTBaseURL:{type:String,required:!0,default:"//"}},data:()=>({page_title:"Settings",flash_message:!1,flash_message_timeout:5e3,form_sections:["apiSettingsForm","paymentSettingsForm"],validation_error_class:"error",validation_errors:{search_target_permalink:!1},form:new l({search_target_permalink:"/booking-instant-quotes/",test_mode:0,quote_type:"all",recommend_upgrade:0,complete_page_text:"",custom_css:"",preserve_on_submit:!0}),reloading:!1}),created(){this.propagateSettingsToFormData()},computed:{apiSettingsValues:function(){return this.reloading?null:{taxicode_public:this.appSettings.biq_pk,taxicode_private:this.appSettings.biq_sk,biq_api_host:this.appSettings.biq_api_host}},paymentSettingsValues:function(){return this.reloading?{}:{paypal_public:this.appSettings.paypal_pk,stripe_public:this.appSettings.stripe_pk,stripe_cardform_style:this.appSettings.stripe_cardform_style}}},methods:{onReloadSettings:function(){this.reloading=!0,this.propagateSettingsToFormData(),this.reloading=!1},propagateSettingsToFormData:function(){this.form.search_target_permalink=this.appSettings.search_target_permalink,this.form.test_mode=this.appSettings.booking_test_mode?1:0,this.form.quote_type=this.appSettings.quote_type,this.form.recommend_upgrade=this.appSettings.recommend_upgrade?1:0,this.form.complete_page_text=this.appSettings.complete_page_text,this.form.custom_css=this.appSettings.custom_css},onSaveSettings:function(e){if(!this.validate())return this.debugging&&(console.group("BIQ App Settings Validation Error"),console.log(e),console.log(this.validation_errors),console.groupEnd()),this.flashMessage("Failed to update settings!","Please check the form for errors","error",this.flash_message_timeout),!1;const t=this,s=this.appRESTBaseURL+"settings/";this.debugging&&console.group(`Updating BIQ App Settings to '${s}'`);let a={};this.form_sections.forEach(e=>{a={...a,...this.$refs[e].inputValues()}});const i=new l({...a,...this.form.data()});this.debugging&&(console.log("BIQ Form Sections Data",{...a}),console.log("Form Data",{...this.form.data()}),console.log("Post Form Data",{...i.data()}),console.groupEnd()),i.post(s,Object(r.f)(this.adminNonce)).then(e=>{t.flashMessage("Settings Updated","","updated",t.flash_message_timeout);const s={...e};t.$emit(f.name,s)}).catch(e=>{t.flashMessage("Failed to update settings!","","error",t.flash_message_timeout);const a={data:{form:{...i.data()},URL:s,error:e}};t.$emit(g.name,a),t.debugging&&(console.info("Update Settings Error"),console.log("Update Event",a),console.groupEnd())})},validate:function(){let e=0,t={search_target_permalink:!1};return this.form_sections.forEach(s=>{this.$refs[s].validate()||(t={...t,...this.$refs[s].validationErrors()},e++)}),""==this.form.search_target_permalink&&(t.search_target_permalink="Permalink to a page to display the search results & booking checkout is required."),this.validation_errors=t,0==e},flashMessage:function(e,t,s,a){return this.flash_message={heading:e,message:t,class:s},setTimeout(()=>{this.flash_message=!1},a)}}},v=Object(n.a)(h,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"app-settings"},[s("h3",[e._v(e._s(e.page_title))]),e._v(" "),e.flash_message?s("flash-message",{attrs:{heading:e.flash_message.heading,message:e.flash_message.message,"message-class":e.flash_message.class}}):e._e(),e._v(" "),s("h3",[e._v("Taxicode Affiliate Settings")]),e._v(" "),s("biq-api-settings-form-section",{ref:"apiSettingsForm",attrs:{values:e.apiSettingsValues,"error-class":e.validation_error_class,debugging:e.debugging}}),e._v(" "),s("h3",[e._v("Payment Settings")]),e._v(" "),s("biq-payment-settings-form-section",{ref:"paymentSettingsForm",attrs:{values:e.paymentSettingsValues,"error-class":e.validation_error_class,debugging:e.debugging}}),e._v(" "),s("h3",[e._v("Plugin Settings")]),e._v(" "),s("table",{staticClass:"form-table",attrs:{role:"presentation"}},[s("tbody",[s("tr",[e._m(0),e._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.search_target_permalink,expression:"form.search_target_permalink"}],staticClass:"regular-text",class:e.validation_errors.search_target_permalink,attrs:{id:"search_target_permalink",placeholder:"/permalink-page/",required:!0,type:"text","aria-describedby":"search_target_permalinkHelp"},domProps:{value:e.form.search_target_permalink},on:{input:function(t){t.target.composing||e.$set(e.form,"search_target_permalink",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"search_target_permalinkHelp"}},[e._v("The permalink target the main client app shortcode will appear on")])])]),e._v(" "),s("tr",[e._m(1),e._v(" "),s("td",[e._m(2),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.test_mode,expression:"form.test_mode"}],attrs:{name:"test_mode",type:"radio",value:"1"},domProps:{checked:e._q(e.form.test_mode,"1")},on:{change:function(t){return e.$set(e.form,"test_mode","1")}}}),e._v(" Making Bookings In Test Mode\n                ")]),e._v(" "),s("br"),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.test_mode,expression:"form.test_mode"}],attrs:{name:"test_mode",type:"radio",value:"0"},domProps:{checked:e._q(e.form.test_mode,"0")},on:{change:function(t){return e.$set(e.form,"test_mode","0")}}}),e._v(" Make Live Bookings\n                ")])])]),e._v(" "),s("tr",[e._m(3),e._v(" "),s("td",[e._m(4),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.quote_type,expression:"form.quote_type"}],attrs:{name:"quote_type",type:"radio",value:"all"},domProps:{checked:e._q(e.form.quote_type,"all")},on:{change:function(t){return e.$set(e.form,"quote_type","all")}}}),e._v(" All\n                ")]),e._v(" "),s("br"),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.quote_type,expression:"form.quote_type"}],attrs:{name:"quote_type",type:"radio",value:"best"},domProps:{checked:e._q(e.form.quote_type,"best")},on:{change:function(t){return e.$set(e.form,"quote_type","best")}}}),e._v(" Only Best\n                ")]),e._v(" "),s("br"),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.quote_type,expression:"form.quote_type"}],attrs:{name:"quote_type",type:"radio",value:"type_class"},domProps:{checked:e._q(e.form.quote_type,"type_class")},on:{change:function(t){return e.$set(e.form,"quote_type","type_class")}}}),e._v(" Cheapest by type and class\n                ")])])]),e._v(" "),s("tr",[e._m(5),e._v(" "),s("td",[e._m(6),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.recommend_upgrade,expression:"form.recommend_upgrade"}],attrs:{name:"recommend_upgrade",type:"radio",value:"1"},domProps:{checked:e._q(e.form.recommend_upgrade,"1")},on:{change:function(t){return e.$set(e.form,"recommend_upgrade","1")}}}),e._v(" Offer Available Recommended Quote Upgrade\n                ")]),e._v(" "),s("br"),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:e.form.recommend_upgrade,expression:"form.recommend_upgrade"}],attrs:{name:"recommend_upgrade",type:"radio",value:"0"},domProps:{checked:e._q(e.form.recommend_upgrade,"0")},on:{change:function(t){return e.$set(e.form,"recommend_upgrade","0")}}}),e._v(" Do Not Offer Quote Upgrade\n                ")])])]),e._v(" "),s("tr",[e._m(7),e._v(" "),s("td",[s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.form.complete_page_text,expression:"form.complete_page_text"}],staticClass:"regular-text",attrs:{id:"complete_page_text",name:"complete_page_text",rows:"10",cols:"50","aria-describedby":"complete_page_textHelp"},domProps:{value:e.form.complete_page_text},on:{input:function(t){t.target.composing||e.$set(e.form,"complete_page_text",t.target.value)}}}),e._v(" "),s("br"),e._v(" "),s("small",{staticClass:"form-text text-muted",attrs:{id:"complete_page_textHelp"}},[e._v("This does not support HTML content.")])])])])]),e._v(" "),s("h3",[e._v("Custom CSS")]),e._v(" "),s("table",{staticClass:"form-table",attrs:{role:"presentation"}},[s("tbody",[s("tr",[e._m(8),e._v(" "),s("td",[s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.form.custom_css,expression:"form.custom_css"}],staticClass:"regular-text code",attrs:{id:"custom_css",name:"custom_css",rows:"10",cols:"50"},domProps:{value:e.form.custom_css},on:{input:function(t){t.target.composing||e.$set(e.form,"custom_css",t.target.value)}}})])])])]),e._v(" "),e.flash_message?s("flash-message",{attrs:{heading:e.flash_message.heading,message:e.flash_message.message,"message-class":e.flash_message.class}}):e._e(),e._v(" "),s("button",{staticClass:"button button-primary",on:{click:e.onSaveSettings}},[e._v("Save Settings")]),e._v("\n     \n    "),s("button",{staticClass:"button button-secondary",on:{click:e.onReloadSettings}},[e._v("Reload Settings")])],1)}),[function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",{attrs:{for:"search_target_permalink"}},[this._v("Search Page Permalink")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",[this._v("Booking Test Mode")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("legend",{staticClass:"screen-reader-text"},[t("span",[this._v("Quotes")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",[this._v("Quote Display")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("legend",{staticClass:"screen-reader-text"},[t("span",[this._v("Quotes")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",[this._v("Recommend Quote Upgrade")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("legend",{staticClass:"screen-reader-text"},[t("span",[this._v("Quotes")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",{attrs:{for:"complete_page_text"}},[this._v("Complete Page Text")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("th",{attrs:{scope:"row"}},[t("label",{attrs:{for:"custom_css"}},[this._v("Custom CSS")])])}],!1,null,null,null);t.default=v.exports},38:function(e,t,s){"use strict";s.d(t,"c",(function(){return r})),s.d(t,"a",(function(){return i}));const a={validClass:{type:String,default:""},errorClass:{type:String,default:"is-invalid"},errorState:{type:String,default:null},values:{type:Object,default:function(){return{}}},debugging:{type:Boolean,default:!1}},r={submit:{name:"submit"},validated:{name:"validated"},validationError:{name:"validationError"}},i={props:a,methods:{validate:function(){return this.validateValues()},specialValidationErrors:function(){return{}},specialInputValues:function(){return{}},errorStateClass:function(e){return null==this.fields[e].error?"":this.fields[e].error?this.errorClass:this.validClass},setFieldValues:function(){const e=this;this.debugging&&(console.group(`Setting ${this.$options._componentTag} values`),console.log("Fields Before",{...this.fields}),console.log("Values",this.values)),Object.keys(this.values).forEach(t=>{if(!e.fields.hasOwnProperty(t))return void(e.debugging&&console.info(`${e.$options._componentTag} does not contain field '${t}'`));const s=e.fields[t].hasOwnProperty("value")?"value":"selected";e.fields[t][s]=e.values[t]}),this.debugging&&(console.log("Fields After",{...this.fields}),console.groupEnd())},validateValues:function(){const e=this;let t=0;return this.debugging&&console.group(`Validating ${this.$options._componentTag} values`),Object.keys(this.fields).forEach(s=>{if(e.fields[s].error=null,!e.fields[s].required)return;const a=e.fields[s].hasOwnProperty("value")?"value":"selected";""==e.fields[s][a]?(e.fields[s].error=e.fields[s].errorMsg,e.debugging&&console.info(`Invalid field value for '${s}' -- ${e.fields[s].error}`),t++):e.fields[s].error=""}),this.debugging&&console.groupEnd(),0==t},validationErrors:function(){const e=this,t={};return Object.keys(this.fields).forEach(s=>{t[s]=e.fields[s].error}),{...this.specialValidationErrors(),...t}},inputValues:function(){const e=this,t={};return Object.keys(this.fields).forEach(s=>{const a=e.fields[s].hasOwnProperty("value")?"value":"selected";t[s]=e.fields[s][a]}),{...this.specialInputValues(),...t}}},data:()=>({fields:{}})};t.b=i}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{437:function(e,t,l){"use strict";l.r(t);var i={name:"ColumnLayout",mixins:[l(224).a]},s=l(18),a=Object(s.a)(i,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("form",{staticClass:"biq-layout-column d-flex flex-column",attrs:{id:e.idPrefix+"-search-form"}},[l("div",{staticClass:"d-flex flex-wrap"},[l("div",{staticClass:"flex-column"},[e.useLabels?l("label",{attrs:{for:e.fields.journey_type.id,id:e.fields.journey_type.id+"-select"}},[e._v(e._s(e.fields.journey_type.label))]):e._e(),e._v(" "),l("b-form-select",{staticClass:"biq-journey",attrs:{options:e.fields.journey_type.options,id:e.fields.journey_type.id},model:{value:e.fields.journey_type.selected,callback:function(t){e.$set(e.fields.journey_type,"selected",t)},expression:"fields.journey_type.selected"}})],1)]),e._v(" "),l("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[l("biq-places-lookup",{key:"pickup",ref:"pickupfield",attrs:{"biq-places-lookup":e.biqPlacesLookup,"biq-public-key":e.biqPublicKey,required:e.fields.pickup.required,"error-state":e.fields.pickup.error,id:e.fields.pickup.id,label:e.useLabels?e.fields.pickup.label:"",placeholder:e.fields.pickup.placeholder,debugging:e.debugging,"container-class":"biq-pickup flex-fill"},on:{biqPlacesLookupError:e.onPlacesLookupError},model:{value:e.fields.pickup.value,callback:function(t){e.$set(e.fields.pickup,"value",t)},expression:"fields.pickup.value"}}),e._v(" "),l("biq-places-lookup",{key:"destination",ref:"destinationfield",attrs:{"biq-places-lookup":e.biqPlacesLookup,"biq-public-key":e.biqPublicKey,required:e.fields.destination.required,"error-state":e.fields.destination.error,id:e.fields.destination.id,label:e.useLabels?e.fields.destination.label:"",placeholder:e.fields.destination.placeholder,debugging:e.debugging,"container-class":"biq-destination flex-fill"},on:{biqPlacesLookupError:e.onPlacesLookupError},model:{value:e.fields.destination.value,callback:function(t){e.$set(e.fields.destination,"value",t)},expression:"fields.destination.value"}})],1),e._v(" "),l("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[l("biq-places-lookup",{key:"via",ref:"viafield",attrs:{"biq-places-lookup":e.biqPlacesLookup,"biq-public-key":e.biqPublicKey,required:e.fields.via.required,"error-state":e.fields.via.error,id:e.fields.via.id,label:e.useLabels?e.fields.via.label:"",placeholder:e.fields.via.placeholder,debugging:e.debugging,"container-class":"biq-via flex-fill"},on:{biqPlacesLookupError:e.onPlacesLookupError},model:{value:e.fields.via.value,callback:function(t){e.$set(e.fields.via,"value",t)},expression:"fields.via.value"}}),e._v(" "),l("div",{staticClass:"flex-fill"},[e.useLabels?l("label",{attrs:{id:e.fields.people.id+"-input",for:e.fields.people.id}},[e._v(e._s(e.fields.people.label))]):e._e(),e._v(" "),l("input",{directives:[{name:"model",rawName:"v-model",value:e.fields.people.value,expression:"fields.people.value"}],staticClass:"biq-people flex-fill",class:e.errorStateClass("people"),attrs:{id:e.fields.people.id,placeholder:e.fields.people.placeholder,required:e.fields.people.required,type:"number",min:"1",max:"99"},domProps:{value:e.fields.people.value},on:{input:function(t){t.target.composing||e.$set(e.fields.people,"value",t.target.value)}}})])],1),e._v(" "),l("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[l("div",{staticClass:"flex-fill"},[e.useLabels?l("label",{attrs:{for:"tcplugin-date",id:"date-input"}},[e._v("Date")]):e._e(),e._v(" "),l("b-form-datepicker",{key:"date",staticClass:"biq-journey-date flex-fill",attrs:{state:e.journeyDateTimeErrorState("date"),id:"tcplugin-date",locale:"en"},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}},[l("template",{slot:"button-content"},[l("img",{attrs:{src:e.datePickerIconAsset}})])],2)],1),e._v(" "),l("div",{staticClass:"flex-fill"},[e.useLabels?l("label",{attrs:{for:"tcplugin-time",id:"time-input"}},[e._v("Time")]):e._e(),e._v(" "),l("b-form-timepicker",{key:"time",staticClass:"biq-journey-time flex-fill",attrs:{state:e.journeyDateTimeErrorState("time"),id:"tcplugin-time",locale:"en"},model:{value:e.time,callback:function(t){e.time=t},expression:"time"}},[l("template",{slot:"button-content"},[l("img",{attrs:{src:e.timePickerIconAsset}})])],2)],1)]),e._v(" "),e.hasReturn?l("div",{staticClass:"d-flex flex-wrap justify-content-between row-col"},[l("div",{staticClass:"flex-fill"},[e.useLabels?l("label",{attrs:{for:"tcplugin-return-date",id:"return_date-input"}},[e._v("Return Date")]):e._e(),e._v(" "),l("b-form-datepicker",{key:"return_date",staticClass:"biq-journey-return-date flex-fill",attrs:{state:e.journeyDateTimeErrorState("return_date"),id:"tcplugin-return-date",locale:"en"},model:{value:e.return_date,callback:function(t){e.return_date=t},expression:"return_date"}},[l("template",{slot:"button-content"},[l("img",{attrs:{src:e.datePickerIconAsset}})])],2)],1),e._v(" "),l("div",{staticClass:"flex-fill"},[e.useLabels?l("label",{attrs:{for:"tcplugin-return-time",id:"return_time-input"}},[e._v("Return Time")]):e._e(),e._v(" "),l("b-form-timepicker",{key:"return_time",staticClass:"biq-journey-return-time flex-fill",attrs:{state:e.journeyDateTimeErrorState("return_time"),id:"tcplugin-return-time",locale:"en"},model:{value:e.return_time,callback:function(t){e.return_time=t},expression:"return_time"}},[l("template",{slot:"button-content"},[l("img",{attrs:{src:e.timePickerIconAsset}})])],2)],1)]):e._e(),e._v(" "),l("div",{staticClass:"d-flex flex-wrap justify-content-end"},[l("div",{staticClass:"align-items-right col-6",attrs:{id:"biq-search-submit-container"}},[l("biq-process-form-submit",{attrs:{processing:e.loadingQuotes,"style-class":"btn-primary",label:"Search"},on:{click:e.onSearchQuotesFormSubmit}})],1)])])}),[],!1,null,null,null);t.default=a.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{411:function(e,n,t){"use strict";var o=t(29);const i={props:{appConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},appRESTBase:{...o.a.appURL},appAssetURL:{...o.a.appAssetURL},debugging:{...o.a.appDebugEnabled}}};n.a=i},417:function(e,n,t){},425:function(e,n,t){"use strict";t.r(n);var o=t(411),i=t(13);const s=(e,n,t,o)=>{const s=e=>new Date(Date.parse(e));return new Promise((a,r)=>{Object(i.d)(`${e}${t}`,n,o).then(e=>e.booking).then(e=>{const n={ref:t,name:e.passenger.name,passengers:Number.parseInt(e.people),pickup:e.pickup,destination:e.destination,vias:e.vias,date:s(e.date),return_date:null};return e.return&&(n.return_date=s(e.return)),a(n)}).catch(e=>Object(i.g)(r,e,"BIQ API Booking Details Load Error",o))})};var a=t(21);const r={header:"Booking Details",booking:{...a.e,name:"Name : ",ref:"Booking Reference : "}},l={li_css:"list-group-item d-flex justify-content-between align-items-center"};var g={name:"BookingJourneyDetails",props:{booking:{type:Object,default:function(){return{ref:"",name:"",passengers:1,pickup:"",destination:"",vias:[],date:null,return_date:null}}},labels:{type:Object,default:function(){return r}}},computed:{journeyDate:function(){return Object(a.j)(this.booking.date)},journeyTime:function(){return Object(a.k)(this.booking.date)},journeyReturnDate:function(){return Object(a.j)(this.booking.return_date)},journeyReturnTime:function(){return Object(a.k)(this.booking.return_date)}},data:()=>({...l})},u=t(18),d=Object(u.a)(g,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"flex-fill"},[t("h4",{staticClass:"card-header"},[e._v(e._s(e.labels.header))]),e._v(" "),t("ul",{staticClass:"card list-group list-group-flush"},[t("li",{class:e.li_css},[t("strong",[e._v(e._s(e.labels.booking.ref))]),e._v(" "),t("span",[e._v(e._s(e.booking.ref))])]),e._v(" "),t("li",{class:e.li_css},[t("strong",[e._v(e._s(e.labels.booking.name))]),e._v(" "),t("span",[e._v(e._s(e.booking.name))])]),e._v(" "),t("li",{class:e.li_css},[t("strong",[e._v(e._s(e.labels.booking.date))]),e._v(" "),t("span",[e._v(e._s(e.journeyDate)+" @ "+e._s(e.journeyTime))])]),e._v(" "),t("li",{class:e.li_css},[t("strong",[e._v(e._s(e.labels.booking.pickup))]),e._v(" "),t("span",[e._v(e._s(e.booking.pickup))])]),e._v(" "),t("li",{class:e.li_css},[t("strong",[e._v(e._s(e.labels.booking.destination))]),e._v(" "),t("span",[e._v(e._s(e.booking.destination))])])])])}),[],!1,null,null,null).exports;const b={header:"Booking Details",booking:{...a.e,name:"Name : ",ref:"Booking Reference : "}},p={loaded:!1,error:!1,booking:{ref:"",name:"",passengers:1,pickup:"",destination:"",vias:[],date:null,return_date:null}},c={biqPublicKey:{type:String,required:!0,default:""},bookingDetailsFrom:{type:String,required:!0,default:"//booking-details/?booking_ref="},bookingRef:{type:String,required:!0,default:""},labels:{type:Object,default:function(){return b}},styleClass:{type:String,default:"flex-sm-fill"},debugging:{type:Boolean,default:!1}},k={name:"detailsLoadError"};var _={name:"AsyncBookingJourneyDetails",props:c,methods:{getBookingDetails:function(){const e=this;this.loaded=!1,this.error=!1,this.debugging&&(console.group(`Loading Booking Details from '${this.bookingDetailsFrom}'`),console.log("Booking Details",{...this.booking})),s(this.bookingDetailsFrom,this.biqPublicKey,this.bookingRef,this.debugging).then(n=>{e.booking={...n,pickup:n.pickup.string,destination:n.destination.string},e.loaded=!0,e.debugging&&(console.log("Booking Details Loaded",{...e.booking}),console.groupEnd())}).catch(n=>{e.error=!0,e.$emit(k.name,n),e.debugging&&console.groupEnd()})}},components:{"biq-booking-journey-details":d},data:()=>({...p}),mounted(){this.getBookingDetails()}},f=Object(u.a)(_,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return e.loaded?t("div",{class:e.styleClass},[e._t("booking-journey-details",[t("biq-booking-journey-details",{attrs:{booking:e.booking,labels:e.labels}})],{booking:e.booking,labels:e.labels})],2):t("div",{class:e.styleClass},[e._t("loading",[t("div",{staticClass:"spinner-border"})])],2)}),[],!1,null,null,null).exports;t(417);const m={page_heading:"Your booking is complete",page_text:"Thank you for booking with us.",booking_details_labels:{header:"Booking Details",booking:{pickup:"Travelling From : ",destination:"Going To : ",passengers:"",via:"",date:"Date : ",return_date:"",name:"Name : ",ref:"Booking Reference : "}},loading_details:{ref:"...",name:"...",passengers:1,pickup:"...",destination:"...",vias:[],date:null,return_date:null},booking_load_error:!1};var v={name:"CompletePage",props:{appRESTBase:{type:String,default:"//"}},computed:{bookingDetailsFrom:function(){return`${this.appRESTBase}${this.appConfig.BOOKING_DETALS_URI}`}},methods:{onDetailsLoadError:function(){this.booking_load_error=!0}},mixins:[o.a],components:{"async-biq-booking-journey-details":f,"biq-booking-journey-details":d},data(){return{...m,page_text:this.appSettings.complete_page_text}}},h=Object(u.a)(v,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"biq-complete-page"}},[t("h3",[e._v(e._s(e.page_heading))]),e._v(" "),t("div",{staticClass:"d-flex flex-wrap"},[t("div",{staticClass:"flex-sm-fill"},[t("p",[e._v(e._s(e.page_text))])]),e._v(" "),t("async-biq-booking-journey-details",{attrs:{"booking-details-from":e.bookingDetailsFrom,"biq-public-key":e.appSettings.biq_pk,"booking-ref":e.$route.params.booking_ref,labels:e.booking_details_labels,debugging:e.debugging,id:"biq-journey-details-booked"},on:{detailsLoadError:e.onDetailsLoadError},scopedSlots:e._u([{key:"loading",fn:function(){return[t("biq-booking-journey-details",{attrs:{booking:e.loading_details,labels:e.booking_details_labels}})]},proxy:!0}])})],1)])}),[],!1,null,null,null);n.default=h.exports}}]);
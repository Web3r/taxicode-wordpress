(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{265:function(e,o,n){"use strict";const t={props:{appConfig:{type:Object,required:!0,default:function(){return null}},appSettings:{type:Object,required:!0,default:function(){return null}},debugging:{type:Boolean,default:!1}}};o.a=t},272:function(e,o,n){},273:function(e,o,n){},278:function(e,o,n){"use strict";n.r(o);var t=n(265),i=n(25),a=n.n(i),s=n(18);const r={header:"Booking Details",booking:{ref:"Booking Reference : ",name:"Name : ",passengers:"Passengers : ",pickup:"Pickup : ",destination:"Destination : ",via:"Via : ",date:"Date : ",return_date:"Returning : "}},l={li_css:"list-group-item d-flex justify-content-between align-items-center"};var g={name:"BookingJourneyDetails",props:{booking:{type:Object,default:function(){return{ref:"",name:"",passengers:1,pickup:"",destination:"",vias:[],date:null,return_date:null}}},labels:{type:Object,default:function(){return r}}},computed:{journeyDate:function(){return Object(s.f)(this.booking.date)},journeyTime:function(){return Object(s.g)(this.booking.date)},journeyReturnDate:function(){return Object(s.f)(this.booking.return_date)},journeyReturnTime:function(){return Object(s.g)(this.booking.return_date)}},data:()=>({...l})},u=n(19),d=Object(u.a)(g,(function(){var e=this,o=e.$createElement,n=e._self._c||o;return n("div",{staticClass:"flex-fill"},[n("h4",{staticClass:"card-header"},[e._v(e._s(e.labels.header))]),e._v(" "),n("ul",{staticClass:"card list-group list-group-flush"},[n("li",{class:e.li_css},[n("strong",[e._v(e._s(e.labels.booking.ref))]),e._v(" "),n("span",[e._v(e._s(e.booking.ref))])]),e._v(" "),n("li",{class:e.li_css},[n("strong",[e._v(e._s(e.labels.booking.name))]),e._v(" "),n("span",[e._v(e._s(e.booking.name))])]),e._v(" "),n("li",{class:e.li_css},[n("strong",[e._v(e._s(e.labels.booking.date))]),e._v(" "),n("span",[e._v(e._s(e.journeyDate)+" @ "+e._s(e.journeyTime))])]),e._v(" "),n("li",{class:e.li_css},[n("strong",[e._v(e._s(e.labels.booking.pickup))]),e._v(" "),n("span",[e._v(e._s(e.booking.pickup))])]),e._v(" "),n("li",{class:e.li_css},[n("strong",[e._v(e._s(e.labels.booking.destination))]),e._v(" "),n("span",[e._v(e._s(e.booking.destination))])])])])}),[],!1,null,null,null).exports;const b={header:"Booking Details",booking:{ref:"Booking Reference : ",name:"Name : ",passengers:"Passengers : ",pickup:"Pickup : ",destination:"Destination : ",via:"Via : ",date:"Date : ",return_date:"Returning : "}},c={loaded:!1,error:!1,booking:{ref:"",name:"",passengers:1,pickup:"",destination:"",vias:[],date:null,return_date:null}},p={bookingDetailsFrom:{type:String,required:!0,default:"//booking-details/?booking_ref="},bookingRef:{type:String,required:!0,default:""},labels:{type:Object,default:function(){return b}},styleClass:{type:String,default:"flex-sm-fill"},debugging:{type:Boolean,default:!1}},k={name:"detailsLoadError"};var _={name:"AsyncBookingJourneyDetails",props:p,methods:{getBookingDetails:function(){const e=this;this.loaded=!1,this.error=!1,this.debugging&&(console.group(`Loading Booking Details from '${this.bookingDetailsFrom}'`),console.log("Booking Details",{...this.booking})),a.a.get(`${this.bookingDetailsFrom}${this.bookingRef}`).then(o=>{if(e.debugging&&console.log(o),"OK"!=o.data.status)throw new ErrorEvent(o.data.status,{error:new Error("Booking Details Error"),message:o.data[o.data.status.toLowerCase()]});const n={ref:e.bookingRef,name:o.data.booking.passenger.name,passengers:Number.parseInt(o.data.booking.people),pickup:o.data.booking.pickup.string,destination:o.data.booking.destination.string,vias:o.data.booking.vias,date:Object(s.b)(o.data.booking.date),return_date:null};o.data.booking.return&&(n.return_date=Object(s.b)(o.data.booking.return)),e.booking=n,e.loaded=!0,e.debugging&&(console.log("Booking Details Loaded",{...e.booking}),console.groupEnd())}).catch(o=>{e.error=!0;const n={data:{bookingRef:e.bookingRef,URL:e.bookingDetailsFrom,error:o}};e.$emit(k.name,n),e.debugging&&(console.info("Booking Details Load Error"),console.log(n),console.groupEnd())})}},components:{"biq-booking-journey-details":d},data:()=>({...c}),mounted(){this.getBookingDetails()}},f=Object(u.a)(_,(function(){var e=this,o=e.$createElement,n=e._self._c||o;return e.loaded?n("div",{class:e.styleClass},[e._t("booking-journey-details",[n("biq-booking-journey-details",{attrs:{booking:e.booking,labels:e.labels}})],{booking:e.booking,labels:e.labels})],2):n("div",{class:e.styleClass},[e._t("loading",[n("div",{staticClass:"spinner-border"})])],2)}),[],!1,null,null,null).exports;n(272),n(273);const m={page_heading:"Your booking is complete",page_text:"Thank you for booking with us.",booking_details_labels:{header:"Booking Details",booking:{ref:"Booking Reference : ",name:"Name : ",passengers:"",pickup:"Travelling From : ",destination:"Going To : ",via:"",date:"Date : ",return_date:""}},loading_details:{ref:"...",name:"...",passengers:1,pickup:"...",destination:"...",vias:[],date:null,return_date:null},booking_load_error:!1};var v={name:"CompletePage",props:{appRESTBase:{type:String,default:"//"}},computed:{bookingDetailsFrom:function(){return`${this.appRESTBase}${this.appConfig.BOOKING_DETALS_URI}`}},methods:{onDetailsLoadError:function(){this.booking_load_error=!0}},mixins:[t.a],components:{"async-biq-booking-journey-details":f,"biq-booking-journey-details":d},data(){return{...m,page_text:this.appSettings.complete_page_text}}},h=Object(u.a)(v,(function(){var e=this,o=e.$createElement,n=e._self._c||o;return n("div",{attrs:{id:"biq-complete-page"}},[n("h3",[e._v(e._s(e.page_heading))]),e._v(" "),n("div",{staticClass:"d-flex flex-wrap"},[n("div",{staticClass:"flex-sm-fill"},[n("p",[e._v(e._s(e.page_text))])]),e._v(" "),n("async-biq-booking-journey-details",{attrs:{"booking-details-from":e.bookingDetailsFrom,"booking-ref":e.$route.params.booking_ref,labels:e.booking_details_labels,debugging:e.debugging,id:"biq-journey-details-booked"},on:{detailsLoadError:e.onDetailsLoadError},scopedSlots:e._u([{key:"loading",fn:function(){return[n("biq-booking-journey-details",{attrs:{booking:e.loading_details,labels:e.booking_details_labels}})]},proxy:!0}])})],1)])}),[],!1,null,null,null);o.default=h.exports}}]);
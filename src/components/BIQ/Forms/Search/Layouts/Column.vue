<template>
    <form 
        :id="`${idPrefix}-search-form`" 
        class="biq-layout-column d-flex flex-column"
    >
        <div class="d-flex flex-wrap">
            <div class="col-6">
                <label 
                    :for="fields.journey_type.id" 
                    :id="`${fields.journey_type.id}-select`"
                >{{fields.journey_type.label}}</label>

                <b-form-select 
                    v-model="fields.journey_type.selected" 
                    :options="fields.journey_type.options"
                    :id="fields.journey_type.id"
                    class="biq-journey"
                ></b-form-select>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between row-col">
            <biq-places-lookup 
                ref="pickupfield"
                key="pickup"
                v-model="fields.pickup.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.pickup.required"
                :error-state="fields.pickup.error"
                :id="fields.pickup.id"
                :label="fields.pickup.label"
                :placeholder="fields.pickup.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-pickup flex-fill"
            ></biq-places-lookup>

            <biq-places-lookup 
                ref="destinationfield"
                key="destination"
                v-model="fields.destination.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.destination.required"
                :error-state="fields.destination.error"
                :id="fields.destination.id"
                :label="fields.destination.label"
                :placeholder="fields.destination.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-destination flex-fill"
            ></biq-places-lookup>
        </div>

        <div class="d-flex flex-wrap justify-content-between row-col">
            <biq-places-lookup 
                ref="viafield"
                key="via"
                v-model="fields.via.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.via.required"
                :error-state="fields.via.error"
                :id="fields.via.id"
                :label="fields.via.label"
                :placeholder="fields.via.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-via flex-fill"
            ></biq-places-lookup>

            <div class="flex-fill">
                <label 
                    :id="`${fields.people.id}-input`" 
                    :for="fields.people.id"
                >{{fields.people.label}}</label>

                <input 
                    v-model="fields.people.value" 
                    :id="fields.people.id"
                    :placeholder="fields.people.placeholder" 
                    :required="fields.people.required"
                    :class="errorStateClass('people')" 
                    class="biq-people flex-fill"
                    type="number" 
                    min="1"
                    max="99"
                />
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between row-col">
            <div class="flex-fill">
                <label 
                    for="tcplugin-date" 
                    id="date-input"
                >Date</label>

                <b-form-datepicker 
                    v-model="date" 
                    key="date"
                    :state="journeyDateTimeErrorState('date')" 
                    id="tcplugin-date" 
                    locale="en" 
                    class="biq-journey-date flex-fill"
                ></b-form-datepicker>
            </div>

            <div class="flex-fill">
                <label 
                    for="tcplugin-time" 
                    id="time-input"
                >Time</label>

                <b-form-timepicker 
                    v-model="time" 
                    key="time"
                    :state="journeyDateTimeErrorState('time')" 
                    id="tcplugin-time" 
                    locale="en"
                    class="biq-journey-time flex-fill"
                ></b-form-timepicker>
            </div>
       </div>

        <div v-if="hasReturn" 
            class="d-flex flex-wrap justify-content-between row-col"
        >
            <div class="flex-fill">
                <label 
                    for="tcplugin-return-date" 
                    id="return_date-input"
                >Return Date</label>

                <b-form-datepicker 
                    v-model="return_date" 
                    key="return_date"
                    :state="journeyDateTimeErrorState('return_date')" 
                    id="tcplugin-return-date" 
                    locale="en" 
                    class="biq-journey-return-date flex-fill"
                ></b-form-datepicker>
            </div>

            <div class="flex-fill">
                <label 
                    for="tcplugin-return-time" 
                    id="return_time-input"
                >Return Time</label>

                <b-form-timepicker 
                    v-model="return_time" 
                    key="return_time"
                    :state="journeyDateTimeErrorState('return_time')" 
                    id="tcplugin-return-time" 
                    locale="en"
                    class="biq-journey-return-time flex-fill"
                ></b-form-timepicker>
            </div>
       </div>

        <div class="d-flex flex-wrap justify-content-end">
            <div 
                id="biq-search-submit-container" 
                class="align-items-right col-6"
            >
                <biq-process-form-submit 
                    :processing="loadingQuotes"
                    @click="onSearchQuotesFormSubmit"
                    style-class="btn-primary"
                    label="Search"
                ></biq-process-form-submit>
            </div>
       </div>
    </form>
</template>

<script>
    // import the mixin that controls the BIQ search without form layout worries
    import biqSearchMixin from 'BIQ/mixins/SearchMixin';

    export default {
        name : 'ColumnLayout',

        mixins : [
            biqSearchMixin
        ]
    };
</script>

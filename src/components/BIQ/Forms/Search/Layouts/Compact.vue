<template>
    <form 
        :id="`${idPrefix}-search-form`" 
        class="biq-layout-compact"
    >
        <div class="d-flex flex-wrap">
            <div class="biq-pickup flex-sm-fill">
                <b-form-select 
                    v-model="fields.journey_type.selected" 
                    :options="fields.journey_type.options"
                    :id="fields.journey_type.id"
                    class="biq-journey"
                ></b-form-select>
            </div>

            <biq-places-lookup 
                ref="pickupfield"
                key="pickup"
                v-model="fields.pickup.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.pickup.required"
                :error-state="fields.pickup.error"
                :id="fields.pickup.id"
                :placeholder="fields.pickup.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-pickup flex-sm-fill"
            ></biq-places-lookup>

            <biq-places-lookup 
                ref="viafield"
                key="via"
                v-model="fields.via.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.via.required"
                :error-state="fields.via.error"
                :id="fields.via.id"
                :placeholder="fields.via.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-via flex-sm-fill"
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
                :placeholder="fields.destination.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-destination flex-sm-fill"
            ></biq-places-lookup>

            <b-form-datepicker 
                v-model="date" 
                key="date"
                :state="journeyDateTimeErrorState('date')" 
                :date-format-options="date_picker_formats.short"
                id="tcplugin-date" 
                class="biq-journey-date flex-sm-fill"
                locale="en" 
            ></b-form-datepicker>

            <b-form-timepicker 
                v-model="time" 
                key="time"
                :state="journeyDateTimeErrorState('time')" 
                id="tcplugin-time" 
                class="biq-journey-time flex-sm-fill"
                locale="en"
            ></b-form-timepicker>
        </div>

        <div 
            class="d-flex align-items-center"
        >
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


        <div v-if="hasReturn"
            class="d-flex flex-wrap "
        >
            <b-form-datepicker 
                v-model="return_date" 
                key="return_date"
                :date-format-options="date_picker_formats.short"
                :state="journeyDateTimeErrorState('return_date')" 
                :required="hasReturn"
                id="tcplugin-return-date" 
                locale="en" 
                class="biq-journey-return-date flex-sm-fill"
            ></b-form-datepicker>
            <b-form-timepicker 
                v-model="return_time" 
                key="return_time"
                :state="journeyDateTimeErrorState('return_time')" 
                :required="hasReturn"
                id="tcplugin-return-time" 
                locale="en"
                class="biq-journey-return-time flex-sm-fill"
            ></b-form-timepicker>
        </div>

        <div 
            id="biq-search-submit-container" 
            class="d-flex align-items-center"
        >
            <div class="flex-fill">
                <biq-process-form-submit 
                    :processing="loadingQuotes"
                    @click="onSearchQuotesFormSubmit"
                    style-class="btn-primary"
                    label="Get A Quote"
                ></biq-process-form-submit>
            </div>
        </div>
    </form>
</template>

<script>
    // import the mixin that controls the BIQ search without form layout worries
    import biqSearchMixin from 'BIQ/mixins/SearchMixin';

    export default {
        name : 'CompactLayout',

        mixins : [
            biqSearchMixin
        ]
    };
</script>

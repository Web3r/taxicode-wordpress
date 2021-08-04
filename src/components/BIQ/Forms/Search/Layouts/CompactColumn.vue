<template>
    <form 
        :id="`${idPrefix}-search-form`" 
        class="biq-layout-compact-column"
    >
        <div class="d-flex flex-column">
            <div class="biq-journey flex-column">
                <label v-if="useLabels" 
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

            <biq-places-lookup 
                ref="pickupfield"
                key="pickup"
                v-model="fields.pickup.value"
                :biq-places-lookup="biqPlacesLookup"
                :biq-public-key="biqPublicKey"
                :required="fields.pickup.required"
                :error-state="fields.pickup.error"
                :id="fields.pickup.id"
                :label="useLabels ? fields.pickup.label : ''"
                :placeholder="fields.pickup.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-pickup flex-column"
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
                :label="useLabels ? fields.via.label : ''"
                :placeholder="fields.via.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-via flex-column"
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
                :label="useLabels ? fields.destination.label : ''"
                :placeholder="fields.destination.placeholder"
                :debugging="debugging"
                @biqPlacesLookupError="onPlacesLookupError"
                container-class="biq-destination flex-column"
            ></biq-places-lookup>

            <b-form-datepicker 
                v-model="date" 
                key="date"
                :state="journeyDateTimeErrorState('date')" 
                :date-format-options="date_picker_formats.short"
                id="tcplugin-date" 
                class="biq-journey-date flex-sm-fill"
                locale="en" 
            >
                <template slot="button-content">
                    <img :src="datePickerIconAsset" />
                </template>
            </b-form-datepicker>

            <b-form-timepicker 
                v-model="time" 
                key="time"
                :state="journeyDateTimeErrorState('time')" 
                id="tcplugin-time" 
                class="biq-journey-time flex-sm-fill"
                locale="en"
            >
                <template slot="button-content">
                    <img :src="timePickerIconAsset" />
                </template>
            </b-form-timepicker>

            <b-form-datepicker v-if="hasReturn"
                v-model="return_date" 
                key="return_date"
                :date-format-options="date_picker_formats.short"
                :state="journeyDateTimeErrorState('return_date')" 
                :required="hasReturn"
                id="tcplugin-return-date" 
                locale="en" 
                class="biq-journey-return-date flex-fill"
            >
                <template slot="button-content">
                    <img :src="datePickerIconAsset" />
                </template>
            </b-form-datepicker>
            
            <b-form-timepicker v-if="hasReturn"
                v-model="return_time" 
                key="return_time"
                :state="journeyDateTimeErrorState('return_time')" 
                :required="hasReturn"
                id="tcplugin-return-time" 
                locale="en"
                class="biq-journey-return-time flex-fill"
            >
                <template slot="button-content">
                    <img :src="timePickerIconAsset" />
                </template>
            </b-form-timepicker>

            <div 
                class="biq-people flex-column"
            >
                <label v-if="useLabels" 
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
        name : 'CompactColumnLayout',

        mixins : [
            biqSearchMixin
        ]
    };
</script>

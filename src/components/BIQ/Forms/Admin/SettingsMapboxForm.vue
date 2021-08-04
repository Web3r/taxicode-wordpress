<template>
    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.mapbox_public.id"
                    >{{fields.mapbox_public.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.mapbox_public.value" 
                        :id="fields.mapbox_public.id" 
                        :placeholder="fields.mapbox_public.placeholder" 
                        :required="fields.mapbox_public.required"
                        :class="errorStateClass('mapbox_public')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="mapbox_publicHelp" 
                    />

                <button 
                    @click="onMapTestClick" 
                    class="button button-secondary"
                >Test</button>

                <popup-modal v-if="show_map_test_modal"
                    header="Mapbox API integration test"
                    footer="Cancel"
                    @cancel="show_map_test_modal = false"
                >
                    <!-- you can use custom content here to overwrite default content -->
                    <template #body>
                        <the-biq-journey-route-map
                            ref="map"
                            :mapbox-public-key="fields.mapbox_public.value"
                            :mapbox-style="fields.mapbox_style.value"
                            :pickup="mapbox_test.pickup"
                            :destination="mapbox_test.destination"
                            :debugging="debugging"
                            @directionsError="onMapTestError"
                        >
                        </the-biq-journey-route-map>

                        <div v-if="map_test_error">
                            <h3>Error</h3>
                        </div>
                    </template>

                    <!-- you can use custom content here to overwrite default content -->
                    <template #footer="{ text, cancel }">
                        <button 
                            class="button button-secondary" 
                            @click="cancel"
                        >{{text}}</button>
                    </template>

                </popup-modal>
                    <br />
                    <small 
                        id="mapbox_publicHelp" 
                        class="form-text text-muted"
                    >{{fields.mapbox_public.help}}</small>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label 
                        :for="fields.mapbox_style.id"
                    >{{fields.mapbox_style.label}}</label>
                </th>
                <td>
                    <input 
                        v-model="fields.mapbox_style.value" 
                        :id="fields.mapbox_style.id" 
                        :placeholder="fields.mapbox_style.placeholder" 
                        :required="fields.mapbox_style.required"
                        :class="errorStateClass('mapbox_style')" 
                        type="text" 
                        class="regular-text" 
                        aria-describedby="mapbox_styleHelp" 
                    />
                    <br />
                    <small 
                        id="mapbox_styleHelp" 
                        class="form-text text-muted"
                    >
                        {{fields.mapbox_style.help}} See <a 
                            :href="mapbox_styles_list_docs_url" 
                            title="Mapbox-owned styles" 
                            target="_blank"
                        >Mapbox styles</a> for details of valid styles.
                    </small>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    // import the mixin that sets values & validates field values
    import ValidatesMixin from 'mixins/ValidatesMixin';
    // import the geo coords
    import { toLocationObject, LAT_LNG_LONDON, LAT_LNG_LHR } from '@BIQ/LocationService';
    // import the BIQ static config
    import { MAPBOX_STYLES_LIST_DOCS_URL } from 'BIQ/config';
    // import the basic modal popup
    import BasicConfirmModal from '@/components/BasicConfirmModal.vue';

    // define the default map style sheet URL resource
    const default_map_style = 'mapbox://styles/mapbox/streets-v11';

    // define the component properties
    const props = {
        values : {
            type : Object,
            // @todo add a validator to make sure that all the fieldname keys are supplied
            default : function() { 
                return {
                    mapbox_public : '',
                    mapbox_style : default_map_style
                };
            }
        }
    };
    
    /**
     * Generate the list of field name = data form field structure for passenger details form
     * @param {String} idp A string to prefix the fields ID attribute with
     * @returns Object
     */
    const fF = idp => {
        return {
            mapbox_public : {
                value : '',
                label : 'Mapbox Public API Key',
                required : true,
                error : null,
                errorMsg : 'Mapbox API is required to display the quote journey route.',
                id : `${idp}mapbox_public`,
                placeholder : 'Enter the Mapbox Public API Key',
                help : 'The Mapbox Public API key to display journey routes.'
            },
            mapbox_style : {
                value : default_map_style,
                label : 'Mapbox Style',
                required : true,
                error : null,
                errorMsg : 'Mapbox Style is required to display the quote journey route.',
                id : `${idp}mapbox_style`,
                placeholder : 'e.g. mapbox://style',
                help : 'The Mapbox style to display journey routes with.'
            }
        }
    };
    // define the component methods
    const methods = {
        onMapTestClick : function(evt) {
            // reset any previous map test error flag
            this.map_test_error = false;
            // set the flag to show the map test popup
            this.show_map_test_modal = true;
        },

        onMapTestError : function(evt) {
            console.log('map error', evt);
            // set the map test error flag
            this.map_test_error = true;
        }

    };


    export default {
        name : 'SettingsMapboxForm',
        props,
        methods,

        mixins : [
            ValidatesMixin
        ],

        components : {
            'popup-modal' : BasicConfirmModal,
            'the-biq-journey-route-map' : () => import(/* webpackChunkName: "BIQJourneyRouteMap", webpackPrefetch: true */ 'BIQ/JourneyRouteMap.vue'),
        },

        data() {
            return {
                fields : fF(''),
                show_map_test_modal : false,
                map_test_error : false,
                mapbox_styles_list_docs_url : MAPBOX_STYLES_LIST_DOCS_URL,
                mapbox_test : {
                    pickup : toLocationObject('London', '', LAT_LNG_LONDON),
                    desination : toLocationObject('London Heathrow', 'TW6 1AP', LAT_LNG_LHR)
                }
            };
        },

        mounted() {
            // populate the settings form from the supplied values
            this.setFieldValues();
        }
    };
</script>

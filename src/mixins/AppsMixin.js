// import the plugin to handle the Xhr AJAX request
import axios from 'axios';

// define the common stuff for the apps
const AppsMixin = {
    props: {
        appURL : {
            type : String,
            required : true,
            default : '//',
        },

        appDebugEnabled : {
            type : Boolean,
            default : false
        }
    },

    data() {
        return {
            initialised : false,
            settings : {}
        };
    },

    computed : {
        appSettings : function() {
            return { ...this.settings };
        }
    },

    methods : {
        getAppSettings : function() {
            const app = this;
            const settings_url = `${this.appURL}settings-get/`;
            if(this.appDebugEnabled) {
                console.group(`Loading App Settings from '${settings_url}'`);
            }
            axios.get(settings_url)
            .then(response => {
                app.appSettingsUpdated(response.data);
                app.initialised = true;
            })
            .catch(error => {
                if(app.appDebugEnabled) {
                    console.info('Updated Settings');
                    console.log(error);
                }
                console.error(error);
            })
            .finally(() => {
                if(app.appDebugEnabled) {
                    console.groupEnd();
                }
            });
        },

        appSettingsUpdated : function(new_settings) {
            if(this.appDebugEnabled) {
                console.group('Updating App Settings');
                console.log('App Settings', {...this.settings});
                console.log('New Settings', new_settings);
            }
            // just extract all the supplied settings
            const settings = {
                ...new_settings
            };
            // set the app settings provided
            this.settings = settings;
            if(this.appDebugEnabled) {
                console.info('Updated Settings');
                console.log('Settings', settings);
                console.log('App Settings', {...this.settings});
                console.groupEnd();
            }
        }
    }
};
// export the default object container
export default AppsMixin;

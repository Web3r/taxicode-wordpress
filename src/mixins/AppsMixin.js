// import the plugin to handle the Xhr AJAX request
import axios from 'axios';

// define the main App component Mixin properties
export const props = {
    appURL : {
        type : String,
        required : true,
        default : '//',
        // @todo add a validator to ensure the URL ends with a /
    },

    appDebugEnabled : {
        type : Boolean,
        default : false
    }
};
// define the main App component computed property Mixin methods
export const computed = {
    appSettings : function() {
        return { ...this.settings };
    }
};
// define the main App component Mixin methods
export const methods = {
    getAppSettings : function(rqc_cb, cb) {
        const app = this;
        const URL = `${this.appURL}settings/`;
        if(this.appDebugEnabled) {
            console.group(`Loading App Settings from '${URL}'`);
        }
        const rqc = (typeof(rqc_cb) == 'function') 
            // use the return from the supplied callback
            ? rqc_cb.call(this) 
            // just extract all the supplied settings
            : { };
        axios.get(URL, rqc)
        .then(r => {
            app.appSettingsUpdated(r.data, cb);
            app.initialised = true;
        })
        .catch(e => {
            if(app.appDebugEnabled) {
                console.info('Updated Settings Error');
                console.log(e);
            }
            console.error(e);
        })
        .finally(() => {
            if(app.appDebugEnabled) {
                console.groupEnd();
            }
        });
    },

    appSettingsUpdated : function(ns, cb) {
        if(this.appDebugEnabled) {
            console.group('Updating App Settings');
            console.log('App Settings', { ...this.settings });
            console.log('New Settings', ns);
        }
        const s = (typeof(cb) == 'function') 
            // use the return from the supplied callback
            ? cb.call(this, ns) 
            // just extract all the supplied settings
            : { ...ns };
        // set the app settings provided
        this.settings = s;
        if(this.appDebugEnabled) {
            console.info('Updated Settings');
            console.log('Settings', s);
            console.log('App Settings', { ...this.settings });
            console.groupEnd();
        }
    }
};

// define the App Mixin for components to include & inherit from
export const AppsMixin = {
    props,
    computed,
    methods,

    data() {
        return {
            initialised : false,
            settings : { }
        };
    }    
};
// export the default object container
export default AppsMixin;

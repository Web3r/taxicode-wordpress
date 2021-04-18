// define the Pages component Mixin properties
export const pagesProps = {
    appConfig : {
        type : Object,
        required : true,
        default : function() { 
            return null;
        }
    },

    appSettings : {
        type : Object,
        required : true,
        default : function() { 
            return null;
        }
    },

    debugging : {
        type : Boolean,
        default : false
    }
};

// define the Pages Mixin for components to include & inherit from
export const PagesMixin = {
    props : pagesProps
};
// export the Pages Mixin as the default object
export default PagesMixin;

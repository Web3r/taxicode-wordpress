// define the Page Mixin for components to include & inherit from
export const PagesMixin = {
    props: {
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
    }
};
// export the Page Mixin as the default object
export default PagesMixin;

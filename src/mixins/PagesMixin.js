const PagesMixin = {
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

export default PagesMixin;

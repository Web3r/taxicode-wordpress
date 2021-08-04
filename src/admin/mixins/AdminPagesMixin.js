// import the mixin that defines the common Page route Components
import PagesMixin from 'mixins/PagesMixin';
// import the flash message to display messages about updating the settings
import FlashMessage from '@/components/FlashMessage.vue';

// define the admin page props
export const adminPagesProps = {
    adminNonce : {
        type : String,
        default : ''
    }
};

// define the admin page methods
export const adminPagesMethods = {
    flashMessage : function(h, m, s, t) {
        this.flash_message = {
            heading : h,
            message : m,
            class : s
        };
        // clear the message after x seconds
        return setTimeout(() => { 
            this.flash_message = false;
        }, t);
    }
};

// define the Admin Page Mixin
export const adminPagesMixin = {
    props : {
        // include the pages mixin props
        ...PagesMixin.props,
        ...adminPagesProps
    },

    components : {
        'flash-message' : FlashMessage,
    },

    // use the following to extract the mixin data inside the component 
    // data method as it destroys this object
    // const mixinData = adminPagesMixin.data.call(this);
    data() {
        return {
            page_title : 'Admin Page',
            flash_message : false,
            flash_message_timeout : 5000,
        };
    },

    methods : {
        // include the pages mixin methods
        ...PagesMixin.methods,
        ...adminPagesMethods
    }
};
export default adminPagesMixin;

<template>
  
</template>

<script>
    // import the mixin that defines the common Admin Page route Components
    import AdminPagesMixin from 'admin/mixins/AdminPagesMixin';

    export default {
        name : 'TestsPage',

        mixins : [
            AdminPagesMixin
        ],

        data() {
            // need to extract the mixin data as this method destroys that object
            const mixinData = AdminPagesMixin.data.call(this);
            return {
                // include the mixin data
                ...mixinData,
                page_title : 'Admin Tests'
            };
        }


    }
</script>

<style>

</style>
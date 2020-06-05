# Taxicode For Wordpress

This is a wordpress plugin to allow booking with the Taxicode API, using Stripe for payments.

You will need public and private API keys for Taxicode, and an appropriate public API key for Stripe.  Please contact support@taxicode.com to get these - without the correct keys, supplied by Taxicode, this plugin will not work.

This plugin will only work under HTTPS.

## 📦 Working with this plugin

It is expected that any given install of this plugin will want to make modifications to fit with theme etc etc.

Out of the box, it ships with markup suitable for Bootstrap 4, and an npm-based build system.

 - Pre-configured webpack config
   - Babel loader, Vue loader, CSS and LESS loader
   - Separate `vendor.js` with all vendor scripts
   - Uglify JS for production
   - Separate `frontend.js` and `admin.js`
   - Extracted CSS/LESS to separate `frontend.css` (named vendor.css) and `admin.css` files.
   - Auto reloading with Browser with **Browsersync** *([config](config.json))*
 - [Vue](https://vuejs.org/) and [Vue Router](https://router.vuejs.org/en/)
 - Frontend (shortcode) and Backend starter app
 - Modern PHP codebase with [namespace](http://php.net/manual/en/language.namespaces.php) support


## 🚚 Running

1. Clone this repository in your plugins folder
1. Activate the plugin
1. Add the appropriate keys in the plugin
1. Add the shortcode [taxicode-app] to the page you want to run this plugin inside.

## 👨‍💻 Markup/CSS Customisation

This is relatively simple, even for people without Vue.JS experience.
The search form, and results template can be found at src/frontend/pages/Home.vue
The payment form can be found at src/frontend/pages/Checkout.vue
The confirmation page can be found src/frontend/pages/Checkout.vue

As long as field ID names and all the vue specific references are preservered,
operation should continue quite easily - essentially, add you can add any
class names your theme requires.

Alternatively, you can simply add "style" blocks below the "script" blocks in each
component, to apply custom styles there, as per the vue.js docs.

After making any modifications, while in the plugin base folder
(ie. wp-content/plugins/taxicode) simply:

1. Run `npm install`
1. On a dev system, run `npm run dev` 🤘
1. On a production system, run `npm run build` 👍

## Noteable Additonal Packages used

This plugin currently makes use of
vue-bootstrap (https://bootstrap-vue.org/) for
datepicker, timepicker, and icon elements.

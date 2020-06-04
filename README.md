# Taxicode For Wordpress

This is a wordpress plugin to allow booking with the Taxicode API, using Stripe for payments.

You will need public and private API keys for Taxicode, and an appropriate public API key for Stripe.  Please contact support@taxicode.com to get these - without the correct keys, supplied by Taxicode, this plugin will not work.


## 📦 Working with this plugin

It is expected that any given install of this plugin will want to make modifications to fit with theme etc etc.

Out of the box, it ships with markup suitable for Bootstrap 4, and an npm-based build system.

 - Pre-configured webpack config
   - Babel loader, Vue loader, CSS and LESS loader
   - Separate `vendor.js` with all vendor scripts
   - Uglify JS for production
   - Separate `frontend.js` and `admin.js`
   - Extracted CSS/LESS to separate `frontend.css` and `admin.css` files.
   - Auto reloading with Browser with **Browsersync** *([config](config.json))*
 - [Vue](https://vuejs.org/) and [Vue Router](https://router.vuejs.org/en/)
 - Frontend (shortcode) and Backend starter app
 - Modern PHP codebase with [namespace](http://php.net/manual/en/language.namespaces.php) support


## 🚚 Running

1. Clone this repository in your plugins folder
1. Activate the plugin
1. Add the appropriate keys in the plugin
1. Add the shortcode [taxicode-app] to the page you want to run this plugin inside.

## 👨‍💻 Post Installation

1. The name of the plugin class is `Base_Plugin`, change the class name with your desired class name.
1. Replace the PHP namespace `App` with your desired name.
1. Replace `baseplugin` or `BASEPLUGIN` reference in files.
1. Run `npm install`
1. To start developing, run `npm run dev` 🤘
1. For production build, run `npm run build` 👍

## 🎁 Preview

![screenshot](http://tareq.in/owiyZI+)

## ⛑ Extra Goodies

 1. [Vue List Table Component](https://github.com/tareq1988/vue-wp-list-table-component) - Helps you to build WordPress list tables easily.

## About

Made by [Tareq Hasan](https://github.com/tareq1988) from [weDevs](https://wedevs.com).

*Found anything that can be improved? You are welcome to contribute.*

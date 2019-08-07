# H2

H2 is the internal communications tool for Human Made.

<img src="https://hmn.md/uploads/sites/9/2019/04/Screenshot_2019-04-05-hm-linter-Status-Dev.png" />

H2 is a WordPress theme, inspired by the design and principles of [P2](https://p2theme.com/) by Automattic.


## Getting Started

H2 is a standalone WordPress theme you can activate on any site, and is a drop-in replacement for P2. You can add additional functionality by activating the companion plugins, which H2 will automatically detect and use.

### Local Setup

You'll need a WordPress set up already. If you don't have one, [get Chassis](http://docs.chassis.io/en/latest/).

Clone this repository into your themes directory:
```
git clone --recursive git@github.com:humanmade/H2.git h2
```

(If you forgot `--recursive`, initialize submodules by running `git submodule update --init` from the theme directory.)

Once the checkout is complete, `cd` into the cloned theme directory, install npm modules, and start the development server:
```
npm install
npm start
```

H2 uses [react-wp-scripts](https://github.com/humanmade/react-wp-scripts) to integrate with Webpack's development server. This means that H2 will try to load files from localhost if `SCRIPT_DEBUG` is `true`, and will white-screen if that server is not running. If you see a white screen after activating H2, check to make sure `SCRIPT_DEBUG` is defined (to use the hot-reloading dev server), or run `npm run build` to generate the production-ready static file bundle.


### Production Setup

For production, deploy H2 as a regular theme. You'll also need to build the assets for H2, as we don't release prebuilt versions.

As part of your deployment process, run the `.build-script` shell script in the root directory. This will install the Node dependencies and build the static assets ready for deployment.


## Add-on Plugins

### Emoji Reactions

H2 supports emoji reactions, but requires an additional plugin to provide the custom comment type and REST API endpoints.

Install and activate the [H2 Emoji Reactions](https://github.com/humanmade/h2-emoji-reactions) plugin to get started.


### Hovercards

H2 supports hovercards to preview data for users on your network.

<img src="https://hmn.md/uploads/sites/9/2019/04/Screen-Shot-2019-04-05-at-12.11.42.png" />

To enable Hovercards, you'll also need the [Global Facts](https://github.com/humanmade/global-facts) plugin, along with the development code to map your local users to HM users.


### Site Selector

H2 includes a site selector in the sidebar to facilitate using networks of H2 sites.

Install and activate the [H2 Site Selector](https://github.com/humanmade/h2-site-selector/tree/e4741ff0f6b35d0e8d2282a61710daaf79408965) plugin. This must be activated network-wide.

Once the plugin has been activated, access the Settings > H2 Sites page in your Network Admin to enable and disable sites.


## Credits

Created by Human Made. Licensed under the GPLv2+.

Uses ideas and concepts from P2 by Automattic. Licensed under the GPLv2+.

Support for Gravity Forms is derived from [Gravity Forms Iframe Add-On](https://github.com/cedaro/gravity-forms-iframe) by Brady Vercher. Licensed under the GPLv2+.

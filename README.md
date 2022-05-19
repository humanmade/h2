# H2

H2 is the internal communications tool for Human Made.

<img src="https://hmn.md/uploads/sites/9/2019/04/Screenshot_2019-04-05-hm-linter-Status-Dev.png" />

H2 is a WordPress theme, inspired by the design and principles of [P2](https://p2theme.com/) by Automattic.

(Also check out the [contributing documentation](CONTRIBUTING.md).)


## Getting Started

H2 is a standalone WordPress theme you can activate on any site, and is a drop-in replacement for P2. You can add additional functionality by activating the companion plugins, which H2 will automatically detect and use.

### Local Setup

You'll need a WordPress development environment. If you don't have one, [set up a local Altis environment](https://www.altis-dxp.com/resources/docs/local-server/).

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

H2 uses [humanmade/asset-loader](https://github.com/humanmade/asset-loader) to integrate with Webpack. If you are running H2 within Altis, the Asset Loader will be available already. If not, install and activate the asset-loader plugin (`humanmade/asset-loader` if installing with Composer) before trying to run H2.

H2 will load the assets from the Webpack DevServer (`npm start`) if it is running. If the DevServer is not running, H2 will look for a production build and load those assets. If you see a white screen after activating H2, run `npm run build` to generate a production-ready static file bundle.


### Production Setup

For production, deploy H2 as a regular theme. You'll also need to build the assets for H2, as we don't release prebuilt versions.

As part of your deployment process, run the `.build-script` shell script in the root directory. This will install the Node dependencies and build the static assets ready for deployment.

The build expects to be run using Node version 12.


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


## Other compatible plugins

H2 includes support for GitHub-style markdown checklists when writing posts from the frontend, but it also supports [the `todo-list-block` plugin](https://wordpress.org/plugins/todo-list-block/) for authoring todo lists within the block editor.


## Credits

Created by Human Made. Licensed under the GPLv2+.

Uses ideas and concepts from P2 by Automattic. Licensed under the GPLv2+.

Support for Gravity Forms is derived from [Gravity Forms Iframe Add-On](https://github.com/cedaro/gravity-forms-iframe) by Brady Vercher. Licensed under the GPLv2+.

# H2

H2 is the internal communications tool for Human Made.

<img src="https://hmn.md/uploads/sites/9/2019/04/Screenshot_2019-04-05-hm-linter-Status-Dev.png" />

H2 is a WordPress theme, inspired by the design and principles of [P2](https://p2theme.com/) by Automattic.

(Also check out the [contributing documentation](CONTRIBUTING.md).)


## Getting Started

H2 is a standalone WordPress theme you can activate on any site, and is a drop-in replacement for P2. You can add additional functionality by activating the companion plugins, which H2 will automatically detect and use.

## Deploy Process

The release and release-develop versions of the H2 theme are built using [GitHub Actions](https://github.com/features/actions). Any time a pull request is merged into the `main` or `develop` branches, that code is built and pushed to the corresponding `release` and `release-develop` branches. **You should not commit to the release branches directly,** nor submit pull requests against them.

Development workflow:

- Implement a feature or bugfix in a feature branch created off of `main`
- Submit a pull request from that feature branch back into `main`, and get code review
- Merge the feature branch into `develop` manually.
  - The `release-develop` branch will be automatically rebuilt
- Update the [development environment](https://github.com/humanmade/hm-playbook-dev) to reference the newest built version of the `release-develop` branch, to deploy and test the theme PR.
- Once approved, merge the pull request into `main`
  - The `release` branch will be automatically rebuilt
- Update the production branch `composer.json` in the [main network repository](https://github.com/humanmade/hmn.md) to reference the newest built version of the `release` branch, to deploy the change to production.

### Local Setup

You'll need a WordPress development environment. If you don't have one, [set up a local Altis environment](https://www.altis-dxp.com/resources/docs/local-server/).

Clone this repository into your themes directory:
```sh
git clone git@github.com:humanmade/h2.git h2
```

Once the checkout is complete, `cd` into the cloned theme directory, install npm modules, and start the development server:
```
npm install
npm start
```

H2 uses [humanmade/asset-loader](https://github.com/humanmade/asset-loader) to integrate with Webpack. If you are running H2 within Altis, the Asset Loader will be available already. If not, install and activate the asset-loader plugin (`humanmade/asset-loader` if installing with Composer) before trying to run H2.

H2 will load the assets from the Webpack DevServer (`npm start`) if it is running. If the DevServer is not running, H2 will look for a production build and load those assets. If you see a white screen after activating H2, run `npm run build` to generate a production-ready static file bundle.

Editor styles require the editor CSS to be present on disk, which is complex to achieve when using the DevServer. If you are working on or testing block editor styles, run the production build in watch mode:

```sh
npm run build -- --watch
```


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

To enable Hovercards, you'll need to have a `MAPBOX_KEY` PHP constant defined in your environment. You will also need the [Global Facts](https://github.com/humanmade/global-facts) plugin.

It is easiest to test Hovercards when using an H2 network database backup. If not, you may need to add development code to map your local users to Global Facts user profiles.


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

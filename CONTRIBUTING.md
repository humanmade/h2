# Contributing

Want to contribute to H2? Fantastic. Here's some guidelines and tips to contributing.


## Local setup

H2 is a React app as a WordPress theme. For full development, you'll need a WordPress development environment; [Chassis](https://chassis.io/) is a good choice.

H2 also comes with Storybook, which can be used for component design and development in isolation. This can be run locally without a WordPress install, and is recommended for design iteration.

**Note:** Some parts of H2 may require additional configuration or keys. Contact @rmccue for these.


### Storybook

Storybook can be run without a WordPress setup. To run it:

```sh
# Install dependencies
yarn install
# (or `npm install`)

# Run Storybook
yarn run storybook
# (or `npm run storybook`)
```

This will give you a component-level view of the project.


### Theme setup

H2 is a regular WordPress theme, so add it into a WordPress development environment as desired.

To develop with live reloading, run:

```sh
# Install dependencies
yarn install
# (or `npm install`)

# Run the server
yarn start
# (or `npm start`)
```

You may also wish to install the various plugins as noted in the README for testing further functionality such as emoji reactions.


## Project structure

* `inc/` contains the required backend code in PHP to run H2.
* `src/` contains the frontend React app.
	* `components/` contains all components powering the behaviour.
		* Each component has:
			* `.js` file containing the functionality.
			* `.css` file containing any styles for that component.
			* `.stories.js` file containing Storybook stories in [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/)
	* `plugins/` contains add-on functionality which is conditionally enabled based on server support.
	* `reducers/` contains the data
	* `stories/` contains helpers for Storybook, and any non-component stories (such as docs or design elements).
	* Files containing top-level helpers and components.

To understand the component structure, check out Storybook, which lays out the available components and roughly how they fit into the overall architecture.


## Standards

All coding standards follow the HM coding standards.

### Functionality

Generally, H2 should contain the minimal set of backend functionality required to power a H2-powered site. Any optional features which require work to the backend should be contained in functional plugins instead which can be activated or deactivated on sites as intended.

Frontend functionality which depends on optional features or configuration of the backend to operate should be implemented as React plugins. These React plugins can be included with H2 to keep development of core features together, or can be built into the backend plugin's codebase.


### Storybook

Storybook should be kept up-to-date with components as they are developed and improved, as it represents the key entrypoint for development and improvement.

Each component should have a corresponding `.stories.js` unless it is purely a HOC or other non-visible component. Where possible, aim to at least have stories which include documentation and examples of usage.


## Building functionality

When building functionality, aim to stick to using the existing components and styles over building them yourself. If new base components are required, these should be sufficiently abstracted such as to expand the component library.

Functionality should be usable across both mobile and desktop, although may not always take the same form, as each platform is different. Take into consideration the limitations and usage patterns of each platform. For example, the search bar appears in the header on desktop, but due to limited space, instead appears in the super menu on mobile.

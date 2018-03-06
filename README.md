# H2 - In React

## Local Setup

Clone the repository locally into your themes directory:
```
git clone --recursive git@github.com:humanmade/H2.git h2
```
(If you forgot `--recursive`, initialize submodules by running `git submodule update --init` from the theme directory.)

Once the checkout is complete, `cd` into the cloned theme directory, install npm modules, and start the development server:
```
npm i
npm start
```

H2 uses [react-wp-scripts](https://github.com/humanmade/react-wp-scripts) to integrate with Webpack's development server. This means that H2 will try to load files from localhost if `SCRIPT_DEBUG` is `true`, and will white-screen if that server is not running. If you see a white screen after activating H2, check to make sure `SCRIPT_DEBUG` is defined (to use the hot-reloading dev server), or run `npm run build` to generate the production-ready static file bundle.

## Create a new Component

1. Create `Component.js` and `Component.scss` to the `src/components` folder.
2. Import the component into React Storybook (`stores/index.js`)
3. Create a Story for the component
4. Run `npm run storybook`

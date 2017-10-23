## WordPress REST API Redux

A helper library for bridging the WordPress REST API (via wordpress-rest-api-oauth-1) with redux based applications.

### What's Included

At it's core, WordPress REST API Redux provides abstracted reducers and action creators for WordPress REST API objects. It's just as easy to manage custom REST API objects (Custom Post Types for example) as the in-built routes (Posts, Pages, Users, Comments, Terms and Taxonomies.)

### Developing locally

For development and testing purposes, you can use a local WordPress install, with the [OAuth 1.0a Server plugin](https://wordpress.org/plugins/rest-api-oauth1/), and register an application under Users > Applications.
Callback value: `http://localhost:3000/` - note the trailing slash
Also, set the permalinks to "Post Name"

When you fire up the app, it should redirect you to your WP install to go through the authorization process.

### How it Works

```
npm install --save wordpress-rest-api-redux
```

```js
import wordpressApi from 'wordpress-rest-api-oauth-1';
import { config as configureWPAPIRedux, reducers as WPAPIReduxReducer, actions as WPAPIReduxActions } from 'wordpress-rest-api-redux';
...other imports

// Configure the library to use your wordpress-rest-api-oauth-1 instance
configureWPAPIRedux({
  api: new wordpressApi({ url: 'https://demo.wp-api.org/' }),
});

// Include the reducer for all the WordPress data.
combineReducers({
  api: WPAPIReduxReducer,
  ...other reducers
});

...create store etc.

export default class App extends Component {
  componentDidMount() {
    this.props.dispatch(WPAPIReduxActions.posts.fetch());
  }
  render() {
    return <ul>
      // Access the data where you defined it in combineReducers
      {Object.entries(this.props.api.posts.byId).map([id,post]) => (
        <li key={post.id}>{post.title.rendered}</li>
      )}
    </ul>
  }
}

```

### Going Further...

#### Custom Objects

While the library ships with the default WordPress objects (Posts, Pages, Users, Comments, Terms and Taxonomies) pre-configured, it's simple to register your own objects when configuring the library:

```js
import { config as configureWPAPIRedux } from 'wordpress-rest-api-redux';

configureWPAPIRedux({
  url: ...,
  objects: {
    // define a custom object and specify it's route in the REST API.
    products: {
      route: '/wc/v1/products'
    }
  }
})
```
#### Windows

One quite common thing to do in your app, and redux is have different "windows" into your WordPress objects. A window could be a search results list, a sidebar widget or an archive of posts. All are posts, potentially sharing the _same_ posts. WordPress REST API Redux stores on master list of objects (such as `store.posts.byId`) and then providers a way to expose different _windows_ into that list of posts. Each window tracks loading activity and it's own `filter` parameters.

```js

```

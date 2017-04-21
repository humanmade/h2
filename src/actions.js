import store from './store';

const fetchPosts = store.actions.posts.fetch;
const fetchCurrentUser = store.actions.user.fetch;

export { fetchPosts, fetchCurrentUser };

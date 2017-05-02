import store from './store';

const fetchPosts = store.actions.posts.fetch;
const fetchCurrentUser = store.actions.user.fetch;
const fetchUsers = store.actions.users.fetch;
const fetchUser = store.actions.user.fetch;

export { fetchPosts, fetchCurrentUser, fetchUsers, fetchUser };

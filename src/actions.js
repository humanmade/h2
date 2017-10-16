import store from './store';

const fetchPosts = store.actions.posts.fetch;
const fetchReplies = store.actions.comments.fetch;
const fetchCurrentUser = store.actions.user.fetch;
const fetchUsers = store.actions.users.fetch;
const fetchUser = store.actions.user.fetch;

export { fetchPosts, fetchReplies, fetchCurrentUser, fetchUsers, fetchUser };

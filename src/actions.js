import store from './store';

const fetchPosts = store.actions.posts.fetch;
const fetchCategories = store.actions.categories.fetch;
const fetchReplies = store.actions.comments.fetch;
const fetchReactions = store.actions.reactions.fetch;
const createReaction = store.actions.reactions.create;
const deleteReaction = store.actions.reactions.delete;
const fetchCurrentUser = store.actions.user.fetch;
const fetchUsers = store.actions.users.fetch;
const fetchUser = store.actions.user.fetch;

export {
	fetchPosts,
	fetchCategories,
	fetchReplies,
	fetchCurrentUser,
	fetchUsers,
	fetchUser,
	fetchReactions,
	createReaction,
	deleteReaction,
};

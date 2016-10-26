import updateObject from './updateObject'

/**
 * Update a post via the api.
 *
 * @param  Object post The post object.
 */
export default function updatePost( post  ) {
	// workaround current issue with embedded objects in requests
	post = {
		...post,
		title: post.title.raw,
		content: post.content.raw,
	}
	return updateObject( post, 'TYPES_POSTS_POST' )
}

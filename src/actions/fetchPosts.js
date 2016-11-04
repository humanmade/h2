import api from '../api'

/**
 * Fetch posts of any type from the api.
 *
 * Specify the `type` property of `args` for the type. This type must exist in the
 * `types` in redux store for the site.
 *
 * @param  object args The arguments for the endpoint.
 */
export default function fetchPosts( args ) {
	// return {
	// 	type: 'POSTS_UPDATED',
	// 	payload: {
	// 		posts: [{"id":470,"date":"2016-09-03T13:54:33","date_gmt":"2016-09-03T13:54:33","guid":{"rendered":"https:\/\/demo.wp-api.org\/2016\/09\/03\/this-is-a-test-post\/"},"modified":"2016-09-03T13:54:33","modified_gmt":"2016-09-03T13:54:33","slug":"this-is-a-test-post","type":"post","link":"https:\/\/demo.wp-api.org\/2016\/09\/03\/this-is-a-test-post\/","title":{"rendered":"This is a test post!"},"content":{"rendered":"<p>This is a test post!<\/p>\n","protected":false},"excerpt":{"rendered":"<p>This is a test post!<\/p>\n","protected":false},"author":135,"featured_media":0,"comment_status":"open","ping_status":"open","sticky":false,"format":"status","meta":{},"categories":[1],"tags":[],"liveblog_likes":0,"_links":{"self":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/posts\/470"}],"collection":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/posts"}],"about":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/types\/post"}],"author":[{"embeddable":true,"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/users\/135"}],"replies":[{"embeddable":true,"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/comments?post=470"}],"version-history":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/posts\/470\/revisions"}],"wp:attachment":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/media?parent=470"}],"wp:term":[{"taxonomy":"category","embeddable":true,"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/categories?post=470"},{"taxonomy":"post_tag","embeddable":true,"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/tags?post=470"}],"curies":[{"name":"wp","href":"https:\/\/api.w.org\/{rel}","templated":true}]},"_embedded":{"author":[{"id":135,"name":"xxxxx","url":"","description":"","link":"https:\/\/demo.wp-api.org\/author\/xxxxx\/","slug":"xxxxx","avatar_urls":{"24":"https:\/\/secure.gravatar.com\/avatar\/a2e1f0c1b55cba041ad89ef714d525b2?s=24&d=mm&r=g","48":"https:\/\/secure.gravatar.com\/avatar\/a2e1f0c1b55cba041ad89ef714d525b2?s=48&d=mm&r=g","96":"https:\/\/secure.gravatar.com\/avatar\/a2e1f0c1b55cba041ad89ef714d525b2?s=96&d=mm&r=g"},"_links":{"self":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/users\/135"}],"collection":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/users"}]}}],"wp:term":[[{"id":1,"link":"https:\/\/demo.wp-api.org\/category\/uncategorized\/","name":"Uncategorized","slug":"uncategorized","taxonomy":"category","_links":{"self":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/categories\/1"}],"collection":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/categories"}],"about":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/taxonomies\/category"}],"wp:post_type":[{"href":"https:\/\/demo.wp-api.org\/wp-json\/wp\/v2\/posts?categories=1"}],"curies":[{"name":"wp","href":"https:\/\/api.w.org\/{rel}","templated":true}]}}],[]]}}]
	// 	}
	// }
	// return
	args = { ...args, _embed: true }
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'POSTS_UPDATING',
		})
		return api.get( '/wp/v2/posts', args )
			.then( posts => {
				dispatch({
					type: 'POSTS_UPDATED',
					payload: {
						posts
					}
				})
				return posts
			})
	}
}

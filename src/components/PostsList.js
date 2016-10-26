import React from 'react'
import Post from './Post'
import { values } from 'lodash'

export default function( { posts } ) {
	posts = values( posts )
	return <div>
		<ul className="postlist">
			{posts.map( post => {
				return <Post key={post.id} post={post} />
			})}
			{posts.length === 0 ?
				<li className="no-posts">
					<h3>No posts yet!</h3>
				</li>
			: null }
		</ul>
	</div>
}

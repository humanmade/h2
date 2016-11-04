import React from 'react'
import { Link } from 'react-router'

export default function( { user } ) {
	return <Link to={`/author/${user.slug}/`} title={user.name} className="message-thumb">
		<img alt={user.name} className="avatar" src={user.avatar_urls[48]} />
	</Link>
}

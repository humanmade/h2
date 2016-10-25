import React from 'react'

export default function( { user } ) {
	return <img alt={user.name} className="avatar message-thumb" src={user.avatar_urls[48]} />
}

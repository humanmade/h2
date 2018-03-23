import React from 'react';

import Avatar from './Avatar';
import Button from './Button';
import Map from './Map';
import RelativeLink from './RelativeLink';
import { withApiData } from '../with-api-data';

import './Profile.css';

function Profile( props ) {
	if ( props.user.isLoading ) {
		return <aside className="Profile">
			<p>Loading…</p>
		</aside>;
	}

	const user = props.user.data;
	if ( ! user ) {
		return <aside className="Profile">
			<Button onClick={ props.onClose }>
				Close
			</Button>

			<p>Could not find details for user</p>
		</aside>;
	}

	return <aside className="Profile">
		<header className="Profile-closer">
			<h2>Profile</h2>
			<Button onClick={ props.onClose }>
				Close
			</Button>
		</header>
		<header>
			<div>
				<Avatar
					url={ user.avatar_urls[96] }
					user={ user }
					size={ 60 }
				/>
			</div>
			<div>
				<h2>{ user.name }</h2>
				<p>@{ user.slug }</p>
				<p className={ user.facts.job_title ? 'Profile-title' : 'Profile-title missing' }>
					{ user.facts.job_title || 'Unknown Role' }
				</p>
			</div>
		</header>

		<Map
			height="200"
			location={ user.facts.location }
			width="300"
			zoom="2.0"
		/>

		<p><RelativeLink to={ user.link }>View all posts →</RelativeLink></p>

		<div className="Profile-description">
			{ user.facts.long_description.split( '\n' ).map( ( text, idx ) =>
				<p key={ idx }>{ text }</p>
			) }
		</div>
	</aside>;
}

export default withApiData( props => ( { user: `/wp/v2/users/${ props.id }` } ) )( Profile );

import React from 'react';

import Avatar from './Avatar';

import './UserBlock.css';

export default function UserBlock( props ) {
	const { user } = props;

	return (
		<div className="UserBlock">
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
				{ user.facts && (
					<p className={ user.facts.job_title ? 'UserBlock-title' : 'UserBlock-title missing' }>
						{ user.facts.job_title || 'Unknown Role' }
					</p>
				) }
			</div>
		</div>
	);
}

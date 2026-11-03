import React from 'react';

import Avatar from './Avatar';

export default function UserBlock( props ) {
	const { user } = props;

	return (
		<div className="flex items-center gap-3 mb-5 min-w-0">
			<Avatar
				className="shrink-0"
				url={ user.avatar_urls[96] }
				user={ user }
				size={ 48 }
			/>
			<div className="min-w-0">
				<h2 className="text-lg leading-6 font-semibold normal-case m-0 break-words">{ user.name }</h2>
				<p className="text-xs leading-5 text-gray-500 m-0 break-words">@{ user.slug }</p>
				{ user.facts && user.facts.job_title && <p className="text-sm leading-5 text-gray-600 mt-1 mb-0">{ user.facts.job_title }</p> }
			</div>
		</div>
	);
}

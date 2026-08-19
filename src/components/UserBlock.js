import React from 'react';

import Avatar from './Avatar';

export default function UserBlock( props ) {
	const { user } = props;

	return (
		<div className="flex items-center mx-[-1em] mb-[1em] pt-[0.2em] px-[1em] overflow-hidden [&_h2]:normal-case [&_h2]:text-base [&_h2]:leading-[1.4] [&_h2]:m-0 [&_p]:m-0">
			<div>
				<Avatar
					className="mr-[0.5em]"
					url={ user.avatar_urls[96] }
					user={ user }
					size={ 60 }
				/>
			</div>
			<div>
				<h2>{ user.name }</h2>
				<p>@{ user.slug }</p>
				{ user.facts && (
					<p className={ user.facts.job_title ? 'text-hm-medium-grey' : 'text-hm-medium-grey italic' }>
						{ user.facts.job_title || 'Unknown Role' }
					</p>
				) }
			</div>
		</div>
	);
}

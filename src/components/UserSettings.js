import React from 'react';

import { withCurrentUser } from '../hocs';

const viewOptions = [
	{
		value: 'compact',
		label: 'Post excerpts',
	},
	{
		value: 'nocomments',
		label: 'Full posts',
	},
	{
		value: 'full',
		label: 'Posts with comments',
	},
];

export const UserSettings = ( { currentUser, onUpdateCurrentUser } ) => {
	if ( ! currentUser ) {
		return null;
	}

	const viewPreference = currentUser.meta.h2_view_preference;

	const updateViewPreference = event => {
		const value = event.target.value;
		onUpdateCurrentUser( {
			meta: {
				h2_view_preference: value,
			},
		} );
	};

	return (
		<div className="UserSettings">
			<h3>Settings</h3>
			<label>I prefer archive pages to display
				<select value={ viewPreference } onChange={ updateViewPreference }>
					{ viewOptions.map( ( { value, label } ) => (
						<option
							key={ value }
							value={ value }
						>
							{ label }
						</option>
					) ) }
				</select>
			</label>
		</div>
	);
};

export default withCurrentUser( UserSettings );

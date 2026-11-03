import React, { PureComponent } from 'react';

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

export class UserSettings extends PureComponent {
	onUpdateViewPreference = event => {
		const value = event.target.value;
		this.props.onUpdateCurrentUser( {
			meta: {
				h2_view_preference: value,
			},
		} );
	}

	render() {
		const { currentUser } = this.props;

		if ( ! currentUser ) {
			return null;
		}

		const viewPreference = currentUser.meta.h2_view_preference || 'full';

		return (
			<div className="UserSettings">
				<label
					className="block mb-1 text-xs font-medium text-gray-500"
					htmlFor="h2-view-preference"
				>
					Archive pages show
				</label>
				<select
					className="block w-full m-0 px-2 py-1.5 border border-[#dfe1e5] rounded-md bg-white text-sm text-hm-dark-grey"
					id="h2-view-preference"
					value={ viewPreference }
					onChange={ this.onUpdateViewPreference }
				>
					{ viewOptions.map( ( { value, label } ) => (
						<option
							key={ value }
							value={ value }
						>
							{ label }
						</option>
					) ) }
				</select>
			</div>
		);
	}
}

export default withCurrentUser( UserSettings );

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
				<h3>Settings</h3>
				<label>
					I prefer archive pages to display
					<select
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
				</label>
			</div>
		);
	}
}

export default withCurrentUser( UserSettings );

import { withSingle } from '@humanmade/repress';
import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import Map from './Map';
import RelativeLink from './RelativeLink';
import UserBlock from './UserBlock';
import Container from './Sidebar/Container';
import { users } from '../types';

import './Profile.css';

const Field = props => (
	<p className="Profile-field">
		<strong>{ props.name }:</strong>
		<span className={ props.missing ? 'missing' : null }>{ props.children }</span>
	</p>
);

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone;
	if ( ! timeZone ) {
		const profileUrl = `${ window.H2Data.site.url }/wp-admin/profile.php?user_id=${ props.user.id }`;
		return (
			<Field
				name="Local time"
				missing
			>
				Unknown timezone,
				set in <a href={ profileUrl }>your profile</a>
			</Field>
		);
	}

	const now = new Date();
	return (
		<React.Fragment>
			<Field name="Local time">
				<FormattedTime
					value={ now }
					timeZone={ timeZone }
				/>

				{ ', '}

				<FormattedDate
					day="numeric"
					month="long"
					value={ now }
					timeZone={ timeZone }
				/>
			</Field>
			<Field name="Timezone">
				{ timeZone }
			</Field>
		</React.Fragment>
	);
}

class Profile extends React.Component {
	render() {
		const containerProps = {
			className: 'Profile',
			title: 'Profile',
			onClose: this.props.onClose,
		};

		if ( this.props.loading ) {
			return (
				<Container { ...containerProps }>
					<p>Loading…</p>
				</Container>
			);
		}

		const user = this.props.user;
		if ( ! user ) {
			return (
				<Container { ...containerProps }>
					<p>Could not find details for user</p>
				</Container>
			);
		}

		return (
			<Container { ...containerProps }>
				<UserBlock user={ user } />

				<Map
					height="200"
					location={ user.facts.location }
					width="300"
					zoom="2.0"
				/>

				<p><RelativeLink to={ user.link }>View all posts →</RelativeLink></p>

				<div className="Profile-fields">
					<LocalTime user={ user } />
				</div>

				<div className="Profile-description">
					{ user.facts.long_description.split( '\n' ).map( ( text, idx ) =>
						<p key={ idx }>{ text }</p>
					) }
				</div>
			</Container>
		);
	}
}

export default withSingle(
	users,
	state => state.users,
	props => props.id,
	{
		mapDataToProps: data => ( {
			loading: data.loading,
			user: data.post,
		} ),
	}
)( Profile );

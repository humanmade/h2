import { withSingle } from '@humanmade/repress';
import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import Avatar from './Avatar';
import Button from './Button';
import Map from './Map';
import RelativeLink from './RelativeLink';
import { users } from '../types';

import './Profile.css';

const Field = props => <p className="Profile-field">
	<strong>{ props.name }:</strong>
	<span className={ props.missing ? 'missing' : null }>{ props.children }</span>
</p>;

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone;
	if ( ! timeZone ) {
		const profileUrl = `${ window.H2Data.site.url }/wp-admin/profile.php?user_id=${ props.user.id }`;
		return <Field
			name="Local time"
			missing
		>
			Unknown timezone,
			set in <a href={ profileUrl }>your profile</a>
		</Field>;
	}

	const now = new Date();
	return <React.Fragment>
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
	</React.Fragment>;
}

function Profile( props ) {
	const { loading, user } = props;
	if ( loading ) {
		return <aside className="Profile">
			<p>Loading…</p>
		</aside>;
	}

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

		<div className="Profile-fields">
			<LocalTime user={ user } />
		</div>

		<div className="Profile-description">
			{ user.facts.long_description.split( '\n' ).map( ( text, idx ) =>
				<p key={ idx }>{ text }</p>
			) }
		</div>
	</aside>;
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

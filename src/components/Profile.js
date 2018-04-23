import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import Avatar from './Avatar';
import Button from './Button';
import Map from './Map';
import RelativeLink from './RelativeLink';
import Container from './Sidebar/Container';
import { withApiData } from '../with-api-data';

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

class Profile extends React.Component {
	render() {
		if ( this.props.user.isLoading ) {
			return <aside className="Profile">
				<p>Loading…</p>
			</aside>;
		}

		const user = this.props.user.data;
		if ( ! user ) {
			return <aside className="Profile">
				<Button onClick={ this.props.onClose }>
					Close
				</Button>

				<p>Could not find details for user</p>
			</aside>;
		}

		return (
			<Container
				className="Profile"
				title="Profile"
				onClose={ this.props.onClose }
			>

				<header className="Profile-header">
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
			</Container>
		);
	}
}

export default withApiData( props => ( { user: `/wp/v2/users/${ props.id }` } ) )( Profile );

import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { connect } from 'react-redux';

import { showSidebarComments } from '../actions';
import { withUser } from '../hocs';

import Link from './Link';
import Map from './Map';
import Container from './Sidebar/Container';
import UserBlock from './UserBlock';

const Field = props => (
	<div className="mb-4 last:mb-0">
		<dt className="text-xs font-semibold text-gray-500 mb-1">{ props.name }</dt>
		<dd className={ `m-0 text-sm leading-6 break-words ${ props.missing ? 'text-gray-500' : 'text-hm-dark-grey' }` }>{ props.children }</dd>
	</div>
);

const NAV_CLASSES = 'flex items-center justify-between w-full px-6 py-2.5 text-sm leading-5 text-hm-dark-grey! bg-transparent border-0 text-left cursor-pointer hover:bg-hm-beige/40 hover:no-underline! focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-hm-vibrant-blue';

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone || ( props.user.facts && props.user.facts.timezone );
	if ( ! timeZone ) {
		const profileUrl = `${ window.H2Data.site.url }/wp-admin/profile.php?user_id=${ props.user.id }`;
		return (
			<Field
				name="Local time"
				missing
			>
				Timezone not set. <a className="underline underline-offset-2" href={ profileUrl }>Set timezone</a>
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

				{ ', ' }

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
};

export class Profile extends React.Component {
	render() {
		const containerProps = {
			title: 'Profile',
			onClose: this.props.onClose,
		};

		if ( this.props.loadingUser ) {
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

				{ user.facts && user.facts.location && window.H2Data.site.mapbox_key && (
					<Map
						height="200"
						location={ user.facts.location }
						width="300"
						zoom="2.0"
					/>
				) }

				<ul className="Profile-navigation list-none my-5 -mx-6 p-0 border-y border-hm-beige divide-y divide-hm-beige">
					<li>
						<Link className={ NAV_CLASSES } href={ user.link }>
							<span>View all posts</span><span aria-hidden="true">→</span>
						</Link>
					</li>
					<li>
						<button className={ NAV_CLASSES } type="button" onClick={ () => this.props.onViewComments( user.id ) }>
							<span>View all comments</span><span aria-hidden="true">→</span>
						</button>
					</li>
				</ul>

				<dl className="m-0">
					<LocalTime user={ user } />
					{ user.facts && user.facts.location_name && <Field name="Location">{ user.facts.location_name }</Field> }
					{ user.facts && user.facts.pronouns && <Field name="Pronouns">{ user.facts.pronouns }</Field> }
				</dl>

				{ user.facts && user.facts.long_description && (
					<div className="Profile-description mt-5 pt-4 border-t border-hm-beige text-sm leading-6 text-gray-600">
						{ user.facts.long_description.split( '\n' ).filter( text => text.trim() ).map( ( text, idx ) =>
							<p className="m-0 mb-3 last:mb-0" key={ idx }>{ text }</p>
						) }
					</div>
				) }
			</Container>
		);
	}
}

const ConnectedProfile = withUser( props => props.id )( Profile );

const mapStateToProps = () => ( {} );

const mapDispatchToProps = dispatch => {
	return {
		onViewComments: id => dispatch( showSidebarComments( id ) ),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	ConnectedProfile
);

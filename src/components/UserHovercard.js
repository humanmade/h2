import PropTypes from 'prop-types';
import React from 'react';
import { FormattedTime } from 'react-intl';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import Map from './Map';

const ASIDE_CLASSES = [
	'flex text-[0.77778rem] items-center',
	'[&_.Avatar]:grow-0 [&_.Avatar]:shrink-0 [&_.Avatar]:mr-[0.5em]',
	'[&_.Map]:m-0 [&_.Map]:ml-[10px]',
	'max-[475px]:flex-col max-[475px]:items-start',
	'max-[475px]:[&_.Map]:mx-auto max-[475px]:[&_.Map]:mt-[1em] max-[475px]:[&_.Map]:ml-auto',
].join( ' ' );

const DESCRIPTION_CLASSES = [
	'text-[0.9em] leading-[1.7]',
	'[&_p]:m-0 [&_p]:mb-[1em] [&_p:last-child]:mb-0',
].join( ' ' );

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone;
	if ( ! timeZone ) {
		return (
			<p className="m-0">
				<strong>Local time:</strong>
				{ ' ' }
				<span className="italic">Unknown timezone</span>
			</p>
		);
	}

	const now = new Date();
	return (
		<p className="m-0">
			<strong>Local time:</strong>

			{ ' ' }

			<FormattedTime
				value={ now }
				timeZone={ timeZone }
				timeZoneName="short"
			/>
		</p>
	);
};

export function UserCard( { user } ) {
	const titleClasses = user.facts.job_title
		? 'text-hm-medium-grey'
		: 'text-hm-medium-grey italic';

	return (
		<aside className={ ASIDE_CLASSES }>
			<div>
				<header className="flex items-center m-0 mb-[1em] [&_p]:leading-[1.6] [&_p]:m-0">
					<Avatar
						url={ user.avatar_urls['96'] }
						size={ 40 }
						withHovercard={ false }
					/>
					<div>
						<h3 className="text-[1em] leading-[1.6] normal-case m-0">
							{ user.name }
						</h3>
						<p className="text-hm-medium-grey text-[0.9em] font-normal">
							@{ user.slug }
						</p>
						<p className={ titleClasses }>
							{ user.facts.job_title || 'Unknown Role' }
						</p>
					</div>
				</header>

				<div className={ DESCRIPTION_CLASSES }>
					<LocalTime user={ user } />
					<p>{ user.facts.short_bio }</p>
				</div>
			</div>
			<Map
				height="150"
				location={ user.facts.location }
				width="150"
			/>
		</aside>
	);
}

export default class UserHovercard extends React.Component {
	render() {
		const { children, user } = this.props;

		if ( ! user.facts || ! window.H2Data.site.mapbox_key ) {
			return children;
		}

		return (
			<Hovercard
				cardContent={ () => <UserCard user={ user } /> }
			>
				{ children }
			</Hovercard>
		);
	}
}

UserHovercard.propTypes = {
	user: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

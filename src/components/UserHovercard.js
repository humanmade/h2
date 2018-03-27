import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import Map from './Map';

import './UserHovercard.css';

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone;
	if ( ! timeZone ) {
		return <p className="UserHovercard-local-time missing">
			<strong>Local time:</strong>
			{ ' ' }
			<span>Unknown timezone</span>
		</p>;
	}

	const now = new Date();
	return <p className="UserHovercard-local-time">
		<strong>Local time:</strong>

		{ ' ' }

		<FormattedTime
			value={ now }
			timeZone={ timeZone }
		/>
	</p>;
}

export default class UserHovercard extends React.Component {
	renderCard() {
		const { user } = this.props;

		return <aside className="UserHovercard">
			<div className="UserHovercard-details">
				<header>
					<Avatar
						url={ user.avatar_urls['96'] }
						size={ 40 }
						withHovercard={ false }
					/>
					<div>
						<h3>{ user.name }</h3>
						<p className="UserHovercard-slug">@{ user.slug }</p>
						<p className={ user.facts.job_title ? 'UserHovercard-title' : 'UserHovercard-title missing' }>
							{ user.facts.job_title || 'Unknown Role' }
						</p>
					</div>
				</header>

				<div className="UserHovercard-description">
					<LocalTime user={ user } />
					<p>{ user.facts.short_bio }</p>
				</div>
			</div>
			<Map
				height="150"
				location={ user.facts.location }
				width="150"
			/>
		</aside>;
	}

	render() {
		const { children, user } = this.props;

		if ( ! user.facts || ! window.H2Data.site.mapbox_key ) {
			return children;
		}

		return <Hovercard
			cardContent={ () => this.renderCard() }
			width={ 425 }
		>
			{ children }
		</Hovercard>;
	}
}

UserHovercard.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

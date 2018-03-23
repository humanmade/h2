import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import Map from './Map';

import './UserHovercard.css';

const MAPBOX_BASE = 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/static';

export default class UserHovercard extends React.Component {
	renderCard() {
		const { user } = this.props;

		const location = user.facts.location;

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

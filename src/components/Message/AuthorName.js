import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '../Avatar';
import Hovercard from '../Hovercard';
import RelativeLink from '../RelativeLink';

import './AuthorName.css';

const MAPBOX_BASE = 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/static';

export default class AuthorName extends React.Component {
	renderCard() {
		const { user } = this.props;

		const location = user.facts.location;
		const args = `access_token=${ window.H2Data.site.mapbox_key }`;
		const mapUrl = `${ MAPBOX_BASE }/pin-s-marker+7DC9DA(${ location })/${ location },1.0,0,0/150x150@2x?${ args }`;

		return <aside className="AuthorName-Card">
			<div className="AuthorName-Card-details">
				<header>
					<Avatar
						url={ user.avatar_urls['96'] }
						size={ 40 }
					/>
					<div>
						<h3>{ user.name }</h3>
						<p className="AuthorName-Card-slug">@{ user.slug }</p>
						<p className={ user.facts.job_title ? "AuthorName-Card-title" : "AuthorName-Card-title missing" }>
							{ user.facts.job_title || "Unknown Role" }
						</p>
					</div>
				</header>

				<div className="AuthorName-Card-description">
					<p>{ user.facts.short_bio }</p>
				</div>
			</div>
				<img
					className="AuthorName-Card-map"
					src={ mapUrl }
				/>
		</aside>;
	}

	render() {
		const { user } = this.props;

		if ( ! user.facts || ! window.H2Data.site.mapbox_key ) {
			return <span className="author-name">
				<RelativeLink to={ user.link }>{ user.name }</RelativeLink>
			</span>;
		}

		return <Hovercard
			key={ user.id }
			cardContent={ () => this.renderCard() }
			width={ 425 }
		>
			<span className="author-name">
				<RelativeLink to={ user.link }>{ user.name }</RelativeLink>
			</span>
		</Hovercard>;
	}
}

AuthorName.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

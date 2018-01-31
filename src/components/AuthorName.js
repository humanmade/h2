import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import RelativeLink from './RelativeLink';

import './AuthorName.css';

export default class AuthorName extends React.Component {
	renderCard() {
		const { user } = this.props;

		return <aside className="AuthorName-Card">
			<Avatar
				url={ user.avatar_urls['96'] }
				size={ 40 }
			/>
			<div className="AuthorName-Card-details">
				<h1>{ user.name }</h1>
				<div className="AuthorName-Card-description">
					{ user.description }
				</div>
			</div>
		</aside>;
	}

	render() {
		const { user } = this.props;
		return <Hovercard
			key={ user.id }
			cardContent={ () => this.renderCard() }
			width={ 500 }
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

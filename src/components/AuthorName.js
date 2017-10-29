import PropTypes from 'prop-types';
import React from 'react';

export default class AuthorName extends React.Component {
	render() {
		const { user } = this.props;
		return <span className="author-name">
			{ user.name }
		</span>;
	}
}

AuthorName.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

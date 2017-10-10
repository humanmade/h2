import PropTypes from 'prop-types';
import React from 'react';

import './SearchInput.css';

export default function Post( props ) {
	return (
		<form
			className="SearchInput"
			onSubmit={e => {
				e.preventDefault();
				props.onSearch(e.target.querySelector('input').value);
			}}
		>
			<input type="search" placeholder="Search..." />
		</form>
	);
}

Post.propTypes = {
	onSearch: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

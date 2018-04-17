import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import './SearchInput.css';

class SearchInput extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { value: null };
	}

	// eslint-disable-next-line no-undef
	onSubmit = e => {
		e.preventDefault();
		this.props.onSearch( this.state.value );
		this.setState( { value: null } );
	}

	render() {
		const termFromURL = this.props.location.pathname.match( /\/search\/(.+)/ );
		const term = this.state.value || ( termFromURL && termFromURL[1] ) || '';

		return <form
			className="SearchInput"
			onSubmit={ this.onSubmit }
		>
			<input
				type="search"
				placeholder="Search..."
				value={ term }
				onChange={ e => this.setState( { value: e.target.value } ) }
			/>
		</form>;
	}
}

SearchInput.propTypes = { onSearch: PropTypes.func.isRequired };

export default withRouter( SearchInput );

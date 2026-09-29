import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setSuperSearch } from '../../actions';
import { FORM_CLASSES, getWrapClasses, INPUT_CLASSES } from '../SearchInput';

import { getNetwork } from './util';

/**
 * Search input for network-wide search.
 *
 * Replaces the regular site search while the super overlay is open. The term
 * is held in the store so that the header and overlay inputs stay in sync.
 *
 * @param {object} props Current value and change callback.
 * @returns {React.ReactNode} Search form.
 */
export function NetworkSearchInput( props ) {
	const { autoFocus, className, small, value, onChange } = props;
	const network = getNetwork();

	return (
		<form
			className={ [ FORM_CLASSES, 'SearchInput--network', className ].filter( Boolean ).join( ' ' ) }
			role="search"
			onSubmit={ e => e.preventDefault() }
		>
			<div className={ getWrapClasses( small ) }>
				<input
					aria-label={ network ? `Search ${ network.name }` : 'Search all sites' }
					autoFocus={ autoFocus }
					className={ INPUT_CLASSES }
					placeholder={ network ? `Search across ${ network.name }…` : 'Search all sites…' }
					type="search"
					value={ value }
					onChange={ e => onChange( e.target.value ) }
				/>
			</div>
		</form>
	);
}

NetworkSearchInput.propTypes = {
	autoFocus: PropTypes.bool,
	className: PropTypes.string,
	small: PropTypes.bool,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

NetworkSearchInput.defaultProps = {
	autoFocus: false,
	small: false,
};

export default connect(
	state => ( {
		value: state.ui.superSearch,
	} ),
	dispatch => ( {
		onChange: value => dispatch( setSuperSearch( value ) ),
	} )
)( NetworkSearchInput );

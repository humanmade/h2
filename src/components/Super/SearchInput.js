import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setSuperSearch, showSuperSidebar } from '../../actions';

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
	const { autoFocus, className, small, value, siteScoped, onChange } = props;
	const network = getNetwork();

	return (
		<form
			className={ [ 'SearchInput flex-1 relative self-stretch', 'SearchInput--network', className ].filter( Boolean ).join( ' ' ) }
			role="search"
			onSubmit={ e => e.preventDefault() }
		>
			<div className={ `flex items-center h-full relative z-11 ${ small ? '' : 'px-5' }` }>
				<input
					aria-label={ siteScoped ? 'Search this site' : network ? `Search ${ network.name }` : 'Search all sites' }
					autoFocus={ autoFocus }
					className="w-full text-lg border-2 border-hm-border-color rounded-sm px-2 py-1 md:py-2 md:leading-5 placeholder:italic bg-white"
					placeholder={ siteScoped ? 'Search this site…' : network ? `Search across ${ network.name }…` : 'Search all sites…' }
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
	siteScoped: PropTypes.bool,
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
		siteScoped: ! state.ui.showingSuper || ( state.ui.superSearchSites || [] ).length > 0,
		showingSuper: state.ui.showingSuper,
	} ),
	dispatch => ( {
		onChange: value => dispatch( setSuperSearch( value ) ),
		openSiteSearch: () => dispatch( showSuperSidebar( [ window.H2Data.site.id ] ) ),
	} ),
	( state, dispatch, props ) => ( {
		...props,
		...state,
		onChange: value => {
			if ( ! state.showingSuper && value.trim() ) {
				dispatch.openSiteSearch();
			}
			dispatch.onChange( value );
		},
	} )
)( NetworkSearchInput );

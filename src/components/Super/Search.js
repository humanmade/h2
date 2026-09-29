import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Component } from 'react';

import api from '../../api';
import { withSites } from '../../hocs';

import Facets, { PERIODS } from './Facets';
import Results from './Results';

/**
 * Delay before searching after the term changes, in milliseconds.
 */
const DEBOUNCE = 250;

export const PER_PAGE = 10;

/**
 * Build the query parameters for a search.
 *
 * @param {object} options Search options.
 * @returns {object} Parameters for the `h2/v1/search` endpoint.
 */
export function buildQuery( options ) {
	const { orderby, page, period, selectedSites, term, type } = options;
	const params = {
		search: term,
		page,
		per_page: PER_PAGE,
	};

	if ( selectedSites.length ) {
		params.sites = selectedSites;
	}
	if ( type !== 'all' ) {
		params.type = [ type ];
	}
	if ( orderby === 'date' ) {
		params.orderby = 'date';
		params.order = 'desc';
	}

	const periodOption = PERIODS.find( option => option.value === period );
	if ( periodOption && periodOption.days ) {
		const after = new Date( Date.now() - periodOption.days * 24 * 60 * 60 * 1000 );
		params.after = after.toISOString().replace( /\.\d{3}Z$/, 'Z' );
	}

	return params;
}

/**
 * Get a string identifying the query represented by the search state.
 *
 * Unlike buildQuery(), this is stable over time, so can be used to detect
 * changes to the query.
 *
 * @param {object} state Search state.
 * @returns {string} Query signature.
 */
function getSignature( state ) {
	const { orderby, page, period, selectedSites, term, type } = state;
	return qs.stringify( {
		term,
		page,
		sites: selectedSites,
		type,
		period,
		orderby,
	} );
}

/**
 * Run a network search.
 *
 * @param {object} params Query parameters, from buildQuery().
 * @param {object} options Additional fetch options (e.g. `signal`).
 * @returns {Promise<object>} Results, with `results`, `total` and `totalPages`.
 */
export function fetchResults( params, options = {} ) {
	const query = qs.stringify( params, {
		arrayFormat: 'brackets',
	} );

	return api.fetch( `/h2/v1/search?${ query }`, options ).then( response => {
		return response.json().catch( () => {
			throw new Error( 'The search request failed.' );
		} ).then( data => {
			if ( ! response.ok ) {
				const error = new Error( data.message || 'The search request failed.' );
				error.code = data.code;
				throw error;
			}

			return {
				results: data,
				total: Number( response.headers.get( 'X-WP-Total' ) ) || 0,
				totalPages: Number( response.headers.get( 'X-WP-TotalPages' ) ) || 0,
			};
		} );
	} );
}

/**
 * Presentational layout for search: facets on the left, results on the right.
 *
 * @param {object} props Search state and change callbacks; see Search.
 * @returns {React.ReactNode} Search layout.
 */
export function SearchView( props ) {
	const { orderby, period, selectedSites, sites, type } = props;

	return (
		<div className="Super-search grid grid-cols-1 gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
			<Facets
				orderby={ orderby }
				period={ period }
				selectedSites={ selectedSites }
				sites={ sites }
				type={ type }
				onChangeOrderby={ props.onChangeOrderby }
				onChangePeriod={ props.onChangePeriod }
				onChangeSites={ props.onChangeSites }
				onChangeType={ props.onChangeType }
			/>
			<Results
				error={ props.error }
				loading={ props.loading }
				page={ props.page }
				results={ props.results }
				term={ props.term }
				total={ props.total }
				totalPages={ props.totalPages }
				onChangePage={ props.onChangePage }
			/>
		</div>
	);
}

SearchView.propTypes = {
	error: PropTypes.object,
	loading: PropTypes.bool.isRequired,
	orderby: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	period: PropTypes.string.isRequired,
	results: PropTypes.array,
	selectedSites: PropTypes.arrayOf( PropTypes.number ).isRequired,
	sites: PropTypes.object.isRequired,
	term: PropTypes.string.isRequired,
	total: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	onChangeOrderby: PropTypes.func.isRequired,
	onChangePage: PropTypes.func.isRequired,
	onChangePeriod: PropTypes.func.isRequired,
	onChangeSites: PropTypes.func.isRequired,
	onChangeType: PropTypes.func.isRequired,
};

/**
 * Network-wide search.
 *
 * Searches every site the user can access via the H2 Network plugin. The term
 * from the input is debounced into state, and every change to the query
 * (term, filters, page) triggers a fresh request, cancelling any in flight.
 */
export class Search extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			error: null,
			loading: true,
			orderby: 'relevance',
			page: 1,
			period: 'any',
			results: null,
			selectedSites: [],
			term: props.term,
			total: 0,
			totalPages: 0,
			type: 'all',
		};
	}

	componentDidMount() {
		this.load();
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevProps.term !== this.props.term ) {
			// Wait for a pause in typing before searching.
			window.clearTimeout( this.timer );
			this.timer = window.setTimeout( () => {
				this.setState( {
					page: 1,
					term: this.props.term,
				} );
			}, DEBOUNCE );
		}

		if ( getSignature( this.state ) !== getSignature( prevState ) ) {
			this.load();
		}
	}

	componentWillUnmount() {
		window.clearTimeout( this.timer );
		this.abort();
	}

	abort() {
		if ( this.controller ) {
			this.controller.abort();
			this.controller = null;
		}
	}

	load() {
		this.abort();

		const options = {};
		if ( typeof AbortController !== 'undefined' ) {
			this.controller = new AbortController();
			options.signal = this.controller.signal;
		}
		const controller = this.controller;

		this.setState( {
			error: null,
			loading: true,
		} );

		fetchResults( buildQuery( this.state ), options ).then( data => {
			if ( controller && controller !== this.controller ) {
				// Superseded by a newer request.
				return;
			}

			this.setState( {
				loading: false,
				results: data.results,
				total: data.total,
				totalPages: data.totalPages,
			} );
		} ).catch( error => {
			if ( error.name === 'AbortError' || ( controller && controller !== this.controller ) ) {
				return;
			}

			this.setState( {
				error,
				loading: false,
				results: null,
				total: 0,
				totalPages: 0,
			} );
		} );
	}

	/**
	 * Change a filter, returning to the first page of results.
	 *
	 * @param {object} changes State changes.
	 */
	onChangeFilter( changes ) {
		this.setState( {
			...changes,
			page: 1,
		} );
	}

	render() {
		return (
			<SearchView
				error={ this.state.error }
				loading={ this.state.loading }
				orderby={ this.state.orderby }
				page={ this.state.page }
				period={ this.state.period }
				results={ this.state.results }
				selectedSites={ this.state.selectedSites }
				sites={ this.props.sites }
				term={ this.state.term }
				total={ this.state.total }
				totalPages={ this.state.totalPages }
				type={ this.state.type }
				onChangeOrderby={ orderby => this.onChangeFilter( { orderby } ) }
				onChangePage={ page => this.setState( { page } ) }
				onChangePeriod={ period => this.onChangeFilter( { period } ) }
				onChangeSites={ selectedSites => this.onChangeFilter( { selectedSites } ) }
				onChangeType={ type => this.onChangeFilter( { type } ) }
			/>
		);
	}
}

Search.propTypes = {
	sites: PropTypes.object.isRequired,
	term: PropTypes.string.isRequired,
};

export default withSites( Search );

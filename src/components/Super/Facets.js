import PropTypes from 'prop-types';
import React from 'react';

import { isCurrentSite } from './util';

export const TYPES = [
	{
		value: 'all',
		label: 'Posts and comments',
	},
	{
		value: 'post',
		label: 'Posts only',
	},
	{
		value: 'comment',
		label: 'Comments only',
	},
];

export const ORDERS = [
	{
		value: 'relevance',
		label: 'Most relevant',
	},
	{
		value: 'date',
		label: 'Newest first',
	},
];

export const PERIODS = [
	{
		value: 'any',
		label: 'Any time',
	},
	{
		value: 'week',
		label: 'Past week',
		days: 7,
	},
	{
		value: 'month',
		label: 'Past month',
		days: 30,
	},
	{
		value: 'year',
		label: 'Past year',
		days: 365,
	},
];

const LABEL_CLASSES = 'flex items-center gap-2 cursor-pointer py-0.5 hover:text-hm-vibrant-blue';
const CONTROL_CLASSES = 'm-0 shrink-0 size-4 cursor-pointer accent-hm-vibrant-blue';

function Facet( props ) {
	return (
		<fieldset className="m-0 mb-6 p-0 border-none min-w-0">
			<legend className="mb-2 text-xs uppercase tracking-wide font-semibold text-hm-warm-grey">
				{ props.title }
			</legend>
			{ props.children }
		</fieldset>
	);
}

function RadioFacet( props ) {
	const { name, options, title, value, onChange } = props;

	return (
		<Facet title={ title }>
			<ul className="list-none m-0 p-0">
				{ options.map( option => (
					<li key={ option.value } className="m-0 p-0">
						<label className={ LABEL_CLASSES }>
							<input
								checked={ value === option.value }
								className={ CONTROL_CLASSES }
								name={ name }
								type="radio"
								value={ option.value }
								onChange={ () => onChange( option.value ) }
							/>
							<span>{ option.label }</span>
						</label>
					</li>
				) ) }
			</ul>
		</Facet>
	);
}

/**
 * Filters for network search.
 *
 * An empty `selectedSites` list means every site.
 *
 * @param {object} props Current filter values, available sites, and change callbacks.
 * @returns {React.ReactNode} Filter controls.
 */
export default function Facets( props ) {
	const { orderby, period, selectedSites, sites, type } = props;

	const toggleSite = id => {
		if ( selectedSites.includes( id ) ) {
			props.onChangeSites( selectedSites.filter( selected => selected !== id ) );
		} else {
			props.onChangeSites( [ ...selectedSites, id ] );
		}
	};

	return (
		<aside className="Super-facets text-sm">
			<Facet title="Sites">
				{ sites.isLoading ? (
					<p className="m-0 text-black/60">Loading sites…</p>
				) : (
					<ul className="list-none m-0 p-0">
						<li className="m-0 p-0 mb-1 pb-1 border-b border-solid border-hm-beige">
							<label className={ LABEL_CLASSES }>
								<input
									checked={ selectedSites.length === 0 }
									className={ CONTROL_CLASSES }
									type="checkbox"
									onChange={ () => props.onChangeSites( [] ) }
								/>
								<span className="font-semibold">All sites</span>
							</label>
						</li>
						{ ( sites.data || [] ).map( site => (
							<li key={ site.id } className="m-0 p-0">
								<label className={ LABEL_CLASSES }>
									<input
										checked={ selectedSites.includes( site.id ) }
										className={ CONTROL_CLASSES }
										type="checkbox"
										onChange={ () => toggleSite( site.id ) }
									/>
									<span className="min-w-0 truncate">
										{ site.name }
										{ isCurrentSite( site ) && (
											<span className="ml-1 text-xs text-black/50">(this site)</span>
										) }
									</span>
								</label>
							</li>
						) ) }
					</ul>
				) }
			</Facet>

			<RadioFacet
				name="Super-facet-type"
				options={ TYPES }
				title="Show"
				value={ type }
				onChange={ props.onChangeType }
			/>

			<RadioFacet
				name="Super-facet-period"
				options={ PERIODS }
				title="Published"
				value={ period }
				onChange={ props.onChangePeriod }
			/>

			<RadioFacet
				name="Super-facet-orderby"
				options={ ORDERS }
				title="Sort by"
				value={ orderby }
				onChange={ props.onChangeOrderby }
			/>
		</aside>
	);
}

Facets.propTypes = {
	orderby: PropTypes.oneOf( ORDERS.map( order => order.value ) ).isRequired,
	period: PropTypes.oneOf( PERIODS.map( period => period.value ) ).isRequired,
	selectedSites: PropTypes.arrayOf( PropTypes.number ).isRequired,
	sites: PropTypes.shape( {
		data: PropTypes.array,
		isLoading: PropTypes.bool,
	} ).isRequired,
	type: PropTypes.oneOf( TYPES.map( type => type.value ) ).isRequired,
	onChangeOrderby: PropTypes.func.isRequired,
	onChangePeriod: PropTypes.func.isRequired,
	onChangeSites: PropTypes.func.isRequired,
	onChangeType: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

import RelativeLink from './RelativeLink';
import { withApiData } from '../with-api-data';

import './SearchInput.css';

const Results = props => {
	console.log( props );

	const classes = [
		'SearchInput__results',
		props.visible && 'SearchInput__results--visible',
	];
	return (
		<div className={ classes.filter( Boolean ).join( ' ' ) }>
			{ props.term === '' ? (
				<p>Start typing to search.</p>
			) : props.results.isLoading ? (
				<p>Loading results for “{ props.term }”</p>
			) : props.results.error ? (
				<p>Error while loading results. <span aria-label="Sorry." role="img">😰</span></p>
			) : ( props.results.data && props.results.data.length > 0 ) ? (
				<ul>
					{ props.results.data.map( post => (
						<li
							key={ post.id }
						>
							<RelativeLink
								className="SearchInput__result"
								to={ post.link }
							>
								<p>
									{ post.title.rendered }
								</p>
								<p>
									<time
										dateTime={ post.date + 'Z' }
										title={ post.date + 'Z' }
									>
										<FormattedRelative value={ post.date + 'Z' } />
									</time>
								</p>
							</RelativeLink>
						</li>
					) ) }
				</ul>
			) : (
				<p>No results found.</p>
			) }
		</div>
	);
};

const ConnectedResults = withApiData(
	props => {
		if ( ! props.term ) {
			return {};
		}

		const query = {
			search: props.term,
			per_page: 5,
			context: 'embed',
			_embed: 'true',
		};

		return {
			results: `/wp/v2/posts?${ qs.stringify( query ) }`,
		};
	}
)(
	Results
);

class SearchInput extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			showSuggest: false,
			value: null,
		};
	}

	onBlur = () => {
		window.setTimeout( () => {
			this.setState( { showSuggest: false } );
		}, 100 );
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.onSearch( this.state.value );
		this.setState( { value: null } );
	}

	render() {
		const termFromURL = this.props.location.pathname.match( /\/search\/(.+)/ );
		const term = this.state.value || ( termFromURL && termFromURL[1] ) || '';

		return (
			<form
				className="SearchInput"
				onSubmit={ this.onSubmit }
			>
				<div className="SearchInput__wrap">
					<input
						type="search"
						placeholder="Search..."
						value={ term }
						onChange={ e => this.setState( { value: e.target.value } ) }
						onFocus={ () => this.setState( { showSuggest: true } ) }
						onBlur={ this.onBlur }
					/>
				</div>

				<ConnectedResults
					term={ term }
					visible={ this.state.showSuggest }
				/>
			</form>
		);
	}
}

SearchInput.propTypes = { onSearch: PropTypes.func.isRequired };

export default withRouter( SearchInput );

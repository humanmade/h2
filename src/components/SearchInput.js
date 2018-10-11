import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

import RelativeLink from './RelativeLink';
import { withApiData } from '../with-api-data';

import './SearchInput.css';

class Results extends React.Component {
	state = {
		selected: -1,
	}

	componentDidMount() {
		this.keyHandler = e => {
			const items = this.props.results && this.props.results.data;
			if ( ! this.props.visible || ! items || ! items.length ) {
				return;
			}

			const { selected } = this.state;
			switch ( e.key ) {
				case 'ArrowUp':
					e.preventDefault();
					this.setState( state => {
						const nextSelection = Math.max( 0, selected - 1 );
						return { selected: nextSelection };
					} );
					return;

				case 'ArrowDown':
					e.preventDefault();
					this.setState( state => {
						const nextSelection = Math.min( selected + 1, items.length );
						return { selected: nextSelection };
					} );
					return;

				case 'Enter': {
					e.preventDefault();

					if ( selected === items.length ) {
						this.props.onShowResults( e );
					} else {
						const item = items[ selected ];
						this.props.onSelect( item );
					}

					this.setState( { selected: -1 } );
					return;
				}

				default:
					// No-op
					return;
			}
		};

		window.addEventListener( 'keydown', this.keyHandler );
	}

	componentWillUnmount() {
		if ( ! this.keyHandler ) {
			return;
		}

		window.removeEventListener( 'keydown', this.keyHandler );
	}

	render() {
		const { selected } = this.state;
		const { results, term, visible } = this.props;

		const classes = [
			'SearchInput__results',
			visible && 'SearchInput__results--visible',
		];
		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				{ term === '' ? (
					<p>Start typing to search.</p>
				) : results.isLoading ? (
					<p>Loading results for “{ term }”</p>
				) : results.error ? (
					<p>Error while loading results. <span aria-label="Sorry." role="img">😰</span></p>
				) : ( results.data && results.data.length > 0 ) ? (
					<ul>
						{ results.data.map( ( post, index ) => (
							<li
								key={ post.id }
							>
								<RelativeLink
									className={ `SearchInput__result ${ index === selected ? 'SearchInput__result--selected' : '' }` }
									to={ post.link }
								>
									<p>
										{ post.title.rendered }
									</p>
									<time
										dateTime={ post.date + 'Z' }
										title={ post.date + 'Z' }
									>
										<FormattedRelative value={ post.date + 'Z' } />
									</time>
								</RelativeLink>
							</li>
						) ) }
						<li>
							<a
								href={ `/search/${ term }` }
								onClick={ this.props.onShowResults }
								className={ `SearchInput__result ${ selected === results.data.length ? 'SearchInput__result--selected' : '' }` }
							>
								Show all results →
							</a>
						</li>
					</ul>
				) : (
					<p>No results found.</p>
				) }
			</div>
		);
	}
}

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

	onSelect = item => {
		const path = item.link.replace( /^(?:\/\/|[^/]+)*\//, '/' );
		this.props.history.push( path );

		if ( this.inputEl ) {
			this.inputEl.blur();
		}
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.onSearch( this.state.value );
		this.setState( { value: null } );

		if ( this.inputEl ) {
			this.inputEl.blur();
		}
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
						ref={ ref => this.inputEl = ref }
						value={ term }
						onChange={ e => this.setState( { value: e.target.value } ) }
						onFocus={ () => this.setState( { showSuggest: true } ) }
						onBlur={ this.onBlur }
					/>
				</div>

				<ConnectedResults
					term={ term }
					visible={ this.state.showSuggest }
					onSelect={ this.onSelect }
					onShowResults={ this.onSubmit }
				/>
			</form>
		);
	}
}

SearchInput.propTypes = { onSearch: PropTypes.func.isRequired };

export default withRouter( SearchInput );

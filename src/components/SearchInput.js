import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Link from './Link';
import { posts } from '../types';
import { decodeEntities } from '../util';

import './SearchInput.css';

export class Results extends React.Component {
	state = {
		selected: -1,
	}

	componentDidMount() {
		this.keyHandler = e => {
			const items = this.props.posts;
			if ( ! this.props.visible || ! items || ! items.length ) {
				return;
			}

			const { selected } = this.state;
			switch ( e.key ) {
				case 'ArrowUp':
					e.preventDefault();
					this.setState( state => {
						const nextSelection = Math.max( -1, selected - 1 );
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
					if ( selected === items.length ) {
						this.props.onShowResults( e );
					} else {
						const item = items[ selected ];
						if ( ! item ) {
							return;
						}

						e.preventDefault();
						this.props.onSelect( item );
					}

					this.setState( { selected: -1 } );
					return;
				}

				case 'Escape':
					if ( selected >= 0 ) {
						e.preventDefault();
						this.setState( { selected: -1 } );
					}

					return;

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
		const { loading, posts, term, visible } = this.props;

		const classes = [
			'SearchInput__results',
			visible && 'SearchInput__results--visible',
		];
		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				{ term === '' ? (
					<p>Start typing to search.</p>
				) : loading ? (
					<p>Loading results for “{ term }”</p>
				) : ( posts && posts.length > 0 ) ? (
					<ul>
						{ posts.map( ( post, index ) => (
							<li
								key={ post.id }
							>
								<Link
									className={ `SearchInput__result ${ index === selected ? 'SearchInput__result--selected' : '' }` }
									href={ post.link }
								>
									<p>
										{ decodeEntities( post.title.rendered ) }
									</p>
									<time
										dateTime={ post.date + 'Z' }
										title={ post.date + 'Z' }
									>
										<FormattedRelative value={ post.date + 'Z' } />
									</time>
								</Link>
							</li>
						) ) }
						<li>
							<a
								href={ `/search/${ encodeURIComponent( term ) }` }
								onClick={ this.props.onShowResults }
								className={ `SearchInput__result ${ selected === posts.length ? 'SearchInput__result--selected' : '' }` }
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

const ConnectedResults = withArchive(
	posts,
	state => state.posts,
	props => {
		const query = {
			search: props.term,
			per_page: 5,
		};

		const id = `searchPreview/${ props.term }`;
		posts.registerArchive( id, query );
		return id;
	}
)( Results );

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
		}, 200 );
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
		const term = this.state.value === null ? ( termFromURL && decodeURIComponent( termFromURL[1] ) ) || '' : this.state.value;
		const Results = this.props.resultsComponent;

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

				<Results
					term={ term }
					visible={ this.state.showSuggest }
					onSelect={ this.onSelect }
					onShowResults={ this.onSubmit }
				/>
			</form>
		);
	}
}

SearchInput.propTypes = {
	resultsComponent: PropTypes.elementType,
	onSearch: PropTypes.func.isRequired,
};
SearchInput.defaultProps = {
	resultsComponent: ConnectedResults,
};

export default withRouter( SearchInput );

import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { posts } from '../types';
import { decodeEntities } from '../util';

import Link from './Link';

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
		const { loading, posts, small, term, visible } = this.props;

		const classes = [
			'SearchInput__results',
			'absolute left-0 right-0 z-10 py-2 bg-hm-light-grey shadow-[0_0_8px_rgba(0,0,0,0.3)]',
			visible ? 'SearchInput__results--visible block' : 'hidden',
			small ? '' : 'px-5',
		];
		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				{ term === '' ? (
					<p className="m-0 p-0">Start typing to search.</p>
				) : loading ? (
					<p className="m-0 p-0">Loading results for "{ term }"</p>
				) : ( posts && posts.length > 0 ) ? (
					<ul className="m-0 p-0 list-none">
						{ posts.map( ( post, index ) => (
							<li
								key={ post.id }
								className="m-0 p-0"
							>
								<Link
									className={ [
										'flex justify-between py-1 max-[600px]:block max-[600px]:mb-2 hover:border-none hover:bg-hm-vibrant-blue hover:text-white!',
										index === selected && 'SearchInput__result--selected border-none bg-hm-vibrant-blue text-white!',
										'-mx-5 px-5',
									].filter( Boolean ).join( ' ' ) }
									href={ post.link }
								>
									<p className="m-0 max-[600px]:mb-1">
										{ decodeEntities( post.title.rendered ) }
									</p>
									<time
										className="shrink-0 ml-4 max-[600px]:ml-0"
										dateTime={ post.date + 'Z' }
										title={ post.date + 'Z' }
									>
										<FormattedRelative value={ post.date + 'Z' } />
									</time>
								</Link>
							</li>
						) ) }
						<li className="m-0 p-0">
							<a
								className={ [
									'flex justify-between py-1 max-[600px]:block max-[600px]:mb-2 hover:border-none hover:bg-hm-vibrant-blue hover:text-white!',
									posts.length === selected && 'SearchInput__result--selected border-none bg-hm-vibrant-blue text-white!',
									'-mx-5 px-5',
								].filter( Boolean ).join( ' ' ) }
								href={ `/search/${ encodeURIComponent( term ) }` }
								onClick={ this.props.onShowResults }
							>
								Show all results →
							</a>
						</li>
					</ul>
				) : (
					<p className="m-0 p-0">No results found.</p>
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
				className={ `SearchInput flex-1 relative self-stretch ${ this.props.className || '' }` }
				onSubmit={ this.onSubmit }
			>
				<div
					className={ [
						'SearchInput__wrap',
						'flex items-center h-full bg-hm-light-grey relative z-11',
						this.props.small ? '' : 'px-5',
					].filter( Boolean ).join( ' ' ) }
				>
					<input
						className="w-full text-lg border-2 border-hm-border-color rounded-sm px-2 py-1 md:py-2 md:leading-5 placeholder:italic"
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
					small={ this.props.small }
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
	className: PropTypes.string,
	resultsComponent: PropTypes.elementType,
	small: PropTypes.bool,
	onSearch: PropTypes.func.isRequired,
};
SearchInput.defaultProps = {
	resultsComponent: ConnectedResults,
};

export default withRouter( SearchInput );

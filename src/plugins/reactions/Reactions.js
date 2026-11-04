import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import EmojiPicker from '../../components/EmojiPicker';
import { withCurrentUser } from '../../hocs';
import { reactions } from '../../types';

import './Reactions.css';

const CHIP_CLASSES = [
	'relative inline-flex items-center h-7 m-0 border border-solid rounded-full cursor-pointer',
	'transition-colors duration-150',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
].join( ' ' );

const Emoji = props => {
	const custom = window.H2Data.site.emoji[ props.type ];
	if ( custom ) {
		return (
			<img
				alt={ custom.colons }
				className="inline-block h-[1em] max-h-[1em] align-[-0.125em]"
				src={ custom.imageUrl }
			/>
		);
	}

	return props.type;
};

export class Reactions extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: false,
			isOpen: false,
		};
	}

	onAddReaction( emoji ) {
		const body = {
			post: this.props.postId,
			type: emoji,
		};

		if ( this.props.commentId ) {
			body.comment = this.props.commentId;
		}

		this.setState( { isLoading: true } );

		this.props.onCreate( body ).then( () => {
			this.setState( { isLoading: false } );
			this.props.onLoad();
		} );

	}

	onRemoveReaction( emoji ) {
		const reactions = this.props.reactions;

		let matches = reactions.filter( reaction => {
			return (
				reaction.author === this.props.currentUser.id &&
				reaction.type === emoji
			);
		} );

		if ( matches.length < 1 ) {
			return;
		}
		this.props.onDelete( matches[0].id ).then( () => {
			this.props.onLoad();
		} );
	}

	/**
	 * Return the raw reactions grouped by emoji.
	 *
	 * @returns {object} Reaction emoji : array of user IDs. eg 🌭:[ 1, 2 ].
	 */
	getGroupedReactions() {
		let reactions = {};
		if ( ! this.props.reactions ) {
			return reactions;
		}
		this.props.reactions.forEach( reaction => {
			if ( ! ( reaction.type in reactions ) || reactions[ reaction.type ].includes( reaction.author ) ) {
				reactions[ reaction.type ] = [ reaction.author ];
			} else {
				reactions[ reaction.type ].push( reaction.author );
			}
		} );

		return reactions;
	}

	render() {
		const reactions = this.getGroupedReactions();
		if ( ! this.props.currentUser ) {
			return null;
		}

		const loading = this.props.loading || this.state.isLoading;

		return (
			<div className="reactions relative flex flex-wrap items-center gap-1.5">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					const isActive = users.indexOf( this.props.currentUser.id ) >= 0;
					const names = users
						.filter( id => id !== 0 )
						.map( id => {
							const user = this.props.users && this.props.users.find( user => user.id === id );
							return user ? user.name : 'Unknown';
						} );

					return (
						<button
							key={ emoji }
							aria-label={ emoji + ' ' + users.length + ( names.length ? ': ' + names.join( ', ' ) : '' ) }
							aria-pressed={ isActive }
							className={ [
								CHIP_CLASSES,
								'group gap-1.5 pl-2 pr-2.5',
								isActive
									? 'border-hm-vibrant-blue/40 bg-hm-vibrant-blue/8 text-hm-vibrant-blue hover:bg-hm-vibrant-blue/12'
									: 'border-[#dfe1e5] bg-white text-gray-600 hover:bg-[#f5f6f8]',
							].join( ' ' ) }
							type="button"
							onClick={ () => this.toggleReaction( emoji ) }
						>
							<span className="text-base leading-none">
								<Emoji type={ emoji } />
							</span>
							<span className="text-xs font-medium tabular-nums">{ users.length }</span>
							{ names.length > 0 && (
								<span
									aria-hidden="true"
									className="pointer-events-none absolute left-0 top-full z-10 mt-1.5 hidden whitespace-nowrap rounded-md bg-[#1f2328] px-2 py-1 text-left text-xs font-normal text-white shadow-sm group-hover:block group-focus-visible:block"
								>
									{ names.join( ', ' ) }
								</span>
							) }
						</button>
					);
				} ) }
				<button
					aria-label="Add reaction"
					className={ CHIP_CLASSES + ' w-7 justify-center border-[#dfe1e5] bg-transparent text-gray-500 hover:bg-[#f0f1f4] hover:text-hm-dark-grey disabled:cursor-wait' }
					disabled={ loading }
					title="Add reaction"
					type="button"
					onClick={ () => this.setState( { isOpen: ! this.state.isOpen } ) }
				>
					{ loading ? (
						<span className="loading loading--active m-0"></span>
					) : (
						<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
							<circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
							<path d="M7 11.75c.75 1 1.8 1.5 3 1.5s2.25-.5 3-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							<circle cx="7.6" cy="8.4" r="1" fill="currentColor" />
							<circle cx="12.4" cy="8.4" r="1" fill="currentColor" />
						</svg>
					) }
				</button>
				{ this.state.isOpen && (
					<EmojiPicker
						onClose={ () => this.setState( { isOpen: false } ) }
						onSelect={ data => {
							this.setState( { isOpen: false } );
							this.toggleReaction( data.native || data.name );
						} }
					/>
				) }
			</div>
		);
	}

	toggleReaction( emoji, reactionUserId ) {
		const reactions = this.getGroupedReactions();
		if (
			! ( emoji in reactions ) ||
			reactions[ emoji ].indexOf( this.props.currentUser.id ) < 0
		) {
			if ( Object.keys( reactions ).length >= 10 ) {
				alert( 'Sorry! You are only allowed 10 reactions per post!' );
				return;
			}

			this.onAddReaction( emoji );
		} else {
			this.onRemoveReaction( emoji );
		}
	}
}

const mapStateToProps = state => ( {
	users: state.users.posts,
} );
const mapDispatchToProps = dispatch => ( {
	onCreate: data => dispatch( reactions.createSingle( data ) ),
	onDelete: id => dispatch( reactions.deleteSingle( id ) ),
} );
const mapPropsToId = props => {
	const post = props.postId;
	const comment = props.commentId || null;
	const id = [ post, comment ].filter( Boolean ).join( '+' );
	reactions.registerArchive( id, {
		post,
		comment,
	} );
	return id;
};
const mapDataToProps = data => ( {
	loading: data.loading,
	reactions: data.posts,
} );

export default withArchive(
	reactions,
	state => state.reactions,
	mapPropsToId,
	{ mapDataToProps }
)(
	connect( mapStateToProps, mapDispatchToProps )( withCurrentUser( Reactions ) )
);

Reactions.propTypes = {
	userId: PropTypes.number,
	postId: PropTypes.number.isRequired,
	commentId: PropTypes.number,
	reactions: PropTypes.array,
};

Reactions.defaultProps = {
	userId: 0,
	isLoading: false,
	reactions: [],
};

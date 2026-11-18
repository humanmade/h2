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

// Beyond this many reactors, the tooltip shows a compact comma-separated list.
const MAX_DETAILED_REACTORS = 20;

// Map of native emoji (sans variation selectors) to colon names, eg 😄 => :smile:.
let emojiNames = null;
let emojiNamesPromise = null;

const normalizeEmoji = emoji => emoji.replace( /️/g, '' );

/**
 * Lazily load the emoji-mart index (shared with the picker chunk) and build
 * a native => colon name map.
 *
 * @returns {Promise<object>} Resolves to the name map.
 */
const loadEmojiNames = () => {
	if ( ! emojiNamesPromise ) {
		emojiNamesPromise = import( '../../components/EmojiMart' ).then( ( { emojiIndex } ) => {
			const names = {};
			Object.values( emojiIndex.emojis ).forEach( emoji => {
				// Emoji with skin tone variations are keyed by skin tone (1-6).
				const variants = emoji.native ? [ emoji ] : Object.values( emoji );
				variants.forEach( variant => {
					if ( variant.native && variant.colons ) {
						names[ normalizeEmoji( variant.native ) ] = variant.colons;
					}
				} );
			} );
			emojiNames = names;
			return names;
		} );
	}

	return emojiNamesPromise;
};

const getEmojiName = emoji => {
	const custom = window.H2Data.site.emoji[ emoji ];
	if ( custom ) {
		return custom.colons;
	}

	return ( emojiNames && emojiNames[ normalizeEmoji( emoji ) ] ) || emoji;
};

// Skin tone modifiers (U+1F3FB to U+1F3FF), lightest first.
const SKIN_TONE_PATTERN = /\uD83C[\uDFFB-\uDFFF]/g;
const SKIN_TONES = [ '🏻', '🏼', '🏽', '🏾', '🏿' ];

const getBaseEmoji = emoji => emoji.replace( SKIN_TONE_PATTERN, '' );

/**
 * Get the skin tone modifier chosen in the emoji picker.
 *
 * @returns {string|null} Modifier character, or null for the default tone.
 */
const getPreferredSkinTone = () => {
	try {
		// emoji-mart stores 1 (default) to 6 (darkest).
		const skin = JSON.parse( window.localStorage.getItem( 'emoji-mart.skin' ) );
		return SKIN_TONES[ skin - 2 ] || null;
	} catch ( e ) {
		return null;
	}
};

export class Reactions extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: false,
			isOpen: false,
			hasEmojiNames: !! emojiNames,
		};
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	onPreviewReaction = () => {
		if ( this.state.hasEmojiNames ) {
			return;
		}

		loadEmojiNames().then( () => {
			if ( ! this.unmounted ) {
				this.setState( { hasEmojiNames: true } );
			}
		} );
	};

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

	/**
	 * Remove the current user's reactions with any of the given emoji.
	 *
	 * @param {string[]} types Emoji to remove.
	 */
	onRemoveReactions( types ) {
		const matches = ( this.props.reactions || [] ).filter( reaction => (
			reaction.author === this.props.currentUser.id &&
			types.includes( reaction.type )
		) );

		if ( matches.length < 1 ) {
			return;
		}

		Promise.all( matches.map( reaction => this.props.onDelete( reaction.id ) ) ).then( () => {
			this.props.onLoad();
		} );
	}

	/**
	 * Return the raw reactions grouped by emoji, merging skin tone variants.
	 *
	 * @returns {object} Base emoji : { variants, users, usersByVariant }.
	 *                   eg 👍:{ variants: [ 👍, 👍🏽 ], users: [ 1, 2 ], usersByVariant: { 👍: [ 1 ], 👍🏽: [ 2 ] } }.
	 */
	getGroupedReactions() {
		const groups = {};
		( this.props.reactions || [] ).forEach( reaction => {
			const base = getBaseEmoji( reaction.type );
			if ( ! groups[ base ] ) {
				groups[ base ] = {
					variants: [],
					users: [],
					usersByVariant: {},
				};
			}

			const group = groups[ base ];
			if ( ! group.usersByVariant[ reaction.type ] ) {
				group.variants.push( reaction.type );
				group.usersByVariant[ reaction.type ] = [];
			}
			if ( ! group.usersByVariant[ reaction.type ].includes( reaction.author ) ) {
				group.usersByVariant[ reaction.type ].push( reaction.author );
			}
			if ( ! group.users.includes( reaction.author ) ) {
				group.users.push( reaction.author );
			}
		} );

		// Default tone first, then lightest to darkest.
		Object.values( groups ).forEach( group => group.variants.sort() );

		return groups;
	}

	/**
	 * Get display details for a user who reacted.
	 *
	 * @param {number} id User ID.
	 * @returns {object} Person with id, name, username, and avatar.
	 */
	getPerson( id ) {
		const user = this.props.users && this.props.users.find( user => user.id === id );
		return {
			id,
			name: user ? user.name : 'Unknown',
			username: user ? user.slug : null,
			avatar: ( user && user.avatar_urls && user.avatar_urls['96'] ) || window.H2Data.site.default_avatar,
		};
	}

	/**
	 * Pick the variant to add when clicking a merged reaction.
	 *
	 * Uses the skin tone chosen in the emoji picker, where the emoji supports it.
	 *
	 * @param {string} base Base emoji (without skin tone).
	 * @param {object} group Group from getGroupedReactions().
	 * @returns {string} Emoji to add.
	 */
	getVariantToAdd( base, group ) {
		const tone = getPreferredSkinTone();
		if ( ! tone ) {
			return base;
		}

		// Re-tone an existing variant, so multi-person sequences keep their structure.
		const toned = group.variants.find( variant => variant !== base );
		if ( toned ) {
			return toned.replace( SKIN_TONE_PATTERN, tone );
		}

		// Otherwise, only apply the tone if emoji-mart knows the toned version.
		const candidate = normalizeEmoji( base ) + tone;
		return emojiNames && emojiNames[ candidate ] ? candidate : base;
	}

	render() {
		const reactions = this.getGroupedReactions();
		if ( ! this.props.currentUser ) {
			return null;
		}

		const loading = this.props.loading || this.state.isLoading;

		return (
			<div className="reactions relative flex flex-wrap items-center gap-1.5">
				{ Object.entries( reactions ).map( ( [ base, { variants, users, usersByVariant } ] ) => {
					const isActive = users.indexOf( this.props.currentUser.id ) >= 0;
					const getPeople = ids => ids.filter( id => id !== 0 ).map( id => this.getPerson( id ) );
					const people = getPeople( users );
					const names = people.map( person => person.name );
					const isDetailed = people.length < MAX_DETAILED_REACTORS;

					return (
						<button
							key={ base }
							aria-label={ variants.join( '' ) + ' ' + users.length + ( names.length ? ': ' + names.join( ', ' ) : '' ) }
							aria-pressed={ isActive }
							className={ [
								CHIP_CLASSES,
								'group gap-1.5 pl-2 pr-2.5',
								isActive
									? 'border-hm-vibrant-blue/40 bg-hm-vibrant-blue/8 text-hm-vibrant-blue hover:bg-hm-vibrant-blue/12'
									: 'border-[#dfe1e5] bg-white text-gray-600 hover:bg-[#f5f6f8]',
							].join( ' ' ) }
							type="button"
							onClick={ () => this.toggleGroup( base ) }
							onFocus={ this.onPreviewReaction }
							onMouseEnter={ this.onPreviewReaction }
						>
							<span className="text-base leading-none">
								{ variants.map( variant => (
									<Emoji key={ variant } type={ variant } />
								) ) }
							</span>
							<span className="text-xs font-medium tabular-nums">{ users.length }</span>
							<span
								aria-hidden="true"
								className="pointer-events-none absolute left-0 top-full z-10 mt-1.5 hidden w-max max-w-xs rounded-md bg-[#1f2328] px-2 py-1.5 text-left text-xs font-normal text-white shadow-sm group-hover:block group-focus-visible:block"
							>
								<span className="flex flex-col gap-1.5">
									{ variants.map( variant => {
										const variantPeople = getPeople( usersByVariant[ variant ] );
										const label = (
											<span className="font-semibold">{ getEmojiName( variant ) }</span>
										);

										if ( ! isDetailed ) {
											return (
												<span key={ variant } className="block">
													{ label }
													{ ' ' }
													{ variantPeople.map( person => person.name ).join( ', ' ) }
												</span>
											);
										}

										return (
											<span key={ variant } className="block">
												<span className="block">{ label }</span>
												{ variantPeople.length > 0 && (
													<span className="mt-1 flex flex-col gap-1">
														{ variantPeople.map( person => (
															<span
																key={ person.id }
																className="flex items-center gap-1.5 whitespace-nowrap"
															>
																<img
																	alt=""
																	className="size-4 max-w-none shrink-0 rounded-full bg-white"
																	src={ person.avatar }
																/>
																<span>
																	{ person.name }
																	{ person.username && (
																		<span className="text-white/60"> (@{ person.username })</span>
																	) }
																</span>
															</span>
														) ) }
													</span>
												) }
											</span>
										);
									} ) }
								</span>
							</span>
						</button>
					);
				} ) }
				<button
					aria-label="Add reaction"
					className={ CHIP_CLASSES + ' group/add w-7 justify-center border-[#dfe1e5] bg-transparent text-gray-500 hover:bg-[#f0f1f4] hover:text-hm-dark-grey disabled:cursor-wait' }
					disabled={ loading }
					title="Add reaction"
					type="button"
					onClick={ () => this.setState( { isOpen: ! this.state.isOpen } ) }
				>
					{ loading ? (
						<svg aria-hidden="true" className="motion-safe:animate-spin" viewBox="0 0 20 20" width="18" height="18">
							<circle cx="10" cy="10" r="7.25" fill="none" opacity=".25" stroke="currentColor" strokeWidth="1.5" />
							<path d="M10 2.75a7.25 7.25 0 0 1 7.25 7.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					) : (
						<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
							<circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
							<path
								className="duration-150 motion-safe:transition-opacity group-hover/add:opacity-0 group-focus-visible/add:opacity-0"
								d="M7 11.75c.75 1 1.8 1.5 3 1.5s2.25-.5 3-1.5"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
							<path
								className="origin-[10px_11px] scale-y-50 opacity-0 duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] motion-safe:transition-[opacity,scale] group-hover/add:scale-y-100 group-hover/add:opacity-100 group-focus-visible/add:scale-y-100 group-focus-visible/add:opacity-100"
								d="M6.75 11h6.5a.5.5 0 0 1 .5.5a3.75 3.75 0 0 1-7.5 0a.5.5 0 0 1 .5-.5z"
								fill="currentColor"
							/>
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

	/**
	 * Toggle the current user's reaction with an exact emoji (eg from the picker).
	 *
	 * @param {string} emoji Emoji, including any skin tone.
	 */
	toggleReaction( emoji ) {
		const hasReacted = ( this.props.reactions || [] ).some( reaction => (
			reaction.author === this.props.currentUser.id &&
			reaction.type === emoji
		) );

		if ( hasReacted ) {
			this.onRemoveReactions( [ emoji ] );
		} else {
			this.addReaction( emoji );
		}
	}

	/**
	 * Toggle the current user's reaction on a merged reaction bubble.
	 *
	 * @param {string} base Base emoji (without skin tone).
	 */
	toggleGroup( base ) {
		const group = this.getGroupedReactions()[ base ];
		if ( group.users.includes( this.props.currentUser.id ) ) {
			this.onRemoveReactions( group.variants );
		} else {
			this.addReaction( this.getVariantToAdd( base, group ) );
		}
	}

	addReaction( emoji ) {
		// The server limits distinct emoji, counting each skin tone separately.
		const types = new Set( ( this.props.reactions || [] ).map( reaction => reaction.type ) );
		if ( ! types.has( emoji ) && types.size >= 10 ) {
			alert( 'Sorry! You are only allowed 10 reactions per post!' );
			return;
		}

		this.onAddReaction( emoji );
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

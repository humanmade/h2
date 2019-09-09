import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Picker } from 'emoji-mart'

import { withCurrentUser } from '../../hocs';
import { reactions } from '../../types';

import UserDisplayName from '../../components/UserDisplayName';

import 'emoji-mart/css/emoji-mart.css';
import './Reactions.css';

const customEmoji = Object.values( window.H2Data.site.emoji );

const Emoji = props => {
	const custom = window.H2Data.site.emoji[ props.type ];
	if ( custom ) {
		return (
			<img
				alt={ custom.colons }
				className="Reactions-custom"
				src={ custom.imageUrl }
			/>
		);
	}

	return props.type;
};

class PickerWrap extends Component {
	constructor( props ) {
		super( props );

		this.container = document.createElement( 'div' );
		this.mediaQuery = window.matchMedia( '(max-width: 600px)' );
		this.state = {
			needsPortal: this.mediaQuery.matches,
		};
		this.mediaQuery.addListener( this.onQueryChange );
	}

	componentDidMount() {
		document.body.appendChild( this.container );
	}

	componentWillUnmount() {
		document.body.removeChild( this.container );
	}

	onClose = e => {
		e.preventDefault();

		this.props.onClose();
	}

	onQueryChange = e => {
		this.setState( { needsPortal: e.matches } );
	}

	render() {
		const { needsPortal } = this.state;

		if ( ! needsPortal ) {
			return (
				<React.Fragment>
					{ this.props.children }
				</React.Fragment>
			);
		}

		return ReactDOM.createPortal(
			<div
				className="reactions-picker-wrap"
				onClick={ this.onClose }
			>
				{ this.props.children }
			</div>,
			this.container
		);
	}
}

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
	 * @return {object} Reaction emoji : array of user IDs. eg 🌭:[ 1, 2 ].
	 */
	getGroupedReactions() {
		let reactions = {};
		if ( ! this.props.reactions ) {
			return reactions;
		}
		this.props.reactions.forEach( reaction => {
			if ( ! ( reaction.type in reactions ) ) {
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
			<div className="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( this.props.currentUser.id ) >= 0 ? true : false;
					return (
						<button
							className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
							onClick={ () => this.toggleReaction( emoji ) }
							key={ emoji }
						>
							<span className="reactions__emoji" key="emoji">
								<Emoji type={ emoji } />
							</span>
							<span className="reactions__count" key="count">{ users.length }</span>
							<span className="reactions__users" key="users">
								{ users.map( reactionAuthorId => {
									const user = this.props.users && this.props.users.filter( user => user.id === reactionAuthorId );
									return (
										<UserDisplayName
											className="reactions__user"
											userId={ reactionAuthorId }
											userName={ user && user.length > 0 ? user[0].name : 'Unknown' }
											key={ this.props.postId + reactionAuthorId }
										/>
									);
								} ) }
							</span>
						</button>
					);
				} ) }
				<button
					className={ 'btn btn--small btn--tertiary' + ( loading ? ' loading' : '' ) }
					onClick={ value => this.setState( { isOpen: ! this.state.isOpen  } ) }
					key="button"
					disabled={ loading }
				>
					{ loading ? (
						<span className="loading loading--active"></span>
					) : (
						<span className="icon icon--smiley-wink">Add reaction</span>
					) }
				</button>
				{ this.state.isOpen && (
					<PickerWrap onClose={ () => this.setState( { isOpen: false } ) }>
						<Picker
							key="picker"
							onClick={ data => {
								this.setState( { isOpen: false } );
								this.toggleReaction( data.native || data.name );
							} }
							title={ false }
							emoji="upside_down_face"
							autoFocus={ true }
							color="#D24632"
							custom={ customEmoji }
							set="twitter"
						/>
					</PickerWrap>
				)}
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
	reactions: PropTypes.object.isRequired,
};

Reactions.defaultProps = {
	userId: 0,
	isLoading: false,
}

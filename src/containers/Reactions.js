import React, { Component } from 'react';
import { connect } from 'react-redux';
import Reactions from '../components/Reactions';
import { createReaction, deleteReaction } from '../actions';

const mapStateToProps = ( state, props ) => {
	let user = state.user.byId[ Object.keys( state.user.byId )[0] ];
	let reactions = [];
	let { updatingForPost } = state.reactions;

	if ( 'reactions' in state && 'byId' in state.reactions ) {
		Object.entries( state.reactions.byId ).forEach( ( [ id, reaction ] ) => {
			if ( parseInt( props.postId, 10 ) === parseInt( reaction.postId, 10 ) ) {
				reactions.push( reaction );
			}
		} );
	}

	return {
		userId:    typeof user !== 'undefined' ? user.id : 0,
		reactions: reactions,
		isLoading: updatingForPost ? updatingForPost.indexOf( props.postId ) >= 0 : false,
	}
};

class ConnectedReactions extends Component {

	onAddReaction( emoji ) {
		return this.props.dispatch(
			createReaction( {
				post: this.props.postId,
				type: emoji,
			} )
		);
	}

	onRemoveReaction( emoji ) {
		const { reactions } = this.props;

		let matches = reactions.filter( reaction => {
			return (
				reaction.author === this.props.userId &&
				reaction.type === emoji
			);
		} );

		if ( matches.length < 1 ) {
			return;
		}

		return this.props.dispatch(
			deleteReaction( matches[0].id )
		)
	}

	/**
	 * Return the raw reactions grouped by emoji.
	 *
	 * @return {object} Reaction emoji : array of user IDs. eg 🌭:[ 1, 2 ].
	 */
	getGroupedReactions() {
		let reactions = {};
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
		const { props } = this;

		return <Reactions
			postId={ props.postId }
			userId={ props.userId }
			reactions={ this.getGroupedReactions() }
			isLoading={ props.isLoading }
			onAddReaction={ emoji => {
				this.onAddReaction( emoji )
			} }
			onRemoveReaction={ emoji => {
				this.onRemoveReaction( emoji )
			} }
		/>
	}
}

export default connect( mapStateToProps )( ConnectedReactions );

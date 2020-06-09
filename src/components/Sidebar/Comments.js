import { withPagedArchive } from '@humanmade/repress';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Container from './Container';
import Pagination from './Pagination';
import MiniComment from '../Comment/Mini';
import LinkButton from '../LinkButton';
import { showSidebarProfile } from '../../actions';
import { withUser } from '../../hocs';
import { comments } from '../../types';

import './Comments.css';

class SidebarComments extends React.Component {
	render() {
		const containerProps = {
			className: 'Sidebar-Comments',
			onClose: this.props.onClose,
		};

		if ( this.props.loadingUser || this.props.loading || this.props.loadingMore ) {
			return (
				<Container
					{ ...containerProps }
					title="Loading comments…"
				>
					<p>Loading…</p>
				</Container>
			);
		}

		const { comments, user } = this.props;
		if ( ! user ) {
			return (
				<Container
					{ ...containerProps }
					title="Error loading user"
				>
					<p>Could not find details for user</p>
				</Container>
			);
		}

		if ( ! comments ) {
			return (
				<Container
					{ ...containerProps }
					title="Error loading user"
				>
					<p>Could not find details for user</p>
				</Container>
			);
		}

		containerProps.title = `${ user.name }’s Comments`;
		const hasPrevious = this.props.page > 1;

		return (
			<Container { ...containerProps }>
				<p className="Sidebar-Comments__navigation">
					<LinkButton onClick={ () => this.props.onShowProfile( user.id ) }>
						← Back to { user.name }’s profile
					</LinkButton>
				</p>

				<div className="Sidebar-Comments__wrap">
					{ comments && comments.map( comment => (
						<MiniComment
							key={ comment.id }
							comment={ comment }
							postAsTitle
						/>
					) ) }
				</div>

				<Pagination
					hasNext={ this.props.hasMore }
					hasPrevious={ hasPrevious }
					onNext={ this.props.onNext }
					onPrevious={ this.props.onPrevious }
				/>
			</Container>
		);
	}
}

const mapStateToProps = () => ( {} );
const mapDispatchtoProps = dispatch => ( {
	onShowProfile: id => dispatch( showSidebarProfile( id ) ),
} );

const withData = compose(
	withUser( props => props.id ),
	withPagedArchive(
		comments,
		state => state.comments,
		props => {
			const id = `user/${ props.id }`;
			comments.registerArchive( id, {
				author: props.id,
			} );
			return id;
		},
		{
			mapDataToProps: data => ( {
				comments: data.posts,
				hasMore: data.hasMore,
				loading: data.loading,
				loadingMore: data.loadingMore,
			} ),
		},
	),
	connect(
		mapStateToProps,
		mapDispatchtoProps,
	),
);

const ConnectedComments = withData( SidebarComments );

export default class SidebarCommentsWrap extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			page: 1,
		};
	}

	render() {
		return (
			<ConnectedComments
				{ ...this.props }
				page={ this.state.page }
				onNext={ () => this.setState( state => ( { page: state.page + 1 } ) ) }
				onPrevious={ () => this.setState( state => ( { page: state.page - 1 } ) ) }
			/>
		);
	}
}

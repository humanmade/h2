import qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';

import Container from './Container';
import Pagination from './Pagination';
import MiniComment from '../Comment/Mini';
import LinkButton from '../LinkButton';
import { showSidebarProfile } from '../../actions';
import { withApiData } from '../../with-api-data';

import './Comments.css';

class SidebarComments extends React.Component {
	render() {
		const containerProps = {
			className: 'Sidebar-Comments',
			onClose: this.props.onClose,
		};

		if ( this.props.user.isLoading || this.props.comments.isLoading ) {
			return (
				<Container
					{ ...containerProps }
					title="Loading comments…"
				>
					<p>Loading…</p>
				</Container>
			);
		}

		const user = this.props.user.data;
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

		const comments = this.props.comments.data;
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

		// TODO: Add proper pagination support:
		// https://github.com/joehoyle/with-api-data/issues/3
		// In the meantime, if we have less than the requested number, it's likely
		// that we don't have a next page.
		const hasNext = this.props.comments.data.length === 10;
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
					hasNext={ hasNext }
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

const mapPropsToData = props => {
	const args = {
		author: props.id,
		page: props.page,
	};

	return {
		comments: `/wp/v2/comments?${ qs.stringify( args ) }`,
		user: `/wp/v2/users/${ props.id }`,
	};
};

const ConnectedComments = connect(
	mapStateToProps,
	mapDispatchtoProps
)(
	withApiData( mapPropsToData )( SidebarComments )
);

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

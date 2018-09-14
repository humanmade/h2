import React from 'react';
import { connect } from 'react-redux';

import Container from './Container';
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
			</Container>
		);
	}
}

const mapStateToProps = () => ( {} );
const mapDispatchtoProps = dispatch => ( {
	onShowProfile: id => dispatch( showSidebarProfile( id ) ),
} );

const mapPropsToData = props => ( {
	comments: `/wp/v2/comments?author=${ props.id }`,
	user: `/wp/v2/users/${ props.id }`,
} );

export default connect(
	mapStateToProps,
	mapDispatchtoProps
)(
	withApiData( mapPropsToData )( SidebarComments )
);

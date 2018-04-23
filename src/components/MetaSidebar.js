import React from 'react';
import { connect } from 'react-redux';

import Button from './Button';
import LinkButton from './LinkButton';
import RelativeLink from './RelativeLink';
import UserBlock from './UserBlock';
import Container from './Sidebar/Container';
import { showSidebarProfile } from '../actions';
import { withApiData } from '../with-api-data';

class MetaSidebar extends React.Component {
	render() {
		const containerProps = {
			className: 'MetaSidebar',
			title:     'All About You',
			onClose:   this.props.onClose,
		};

		if ( this.props.user.isLoading ) {
			return <Container { ...containerProps }>
				<p>Loading…</p>
			</Container>;
		}

		const user = this.props.user.data;
		if ( ! user ) {
			return <Container { ...containerProps }>
				<p>Could not find details for user</p>
			</Container>;
		}

		return <Container { ...containerProps }>
			<UserBlock user={ user } />

			<ul>
				<li><LinkButton onClick={ () => this.props.onViewProfile( user.id ) }>View your profile →</LinkButton></li>
				<li><RelativeLink to={ user.link }>View all posts →</RelativeLink></li>
			</ul>

			<Button onClick={ this.props.onLogOut }>Log out</Button>
		</Container>;
	}
}

const mapStateToProps = () => ( {} );

const mapDispatchToProps = dispatch => {
	return { onViewProfile: id => dispatch( showSidebarProfile( id ) ) };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withApiData( props => ( { user: '/wp/v2/users/me' } ) )( MetaSidebar )
);

import React from 'react';
import { connect } from 'react-redux';

import Button from './Button';
import LinkButton from './LinkButton';
import RelativeLink from './RelativeLink';
import UserBlock from './UserBlock';
import Container from './Sidebar/Container';
import {
	disableBetaFeature,
	enableBetaFeature,
	showSidebarProfile,
} from '../actions';
import { withApiData } from '../with-api-data';

import './MetaSidebar.css';

const FEATURES = {
	summary_view: {
		name: 'Summary View',
		description: 'Adds a summary view to the post list screen.',
	},
}

const BetaFeature = props => (
	<div className="MetaSidebar--feature">
		<label>
			<input
				type="checkbox"
				value={ props.enabled }
				onChange={ e => e.target.checked ? props.onEnable() : props.onDisable() }
			/>
			<span>{ props.name }</span>
		</label>
		{ props.description && (
			<p className="MetaSidebar--feature-description">{ props.description }</p>
		) }
	</div>
);

class MetaSidebar extends React.Component {
	render() {
		const { features, onDisableFeature, onEnableFeature } = this.props;
		const containerProps = {
			className: 'MetaSidebar',
			title: 'All About You',
			onClose: this.props.onClose,
		};

		if ( this.props.user.isLoading ) {
			return (
				<Container { ...containerProps }>
					<p>Loading…</p>
				</Container>
			);
		}

		const user = this.props.user.data;
		if ( ! user ) {
			return (
				<Container { ...containerProps }>
					<p>Could not find details for user</p>
				</Container>
			);
		}

		return (
			<Container { ...containerProps }>
				<UserBlock user={ user } />

				<ul>
					<li><LinkButton onClick={ () => this.props.onViewProfile( user.id ) }>View your profile →</LinkButton></li>
					<li><RelativeLink to={ user.link }>View all posts →</RelativeLink></li>
				</ul>

				<Button onClick={ this.props.onLogOut }>Log out</Button>

				<h3>Beta Features</h3>
				{ Object.keys( FEATURES ).map( key => (
					<BetaFeature
						key={ key }
						enabled={ features[ key ] }
						description={ FEATURES[ key ].description || null }
						name={ FEATURES[ key ].name }
						onEnable={ () => onEnableFeature( key ) }
						onDisable={ () => onDisableFeature( key ) }
					/>
				) ) }
			</Container>
		);
	}
}

const mapStateToProps = state => ( {
	features: state.features,
} );

const mapDispatchToProps = dispatch => {
	return {
		onDisableFeature: id => dispatch( disableBetaFeature( id ) ),
		onEnableFeature: id => dispatch( enableBetaFeature( id ) ),
		onViewProfile: id => dispatch( showSidebarProfile( id ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withApiData( props => ( { user: '/wp/v2/users/me' } ) )( MetaSidebar )
);

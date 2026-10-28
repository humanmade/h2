import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import {
	disableBetaFeature,
	enableBetaFeature,
	showSidebarComments,
	showSidebarProfile,
} from '../actions';
import { withCurrentUser } from '../hocs';

import Button from './Button';
import Link from './Link';
import LinkButton from './LinkButton';
import Container from './Sidebar/Container';
import UserBlock from './UserBlock';
import UserSettings from './UserSettings';

const FEATURES = {};

const BetaFeature = props => (
	<div className="m-0 mb-4">
		<label className="font-bold cursor-pointer">
			<input
				checked={ props.enabled }
				type="checkbox"
				className="w-4 h-4 text-base mr-2"
				onChange={ e => e.target.checked ? props.onEnable() : props.onDisable() }
			/>
			<span>{ props.name }</span>
		</label>
		{ props.description && (
			<p className="mt-1 mb-0 ml-6 mr-0">{ props.description }</p>
		) }
	</div>
);

export class MetaSidebar extends React.Component {
	render() {
		const { currentUser, features, onDisableFeature, onEnableFeature } = this.props;
		const containerProps = {
			title: 'All About You',
			onClose: this.props.onClose,
		};

		if ( this.props.loadingCurrentUser ) {
			return (
				<Container { ...containerProps }>
					<p>Loading…</p>
				</Container>
			);
		}

		if ( ! currentUser ) {
			return (
				<Container { ...containerProps }>
					<p>Could not find details for user</p>
				</Container>
			);
		}

		return (
			<Container { ...containerProps }>
				<UserBlock user={ currentUser } />

				<ul>
					<li><LinkButton onClick={ () => this.props.onViewProfile( currentUser.id ) }>View your profile →</LinkButton></li>
					<li><Link href={ currentUser.link }>View all posts →</Link></li>
					<li><LinkButton onClick={ () => this.props.onViewComments( currentUser.id ) }>View all comments →</LinkButton></li>
				</ul>

				<Button onClick={ this.props.onLogOut }>Log out</Button>

				<UserSettings />

				{ Object.keys( FEATURES ).length ? (
					<Fragment>
						<h3 className="normal-case">Beta Features</h3>
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
					</Fragment>
				) : null }
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
		onViewComments: id => dispatch( showSidebarComments( id ) ),
		onViewProfile: id => dispatch( showSidebarProfile( id ) ),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withCurrentUser( MetaSidebar )
);

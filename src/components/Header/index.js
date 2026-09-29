import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCurrentUser } from '../../hocs';
import SearchInput from '../SearchInput';
import NetworkSearchInput from '../Super/SearchInput';
import { getNetwork } from '../Super/util';

import CurrentUser from './CurrentUser';
import Logo from './Logo';

const SUPER_BUTTON_CLASSES = [
	'w-[min(30%,360px)] text-white p-0 pr-5 flex items-center border-none font-inherit text-base cursor-pointer',
	'hover:border-none hover:text-white/60 focus:border-none focus:text-white/60',
	'[&:hover_.hm-logo]:opacity-60 [&:focus_.hm-logo]:opacity-60',
].join( ' ' );

export class Header extends Component {
	render() {
		const { superActive } = this.props;
		const network = getNetwork();

		return (
			<div className="Header bg-hm-light-grey flex-1">
				<div className="flex flex-row pr-5 max-[600px]:pr-1.5">
					<button
						aria-expanded={ superActive }
						className={ [
							SUPER_BUTTON_CLASSES,
							superActive ? 'bg-brand-dark' : 'bg-brand',
						].join( ' ' ) }
						title={ network ? 'Switch site or search the network' : 'Site overview' }
						type="button"
						onClick={ this.props.onShowSuper }
					>
						<Logo />

						{ network ? network.name : window.H2Data.site.name }
					</button>

					<Slot name="Header.buttons" />

					{ superActive && network ? (
						<NetworkSearchInput
							autoFocus
							className="hidden sm:block"
						/>
					) : (
						<SearchInput
							className="hidden sm:block"
							value={ this.props.searchValue }
							onSearch={ this.props.onSearch }
						/>
					) }

					<Slot name="Header.secondary_buttons" />

					{ this.props.currentUser ? (
						<div className="ml-auto flex items-center self-center max-[782px]:scale-90">
							<CurrentUser
								user={ this.props.currentUser }
								onLogOut={ this.props.onLogOut }
							/>
						</div>
					) : null }

					<Slot name="Header.meta" />
				</div>
			</div>
		);
	}
}

Header.defaultProps = {
	searchValue: '',
	superActive: false,
};

Header.propTypes = {
	searchValue: PropTypes.string,
	superActive: PropTypes.bool,
	onLogOut: PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
	onShowSuper: PropTypes.func.isRequired,
};

export default withCurrentUser( Header );

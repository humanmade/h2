import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCurrentUser } from '../../hocs';
import NetworkSearchInput from '../Super/SearchInput';
import { getNetwork } from '../Super/util';

import CurrentUser from './CurrentUser';
import Logo from './Logo';

const ICON_BUTTON_CLASSES = [
	'flex items-center justify-center shrink-0 self-stretch w-11 p-0 m-0 border-0 cursor-pointer',
	'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white',
].join( ' ' );

const SUPER_BUTTON_CLASSES = [
	'min-w-0 text-white p-0 pr-3 flex items-center border-none font-inherit text-base cursor-pointer',
	'min-[800px]:w-[min(30%,360px)] min-[800px]:pr-5',
	'hover:border-none hover:text-white/60 focus:border-none focus:text-white/60',
	'[&:hover_.hm-logo]:opacity-60 [&:focus_.hm-logo]:opacity-60',
].join( ' ' );

export class Header extends Component {
	render() {
		const { superActive } = this.props;
		const network = getNetwork();

		// Tint the header with the brand colour while the search is network-wide.
		// The tint sits on white, as the header needs to stay opaque over the overlay.
		const networkSearch = superActive && !! network;

		return (
			<div
				className={ [
					'Header flex-1 transition-colors duration-150',
					networkSearch ? 'bg-white' : 'bg-hm-light-grey',
				].join( ' ' ) }
			>
				<div
					className={ [
						'flex flex-row pr-5 max-[600px]:pr-1.5 transition-colors duration-150',
						networkSearch ? 'bg-brand/5' : '',
					].filter( Boolean ).join( ' ' ) }
				>
					<button
						aria-controls="h2-sidebar"
						aria-expanded={ this.props.sidebarOpen }
						aria-label="Menu"
						className={ ICON_BUTTON_CLASSES + ( superActive ? ' bg-brand-dark' : ' bg-brand hover:bg-brand-dark' ) + ' text-white min-[800px]:hidden' }
						type="button"
						onClick={ this.props.onToggleSidebar }
					>
						<svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
							<path d="M3 5.5h14M3 10h14M3 14.5h14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
						</svg>
					</button>

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

						<span className="truncate">
							{ network ? network.name : window.H2Data.site.name }
						</span>
					</button>

					<Slot name="Header.buttons" />

					<NetworkSearchInput
						key={ superActive ? 'open' : 'closed' }
						autoFocus={ superActive }
						className="hidden sm:block"
					/>

					<button
						aria-label={ network ? 'Search' : 'Site overview' }
						className={ ICON_BUTTON_CLASSES + ' ml-auto bg-transparent text-hm-dark-grey hover:bg-black/5 focus-visible:outline-hm-vibrant-blue sm:hidden' }
						type="button"
						onClick={ this.props.onShowSuper }
					>
						<svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
							<circle cx="8.5" cy="8.5" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
							<path d="m12.5 12.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
						</svg>
					</button>

					<Slot name="Header.secondary_buttons" />

					{ this.props.currentUser ? (
						<div className="ml-auto max-sm:ml-1 flex items-center self-center shrink-0 max-[782px]:scale-90">
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
	sidebarOpen: false,
	superActive: false,
	onToggleSidebar: () => {},
};

Header.propTypes = {
	sidebarOpen: PropTypes.bool,
	superActive: PropTypes.bool,
	onLogOut: PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onShowSuper: PropTypes.func.isRequired,
	onToggleSidebar: PropTypes.func,
};

export default withCurrentUser( Header );

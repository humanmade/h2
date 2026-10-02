import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hideSuperSidebar } from '../../actions';
import { getChangesForUser } from '../../changelog';
import { withCurrentUser } from '../../hocs';
import Button from '../Button';
import Notification from '../Notification';
import Overlay from '../Overlay';
import Shortcuts from '../Shortcuts';

import Search from './Search';
import NetworkSearchInput from './SearchInput';
import SiteSwitcher, { SiteCard } from './SiteSwitcher';
import { getNetwork } from './util';

// Invert along with the button, so the count stays readable on hover.
const BADGE_CLASSES = [
	'inline-block ml-2 rounded-full h-4 min-w-4 px-1 align-middle',
	'text-xs leading-4 text-center font-normal',
	'bg-hm-vibrant-blue text-white transition-colors duration-200 ease-in-out',
	'group-hover:bg-white group-hover:text-hm-vibrant-blue',
	'group-focus:bg-white group-focus:text-hm-vibrant-blue',
].join( ' ' );

/**
 * Full-screen overlay for switching sites and searching the network.
 *
 * Opens beneath the header, so that the header's search input stays available
 * and becomes a network-wide search while the overlay is open.
 */
export class SuperOverlay extends Component {
	state = {
		top: 0,
	}

	componentDidMount() {
		this.updateOffset();
		window.addEventListener( 'resize', this.updateOffset );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.updateOffset );
	}

	/**
	 * Position the overlay directly beneath the header.
	 */
	updateOffset = () => {
		const header = this.props.headerRef && this.props.headerRef.current;
		const top = header ? Math.max( 0, Math.round( header.getBoundingClientRect().bottom ) ) : 0;
		if ( top !== this.state.top ) {
			this.setState( { top } );
		}
	}

	renderSingleSite() {
		const { site } = window.H2Data;

		return (
			<div>
				<Notification type="status">
					This site isn't part of a network, so there are no other sites to switch to.
				</Notification>
				<ul className="list-none m-0 mt-6 p-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<SiteCard
						current
						site={ {
							id: 0,
							name: site.name,
							description: site.description,
							url: site.home,
						} }
					/>
				</ul>
			</div>
		);
	}

	render() {
		const { currentUser, search, onClose } = this.props;
		const network = getNetwork();
		const term = network ? search.trim() : '';
		const newChanges = ( currentUser && getChangesForUser( currentUser ) ) || [];

		return (
			<div
				aria-label={ network ? `${ network.name }: switch site or search` : 'Site overview' }
				className="Super fixed inset-x-0 bottom-0 z-20 overflow-y-auto bg-white animate-super-in"
				role="dialog"
				style={ { top: this.state.top } }
			>
				<Overlay onClick={ onClose } />
				<Shortcuts
					keys={ {
						esc: {
							allowInInput: true,
							callback: onClose,
						},
					} }
				/>

				<div className="max-w-300 mx-auto px-5 py-6 max-[600px]:px-4">
					<header className="flex flex-wrap items-center gap-3 mb-6">
						<h2 className="m-0 mr-auto text-2xl font-bold leading-tight">
							{ network ? network.name : window.H2Data.site.name }
						</h2>

						<Button
							className="group shrink-0 m-0!"
							onClick={ this.props.onShowChanges }
						>
							What's New?
							{ newChanges.length > 0 && (
								<span className={ BADGE_CLASSES }>
									{ newChanges.length }
								</span>
							) }
						</Button>

						<Button
							className="shrink-0 m-0!"
							onClick={ onClose }
						>
							Close
						</Button>

						{ network && (
							<NetworkSearchInput
								autoFocus
								className="basis-full sm:hidden"
								small
							/>
						) }
					</header>

					{ ! network ? (
						this.renderSingleSite()
					) : term ? (
						<Search term={ term } />
					) : (
						<SiteSwitcher />
					) }
				</div>
			</div>
		);
	}
}

SuperOverlay.propTypes = {
	currentUser: PropTypes.object,
	headerRef: PropTypes.shape( {
		current: PropTypes.any,
	} ),
	search: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	onShowChanges: PropTypes.func.isRequired,
};

export default connect(
	state => ( {
		search: state.ui.superSearch,
	} ),
	dispatch => ( {
		onClose: () => dispatch( hideSuperSidebar() ),
	} )
)( withCurrentUser( SuperOverlay ) );

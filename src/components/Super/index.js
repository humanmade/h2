import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hideSuperSidebar } from '../../actions';
import { getChangesForUser } from '../../changelog';
import { withCurrentUser } from '../../hocs';
import Notification from '../Notification';
import Overlay from '../Overlay';
import Shortcuts from '../Shortcuts';

import Search from './Search';
import NetworkSearchInput from './SearchInput';
import SiteSwitcher, { SiteCard } from './SiteSwitcher';
import { getNetwork } from './util';

const TOOL_BUTTON_CLASSES = [
	'flex items-center gap-2 shrink-0',
	'bg-transparent border border-solid border-hm-beige rounded-sm',
	'px-3 py-1.5 text-sm text-black cursor-pointer',
	'hover:bg-hm-beige/50 focus:bg-hm-beige/50 focus:outline-hidden',
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

				<div className="max-w-[1200px] mx-auto px-5 py-6 max-[600px]:px-4">
					<header className="flex flex-wrap items-center gap-3 mb-6">
						<h2 className="m-0 mr-auto text-2xl font-bold leading-tight">
							{ network ? network.name : window.H2Data.site.name }
						</h2>

						<button
							className={ TOOL_BUTTON_CLASSES }
							type="button"
							onClick={ this.props.onShowChanges }
						>
							<i className="icon icon--mail size-4!" />
							<span>What's New?</span>
							{ newChanges.length > 0 && (
								<span className="inline-block rounded-full bg-hm-vibrant-blue text-white text-xs leading-4 h-4 min-w-4 px-1 text-center">
									{ newChanges.length }
								</span>
							) }
						</button>

						<button
							aria-label="Close"
							className={ TOOL_BUTTON_CLASSES }
							title="Close (Esc)"
							type="button"
							onClick={ onClose }
						>
							<i className="icon icon--close size-4!" />
						</button>

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

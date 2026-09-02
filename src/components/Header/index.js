import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCurrentUser } from '../../hocs';
import SearchInput from '../SearchInput';

import CurrentUser from './CurrentUser';
import HeaderButton from './HeaderButton';
import Logo from './Logo';

export class Header extends Component {
	render() {

		return (
			<div className="bg-hm-light-grey flex-1">
				<div className="flex flex-row pr-5 max-[600px]:pr-1.5">
					<button
						className="bg-brand w-[min(30%,360px)] text-white p-0 pr-5 flex items-center border-none font-inherit text-base cursor-pointer hover:border-none hover:text-white/60 focus:border-none focus:text-white/60 [&:hover_.hm-logo]:opacity-60 [&:focus_.hm-logo]:opacity-60"
						type="button"
						onClick={ this.props.onShowSuper }
					>
						<Logo />

						{ window.H2Data.network ? window.H2Data.network.name : window.H2Data.site.name }
					</button>

					<Slot name="Header.buttons" />

					<SearchInput
						className="hidden sm:block"
						value={ this.props.searchValue }
						onSearch={ this.props.onSearch }
					/>

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
};

Header.propTypes = {
	searchValue: PropTypes.string,
	onLogOut: PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
};

export default withCurrentUser( Header );

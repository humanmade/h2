import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import { User } from '../../shapes';
import { getUserCommentsUrl } from '../../util';
import Avatar from '../Avatar';
import Link from '../Link';

import TimezoneSetting from './TimezoneSetting';

const ITEM_CLASSES = [
	'flex items-center w-full m-0 px-4 py-2 border-0 bg-transparent text-left text-sm text-hm-dark-grey! cursor-pointer',
	'hover:bg-hm-light-grey hover:no-underline! focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hm-vibrant-blue',
].join( ' ' );

export default function CurrentUser( props ) {
	const { user, onLogOut } = props;
	const [ open, setOpen ] = useState( false );
	const containerRef = useRef( null );
	const buttonRef = useRef( null );

	useEffect( () => {
		if ( ! open ) {
			return;
		}

		const onPointerDown = e => {
			if ( containerRef.current && ! containerRef.current.contains( e.target ) ) {
				setOpen( false );
			}
		};
		const onKeyDown = e => {
			if ( e.key === 'Escape' ) {
				setOpen( false );
				if ( buttonRef.current ) {
					buttonRef.current.focus();
				}
			}
		};

		document.addEventListener( 'mousedown', onPointerDown );
		document.addEventListener( 'touchstart', onPointerDown );
		document.addEventListener( 'keydown', onKeyDown );
		return () => {
			document.removeEventListener( 'mousedown', onPointerDown );
			document.removeEventListener( 'touchstart', onPointerDown );
			document.removeEventListener( 'keydown', onKeyDown );
		};
	}, [ open ] );

	if ( ! user ) {
		return null;
	}

	const close = () => setOpen( false );

	return (
		<div className="CurrentUser relative" ref={ containerRef }>
			<button
				aria-controls="h2-account-menu"
				aria-expanded={ open }
				aria-label="Your account"
				className="block p-0 m-0 bg-transparent border-0 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue"
				ref={ buttonRef }
				type="button"
				onClick={ () => setOpen( ! open ) }
			>
				<Avatar
					size={ 40 }
					url={ user.avatar_urls['96'] }
				/>
			</button>

			{ open && (
				<div
					className="absolute right-0 top-full z-40 mt-2 w-72 max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg border border-hm-beige bg-white text-sm text-hm-dark-grey shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
					id="h2-account-menu"
				>
					<div className="flex items-center gap-3 px-4 py-3 border-b border-hm-beige">
						<Avatar
							className="shrink-0"
							size={ 40 }
							url={ user.avatar_urls['96'] }
						/>
						<div className="min-w-0">
							<p className="m-0 font-semibold leading-5 truncate">{ user.name }</p>
							<p className="m-0 text-xs leading-5 text-gray-500 truncate">@{ user.slug }</p>
						</div>
					</div>

					<ul className="list-none m-0 py-1 px-0" onClick={ close }>
						<li>
							<Link className={ ITEM_CLASSES } href={ user.link }>
								Your profile
							</Link>
						</li>
						<li>
							<Link className={ ITEM_CLASSES } href={ user.link }>
								Your posts
							</Link>
						</li>
						<li>
							<Link className={ ITEM_CLASSES } href={ getUserCommentsUrl( user ) }>
								Your comments
							</Link>
						</li>
					</ul>

					<div className="px-4 py-3 border-t border-hm-beige">
						<TimezoneSetting />
					</div>

					<div className="py-1 border-t border-hm-beige">
						<button className={ ITEM_CLASSES } type="button" onClick={ onLogOut }>
							Log out
						</button>
					</div>
				</div>
			) }
		</div>
	);
}

CurrentUser.propTypes = {
	user: User.isRequired,
	onLogOut: PropTypes.func.isRequired,
};

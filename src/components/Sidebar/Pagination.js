import React from 'react';

import NavigationButton from './NavigationButton';

export default function SidebarPagination( props ) {
	const { hasNext, hasPrevious, onNext, onPrevious } = props;
	if ( ! hasNext && ! hasPrevious ) {
		return null;
	}

	return (
		<nav className="Sidebar-Pagination flex items-center justify-between gap-2 border-t border-hm-beige px-2 py-3" aria-label="Sidebar pagination">
			<div>
				{ hasNext && (
					<NavigationButton iconOnly={ false } onClick={ onNext }>
						Older
					</NavigationButton>
				) }
			</div>
			{ hasPrevious && (
				<NavigationButton direction="right" iconOnly={ false } onClick={ onPrevious }>
					Newer
				</NavigationButton>
			) }
		</nav>
	);
}

import React from 'react';

import LinkButton from '../LinkButton';

const CLASSES = [
	// Back-compat:
	'Sidebar-Pagination',

	'flex items-baseline max-w-[20em]',
	'[&>div]:w-1/2',
	'[&_.cta]:text-[inherit] [&_.cta:after]:w-[1em]',
].join( ' ' );

export default function SidebarPagination( props ) {
	const { hasNext, hasPrevious, onNext, onPrevious } = props;
	return (
		<div className={ CLASSES }>
			{ hasNext && (
				<div>
					<LinkButton
						className="cta cta--small cta--arrow-left"
						onClick={ onNext }
					>Older</LinkButton>
				</div>
			) }
			{ hasPrevious && (
				<div className={ hasNext ? '' : 'ml-[50%]' }>
					<LinkButton
						className="cta cta--small cta--arrow"
						onClick={ onPrevious }
					>Newer</LinkButton>
				</div>
			) }
		</div>
	);
}

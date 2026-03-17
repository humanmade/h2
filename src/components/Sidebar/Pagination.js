import React from 'react';

import LinkButton from '../LinkButton';

export default function SidebarPagination( props ) {
	const { hasNext, hasPrevious, onNext, onPrevious } = props;
	return (
		<div className="Sidebar-Pagination grid grid-cols-2">
			{ hasNext && (
				<div>
					<LinkButton
						className="group pl-2 flex items-center"
						onClick={ onNext }
					>
						<span className="icon icon--arrow-right icon--blue !w-4 mr-2 rotate-180 transition-transform group-hover:-translate-x-2">&larr;</span>
						<span>Older</span>
					</LinkButton>
				</div>
			) }
			{ hasPrevious && (
				<div className="justify-self-end col-start-2">
					<LinkButton
						className="group pr-2 flex items-center"
						onClick={ onPrevious }
					>
						<span>Newer</span>
						<span className="icon icon--arrow-right icon--blue !w-4 ml-2 transition-transform group-hover:translate-x-2">&larr;</span>
					</LinkButton>
				</div>
			) }
		</div>
	);
}

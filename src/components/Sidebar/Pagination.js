import React from 'react';

import LinkButton from '../LinkButton';

import './Pagination.css';

export default function SidebarPagination( props ) {
	const { hasNext, hasPrevious, onNext, onPrevious } = props;
	return (
		<div className="Sidebar-Pagination pagination">
			{ hasNext && (
				<div className="Sidebar-Pagination__older">
					<LinkButton
						onClick={ onNext }
					>
						<i className="icon icon--arrow-left icon--small icon--red" />
						Older
					</LinkButton>
				</div>
			) }
			{ hasPrevious && (
				<div className="Sidebar-Pagination__newer">
					<LinkButton
						onClick={ onPrevious }
					>
						Newer
						<i className="icon icon--arrow-right icon--small icon--red" />
					</LinkButton>
				</div>
			) }
		</div>
	);
}

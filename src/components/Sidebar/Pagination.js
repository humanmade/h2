import React from 'react';

import LinkButton from '../LinkButton';

import './Pagination.css';

export default function SidebarPagination( props ) {
	const { hasNext, hasPrevious, onNext, onPrevious } = props;
	return (
		<div className="Sidebar-Pagination">
			{ hasNext && (
				<div className="Sidebar-Pagination__older">
					<LinkButton
						className="cta cta--small cta--arrow-left"
						onClick={ onNext }
					>Older</LinkButton>
				</div>
			) }
			{ hasPrevious && (
				<div className="Sidebar-Pagination__newer">
					<LinkButton
						className="cta cta--small cta--arrow"
						onClick={ onPrevious }
					>Newer</LinkButton>
				</div>
			) }
		</div>
	);
}

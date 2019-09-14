import React from 'react';

import Icon from '../Icon';
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
						<Icon type="arrow-left" />
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
						<Icon type="arrow-right" />
					</LinkButton>
				</div>
			) }
		</div>
	);
}

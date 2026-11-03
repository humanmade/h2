import React from 'react';

export default function CommentLoader() {
	return (
		<div className="Comment-Loader ml-16 max-[600px]:ml-8 pb-4" role="status" aria-label="Loading comments">
			<div className="relative motion-safe:animate-pulse" aria-hidden="true">
				<div className="absolute w-0.5 bg-hm-beige -left-[33px] max-[600px]:-left-5 top-2 bottom-0" />
				<div className="relative min-h-10 flex items-center -ml-12 max-[600px]:-ml-8">
					<div className="shrink-0 rounded-full bg-gray-200 w-8 h-8 mr-4 max-[600px]:w-6 max-[600px]:h-6 max-[600px]:mr-2" />
					<div className="grow min-w-0">
						<div className="bg-gray-200 rounded h-3.5 w-24 max-w-full" />
					</div>
					<div className="bg-gray-200 rounded h-2.5 w-20 ml-3" />
				</div>
				{ [ 'w-full', 'w-11/12', 'w-3/4' ].map( width => (
					<div className="h-7 flex items-center" key={ width }>
						<div className={ `bg-gray-200 rounded h-3 ${ width }` } />
					</div>
				) ) }
			</div>
		</div>
	);
}

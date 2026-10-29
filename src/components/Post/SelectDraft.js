import { withArchive } from '@humanmade/repress';
import React from 'react';
import { FormattedRelative } from 'react-intl';

import { posts } from '../../types';
import { decodeEntities } from '../../util';
import Button from '../Button';

class SelectDraft extends React.Component {
	state = {
		showingSelector: false,
	}

	onSelect = post => {
		const didSelect = this.props.onSelect( post );
		if ( didSelect === false ) {
			return;
		}

		this.setState( { showingSelector: false } );
	}

	onTrash = async post => {
		const trashed = await this.props.onTrash( post.id );
		if ( trashed ) {
			this.props.onLoad();
		}
	}

	onToggle = () => {
		if ( ! this.state.showingSelector ) {
			this.props.onLoad();
		}
		this.setState( state => ( { showingSelector: ! state.showingSelector } ) );
	}

	render() {
		const { deletingDraftId, isBusy, loading, posts, user } = this.props;
		const { showingSelector } = this.state;
		const panelId = `drafts-${ user.id }`;

		return (
			<React.Fragment>
				<Button
					aria-controls={ panelId }
					aria-expanded={ showingSelector }
					className="shrink-0"
					onClick={ this.onToggle }
				>
					Drafts
					{ posts && posts.length > 0 && (
						<span className="rounded-full bg-gray-100 text-gray-600 text-xs px-1.5 leading-5">{ posts.length }</span>
					) }
					<svg aria-hidden="true" className={ `w-3 h-3 transition-transform ${ showingSelector ? 'rotate-180' : '' }` } viewBox="0 0 12 7">
						<path d="M1 1 6 6 11 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Button>
				{ showingSelector && (
					<section
						aria-label="Your drafts"
						className="Post-SelectDraft basis-full min-w-0 mt-3 mb-2 rounded-md border border-hm-beige bg-white overflow-hidden"
						id={ panelId }
					>
						<div className="px-4 py-3 border-b border-hm-beige bg-hm-light-grey/50">
							<h3 className="m-0 text-sm font-semibold normal-case">Your drafts</h3>
						</div>
						{ loading || ! posts ? (
							<p className="m-0 px-4 py-4 text-sm text-gray-500" role="status">Loading drafts…</p>
						) : posts.length === 0 ? (
							<div className="px-4 py-4 text-sm">
								<p className="m-0 font-medium text-hm-dark-grey">No saved drafts yet.</p>
								<p className="m-0 mt-1 text-gray-500">Save a post to continue writing it later.</p>
							</div>
						) : (
							<ul className="list-none m-0 p-0 max-h-72 overflow-y-auto divide-y divide-hm-beige">
								{ posts.map( post => (
									<li className="flex items-center gap-2 pr-3" key={ post.id }>
										<button
											disabled={ isBusy }
											className="group flex items-center justify-between gap-4 grow min-w-0 m-0 border-0 bg-transparent px-4 py-3 text-left cursor-pointer hover:bg-hm-light-grey focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hm-vibrant-blue"
											type="button"
											onClick={ () => this.onSelect( post ) }
										>
											<span className="min-w-0">
												<span className="block text-sm font-medium text-hm-dark-grey break-words">{ decodeEntities( post.title.rendered ) || 'Untitled draft' }</span>
												<span className="block mt-1 text-xs text-gray-500">
													Last edited <FormattedRelative value={ ( post.modified_gmt || post.date_gmt ) + 'Z' } />
												</span>
											</span>
											<span aria-hidden="true" className="text-gray-400">→</span>
										</button>
										<Button
											aria-label={ `Move “${ decodeEntities( post.title.rendered ) || 'Untitled draft' }” to Trash` }
											className="shrink-0 text-[#b42318]! enabled:hover:bg-[#fef3f2]!"
											disabled={ isBusy }
											size="small"
											type="tertiary"
											onClick={ () => this.onTrash( post ) }
										>
											{ deletingDraftId === post.id ? 'Moving…' : 'Trash' }
										</Button>
									</li>
								) ) }
							</ul>
						) }
					</section>
				) }
			</React.Fragment>
		);
	}
}

export default withArchive(
	posts,
	state => state.posts,
	props => {
		const args = {
			status: 'draft',
			context: 'edit',
			author: props.user.id,
		};

		const id = `drafts/${ props.user.id }`;
		posts.registerArchive( id, args );
		return id;
	}
)( SelectDraft );

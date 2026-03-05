import { withArchive } from '@humanmade/repress';
import React from 'react';
import { FormattedRelative } from 'react-intl';

import { posts } from '../../types';
import Button from '../Button';
import Modal from '../Modal';

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

	render() {
		const { loading, posts } = this.props;

		if ( ! this.state.showingSelector ) {
			return (
				<Button
					onClick={ () => this.setState( { showingSelector: true } ) }
				>
					Drafts

					{ posts && (
						<span className="label__count">{ posts.length }</span>
					) }
				</Button>
			);
		}

		return (
			<Modal
				className="Post-SelectDraft"
				title="Your Drafts"
				onDismiss={ () => this.setState( { showingSelector: false } ) }
			>
				{ ( ! posts || loading ) ? (
					<p>Loading</p>
				) : posts.length === 0 ? (
					<p>No drafts found!</p>
				) : (
					<ul className="flex flex-col list-none mx-[-1rem] my-0 p-0">
						{ posts.map( post => (
							<li
								key={ post.id }
								className="flex justify-between items-center mb-[1em]"
							>
								<button
									className="bg-transparent border-none cursor-pointer text-left grow py-[0.5rem] px-[0.5em] hover:bg-brand hover:text-white"
									title={ `Edit "${ post.title.rendered }"` }
									type="button"
									onClick={ () => this.onSelect( post ) }
								>
									<span
										className="block"
										dangerouslySetInnerHTML={ { __html: post.title.rendered } }
									/>
									<span className="opacity-70 text-[0.75em]">
										{ 'Last edited ' }
										<FormattedRelative value={ post.date_gmt + 'Z' } />
									</span>
								</button>
							</li>
						) ) }
					</ul>
				) }
			</Modal>
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

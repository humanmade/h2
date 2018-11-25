import React from 'react';
import { FormattedRelative } from 'react-intl';

import Button from '../Button';
import Modal from '../Modal';
import { withApiData } from '../../with-api-data';

import './SelectDraft.css';

class SelectDraft extends React.Component {
	state = {
		showingSelector: false,
	}

	onSelect = post => {
		this.setState( { showingSelector: false } );
		this.props.onSelect( post );
	}

	render() {
		const { data, isLoading } = this.props.drafts;

		if ( ! this.state.showingSelector ) {
			return (
				<Button
					onClick={ () => this.setState( { showingSelector: true } ) }
				>
					Drafts

					{ data && (
						<span className="label__count">{ data.length }</span>
					) }
				</Button>
			);
		}

		return (
			<Modal
				className="Post-SelectDraft"
				title="Drafts"
				onDismiss={ () => this.setState( { showingSelector: false } ) }
			>
				{ isLoading ? (
					<p>Loading</p>
				) : data.length === 0 ? (
					<p>No drafts found!</p>
				) : (
					<ul className="Post-SelectDraft__list">
						{ data.map( post => (
							<li
								key={ post.id }
								className="Post-SelectDraft__draft"
							>
								<button
									className="Post-SelectDraft__draft-main"
									title={ `Edit "${ post.title.rendered }"` }
									type="button"
									onClick={ () => this.onSelect( post ) }
								>
									<span
										className="Post-SelectDraft__draft-title"
										dangerouslySetInnerHTML={ { __html: post.title.rendered } }
									/>
									<span className="Post-SelectDraft__draft-meta">
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

export default withApiData( () => ( {
	drafts: '/wp/v2/posts?status=draft&context=edit',
} ) )( SelectDraft );

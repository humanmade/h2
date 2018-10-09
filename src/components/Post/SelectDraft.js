import React from 'react';

import Button from '../Button';
import Modal from '../Modal';
import { withApiData } from '../../with-api-data';

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
					Resume Existing Draft
				</Button>
			);
		}

		return (
			<Modal
				title="Select draft to resume editing"
				onDismiss={ () => this.setState( { showingSelector: false } ) }
			>
				{ isLoading ? (
					<p>Loading</p>
				) : data.length === 0 ? (
					<p>No drafts found!</p>
				) : (
					<ul>
						{ data.map( post => (
							<li key={ post.id }>
								<span
									dangerouslySetInnerHTML={ { __html: post.title.rendered } }
								/>
								<Button
									onClick={ () => this.onSelect( post ) }
								>Edit</Button>
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

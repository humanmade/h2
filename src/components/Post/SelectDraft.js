import React from 'react';

import Button from '../Button';
import Modal from '../Modal';
import { withApiData } from '../../with-api-data';

class SelectDraft extends React.Component {
	state = {
		showingSelector: false,
	}

	render() {
		const { onSelect } = this.props;
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
									onClick={ () => onSelect( post ) }
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
	drafts: '/wp/v2/posts?status=draft',
} ) )( SelectDraft );

import { withArchive, withSingle } from '@humanmade/repress';
import React, { Component } from 'react';
import { compose } from 'redux';

import { withUser } from '../../hocs';
import { pages } from '../../types';
import { decodeEntities } from '../../util';
import Error404 from '../Error404';
import PageTitle from '../PageTitle';
import Loader from '../Post/Loader';

import Page from './index';

const ConnectedPage = compose(
	withSingle(
		pages,
		state => state.pages,
		props => props.post.id
	),
	withUser( props => props.post.author )
)( Page );

class Container extends Component {
	render() {
		if ( this.props.loading ) {
			return (
				<PageTitle title="Loading…">
					<div className="PostsList">
						{ /* Show the page header and content loading */ }
						<Loader showActions={ false } />
					</div>
				</PageTitle>
			);
		}
		if ( ! this.props.posts || ! this.props.posts[0] ) {
			return (
				<PageTitle title="Not Found">
					<div className="PostsList">
						<Error404>
							<p>No page found at this address.</p>
						</Error404>
					</div>
				</PageTitle>
			);
		}

		const page = this.props.posts[0];
		const title = decodeEntities( page.title.rendered );

		return (
			<PageTitle title={ title }>
				<div className="PostsList">
					<div className="PostsList--settings" />
					<ConnectedPage
						post={ page }
					/>
				</div>
			</PageTitle>
		);
	}
}

export default withArchive(
	pages,
	state => state.pages,
	props => pages.idForPath( props.match.params.pageName )
)( Container );

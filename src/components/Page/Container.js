import { withArchive } from '@humanmade/repress';
import React, { Component } from 'react';

import Page from './index';
import Loader from '../Post/Loader';
import PageTitle from '../PageTitle';
import { withUsers } from '../../hocs';
import { pages } from '../../types';
import { decodeEntities } from '../../util';

class Container extends Component {
	state = {
		containerWidth: 740,
	}

	onUpdateWidth = ref => {
		if ( ! ref ) {
			return;
		}

		this.setState( {
			containerWidth: ref.clientWidth,
		} );
	}

	render() {
		if ( this.props.loading ) {
			return (
				<PageTitle title="Loading…">
					<div className="PostsList">
						{/* Dummy div to measure width */}
						<div ref={ this.onUpdateWidth } />

						{ /* Show two faux posts loading */ }
						<Loader width={ this.state.containerWidth } />
						<Loader width={ this.state.containerWidth } />
					</div>
				</PageTitle>
			);
		}
		if ( ! this.props.posts || ! this.props.posts[0] ) {
			return (
				<PageTitle title="Not Found">
					<div className="PostsList">
						Error
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
					<Page
						post={ page }
					/>
				</div>
			</PageTitle>
		);
	}
}

const ConnectedPostsList = withArchive(
	pages,
	state => state.pages,
	props => pages.idForPath( props.match.params.pageName )
)( Container );

export default withUsers( ConnectedPostsList );

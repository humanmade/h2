import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Slot } from 'react-slot-fill';

import {
	Category as CategoryShape,
	Post as PostShape,
	User as UserShape,
} from '../../shapes';
import { decodeEntities } from '../../util';
import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';

import AuthorLink from './AuthorLink';

import './Header.css';

export class MessageHeader extends React.Component {
	componentDidUpdate() {
		this.onUpdateLayout();
	}

	onUpdateLayout() {
		if ( ! this.ref || ! this.props.onUpdateHeight ) {
			return;
		}

		this.props.onUpdateHeight( this.ref.offsetHeight );
	}

	onUpdateRef = ref => {
		this.ref = ref;
		this.onUpdateLayout();
	}

	render() {
		const { author, authors, categories, post } = this.props;
		const { children, constrainTitle, sticky, collapsed, onCollapse, ...fillProps } = this.props;
		const displayedAuthors = authors.length ? authors : [ author ].filter( Boolean );
		const primaryAuthor = displayedAuthors[0];

		const classes = [
			'Message-Header',
			constrainTitle && 'Message-Header--constrained',
			sticky && 'Message-Header--sticky',
		];

		return (
			<header
				className={ classes.filter( Boolean ).join( ' ' ) }
				ref={ this.onUpdateRef }
			>
				<div>
					<Avatar
						url={ primaryAuthor ? primaryAuthor.avatar_urls['96'] : '' }
						user={ primaryAuthor }
						size={ 60 }
					/>
					{ ! collapsed && onCollapse ? (
						<button
							className="Message-Header__Collapse-Button"
							onClick={ onCollapse }
						>
							<i className="icon icon--close icon--black" />
							<span className="screen-reader-text">Collapse post</span>
						</button>
					) : null }
				</div>
				<div className="Message-Header__byline">
					<Link
						disablePreviews
						href={ post.link }
					>
						<h2 className="Message-Header__title">
							{ decodeEntities( post.title.rendered ) }
						</h2>
					</Link>
					<span className="Message-Header__date">
						{ displayedAuthors.map( ( item, index ) => (
							<Fragment key={ item.id }>
								{ index > 0 ? ' with ' : '' }
								<AuthorLink user={ item }>{ item.name }</AuthorLink>
							</Fragment>
						) ) },&nbsp;
						<FormattedDate date={ post.date_gmt + 'Z' } />
					</span>
					{ categories.length > 0 && (
						<ul className="Message-Header__categories">
							{ categories.map( category => (
								<li key={ category.id }>
									<Link href={ category.link }>
										{ decodeEntities( category.name ) }
									</Link>
								</li>
							) ) }
						</ul>
					) }
					{ post.status === 'draft' && (
						<span className="Message-Header__status">
							<span role="img" aria-label="">🔒</span>
							Unpublished
						</span>
					) }
					<Slot name="Post.byline" fillChildProps={ fillProps } />
				</div>
				{ children }
			</header>
		);
	}
}

MessageHeader.defaultProps = {
	authors: [],
	collapsed: false,
	constrainTitle: false,
	sticky: true,
};

MessageHeader.propTypes = {
	author: UserShape.isRequired,
	authors: PropTypes.arrayOf( UserShape ),
	categories: PropTypes.arrayOf( CategoryShape ).isRequired,
	collapsed: PropTypes.bool,
	onCollapse: PropTypes.func,
	constrainTitle: PropTypes.bool,
	post: PostShape.isRequired,
	sticky: PropTypes.bool,
	onUpdateHeight: PropTypes.func,
};

export default function AdapatableMessageHeader( props ) {
	const [ height, setHeight ] = useState( null );

	if ( ! height || height <= 99 ) {
		return (
			<MessageHeader
				{ ...props }
				onUpdateHeight={ setHeight }
			/>
		);
	}
	return (
		<Fragment>
			<MessageHeader
				{ ...props }
				sticky={ false }
				onUpdateHeight={ setHeight }
			/>
			<MessageHeader
				{ ...props }
				constrainTitle
				sticky
			/>
		</Fragment>
	);
}

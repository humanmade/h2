import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';

import AuthorLink from './AuthorLink';
import Avatar from '../Avatar';
import Link from '../Link';
import {
	Category as CategoryShape,
	Post as PostShape,
	User as UserShape,
} from '../../shapes';
import { decodeEntities } from '../../util';

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
		const { author, categories, post } = this.props;
		const { children, constrainTitle, sticky, ...fillProps } = this.props;

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
				<Avatar
					url={ author ? author.avatar_urls['96'] : '' }
					user={ author }
					size={ 60 }
				/>
				<div className="Message-Header__byline">
					<Link href={ post.link }>
						<h2 className="Message-Header__title">
							{ decodeEntities( post.title.rendered ) }
						</h2>
					</Link>
					<span className="Message-Header__date">
						{ author ? (
							<AuthorLink user={ author }>{ author.name }</AuthorLink>
						) : ''},&nbsp;
						<time
							dateTime={ post.date_gmt + 'Z' }
							title={ post.date_gmt + 'Z' }
						>
							<FormattedRelative value={ post.date_gmt + 'Z' } />
						</time>
					</span>
					{categories.length > 0 &&
						<ul className="Message-Header__categories">
							{ categories.map( category => (
								<li key={ category.id }>
									<Link href={ category.link }>{ category.name }</Link>
								</li>
							) ) }
						</ul>
					}
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
	constrainTitle: false,
	sticky: true,
};

MessageHeader.propTypes = {
	author: UserShape.isRequired,
	categories: PropTypes.arrayOf( CategoryShape ).isRequired,
	collapsed: PropTypes.bool.isRequired,
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

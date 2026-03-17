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
		const { author, categories, post } = this.props;
		const { children, constrainTitle, sticky, collapsed, onCollapse, ...fillProps } = this.props;

		const classes = [
			'Message-Header',
			'top-0 py-[15px] bg-white flex items-start min-[600px]:min-h-[99px]',

			// Mobile:
			'max-[600px]:-mx-5 max-[600px]:px-5 max-[600px]:py-2 max-[600px]:flex-row-reverse max-[600px]:[&_.Post\\\\_\\\\_actions]:hidden',

			sticky ? 'Message-Header--sticky sticky z-[5]' : 'relative z-[6]',
			constrainTitle && 'Message-Header--constrained h-[99px]',
		];

		const titleClasses = [
			'text-[1.333333333rem] leading-[1.2] font-bold mt-0 mr-[0.5em] mb-[10px] ml-0 [text-transform:inherit]',
			constrainTitle && 'whitespace-nowrap text-ellipsis overflow-hidden',
		].filter( Boolean ).join( ' ' );

		return (
			<header
				className={ classes.filter( Boolean ).join( ' ' ) }
				ref={ this.onUpdateRef }
			>
				<div className="flex flex-col items-end">
					<Avatar
						className="mr-[30px] w-[3.333rem] h-[3.333rem] rounded-full self-start max-[600px]:ml-2 max-[600px]:mr-0 max-[600px]:!w-[24px] max-[600px]:!h-[24px]"
						imgClassName="max-[600px]:!w-[24px] max-[600px]:!h-[24px]"
						url={ author ? author.avatar_urls['96'] : '' }
						user={ author }
						size={ 60 }
					/>
					{ ! collapsed && onCollapse ? (
						<button
							className={ [
								'Message-Header__Collapse-Button',
								'group hidden items-center w-6 h-6 p-0 cursor-pointer bg-black/[0.02] border-2 border-solid border-black/10 rounded-full transition-[border-color] duration-100',
								'max-[600px]:flex',
								'hover:border-black/40 hover:duration-200 focus:border-black/40 focus:duration-200',
							].join( ' ' ) }
							onClick={ onCollapse }
						>
							<i
								className="icon icon--close icon--black w-6 opacity-30 transition-opacity duration-100 group-hover:opacity-80 group-hover:duration-200 group-focus:opacity-80 group-focus:duration-200"
							/>
							<span className="screen-reader-text">Collapse post</span>
						</button>
					) : null }
				</div>
				<div className="grow min-w-0 overflow-hidden leading-[1.1]">
					<Link
						className="text-inherit hover:no-underline"
						disablePreviews
						href={ post.link }
					>
						<h2 className={ titleClasses }>
							{ decodeEntities( post.title.rendered ) }
						</h2>
					</Link>
					<span className="inline-block mr-2 text-[#AAA] text-[14px]">
						{ author ? (
							<AuthorLink user={ author }>{ author.name }</AuthorLink>
						) : '' },&nbsp;
						<FormattedDate date={ post.date_gmt + 'Z' } />
					</span>
					{ categories.length > 0 && (
						<ul className="Message-Header__categories list-none m-0 p-0 inline text-[14px]">
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
						<span className="text-[14px] ml-2">
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
	collapsed: false,
	constrainTitle: false,
	sticky: true,
};

MessageHeader.propTypes = {
	author: UserShape.isRequired,
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

import PropTypes from 'prop-types';
import React from 'react';
import { Slot } from 'react-slot-fill';

import {
	Category as CategoryShape,
	Post as PostShape,
	User as UserShape,
} from '../../shapes';
import { decodeEntities } from '../../util';
import Editor from '../Editor/LazyEditor';
import Notification from '../Notification';

import MessageContent from './Content';

import './Main.css';

export default function MessageMain( props ) {
	const { collapsed, post } = props;
	const {
		children,
		isEditing,
		editedTitle,
		isLoading,
		isSubmitting,
		onCancelEdit,
		onSubmitEditing,
		...fillProps
	} = props;

	const classes = [
		'ml-16 max-[600px]:ml-0',
		collapsed && 'Message-Main--collapsed min-h-[70px] max-h-[190px] overflow-hidden relative after:block after:content-[""] after:absolute after:inset-0 after:top-auto after:h-[70px]',
	];

	return (
		<div className={ classes.filter( Boolean ).join( ' ' ) }>
			<Slot name="Post.before_content" fillChildProps={ fillProps } />
			{ isEditing ? (
				isLoading ? (
					<Notification>Loading…</Notification>
				) : (
					<Editor
						initialValue={ post.unprocessed_content || post.content.raw }
						placeholder="Write your post…"
						initialTitle={ post.title.raw !== undefined ? post.title.raw : decodeEntities( post.title.rendered ) }
						title={ editedTitle }
						isSubmitting={ isSubmitting }
						submitText={ isSubmitting ? 'Updating…' : 'Update' }
						onCancel={ onCancelEdit }
						onSubmit={ onSubmitEditing }
					/>
				)
			) : (
				<MessageContent html={ post.content.rendered } />
			) }
			<Slot name="Post.after_content" fillChildProps={ fillProps } />
			<Slot name="Post.footer_actions" fillChildProps={ fillProps }>
				{ items => (
					<div className={ [
						'Post-footer-actions clear-both flex mt-4 justify-between items-start min-[600px]:[&_.Post\\_\\_actions]:hidden',
						! items.length && 'min-[600px]:hidden',
					].filter( Boolean ).join( ' ' ) }>
						{ children }
						{ items }
					</div>
				) }
			</Slot>
		</div>
	);
}

MessageMain.propTypes = {
	author: UserShape.isRequired,
	categories: PropTypes.arrayOf( CategoryShape ).isRequired,
	collapsed: PropTypes.bool.isRequired,
	post: PostShape.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	onCancelEdit: PropTypes.func,
	onSubmitEditing: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';
import React from 'react';
import { Slot } from 'react-slot-fill';

import {
	Category as CategoryShape,
	Post as PostShape,
	User as UserShape,
} from '../../shapes';
import Editor from '../Editor';
import Notification from '../Notification';

import MessageContent from './Content';

import './Main.css';

export default function MessageMain( props ) {
	const { collapsed, post } = props;
	const {
		children,
		isEditing,
		isLoading,
		isSubmitting,
		onCancelEdit,
		onSubmitEditing,
		...fillProps
	} = props;

	const classes = [
		'Message-Main',
		collapsed && 'Message-Main--collapsed',
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
						submitText={ isSubmitting ? 'Updating…' : 'Update' }
						onCancel={ onCancelEdit }
						onSubmit={ onSubmitEditing }
					/>
				)
			) : (
				<MessageContent html={ post.content.rendered } />
			) }
			<Slot name="Post.after_content" fillChildProps={ fillProps } />
			<div className="Post-footer-actions">
				{ children }
				<Slot name="Post.footer_actions" fillChildProps={ fillProps } />
			</div>
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

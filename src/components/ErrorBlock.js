import React from 'react';
import './ErrorBlock.css';

export default function ErrorBlock( props ) {
	return <div className="ErrorBlock">{props.message}</div>;
}

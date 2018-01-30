import React from 'react';
import { Link } from 'react-router-dom';

export default function RelativeLink( { to, children } ) {
	return <Link to={ to.replace( /^(?:\/\/|[^/]+)*\//, '/' ) }>{ children }</Link>
}

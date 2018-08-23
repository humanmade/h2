import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

const SITE_NAME = window.H2Data.site.name;

class PageTitle extends React.Component {
	render() {
		if ( this.props.children ) {
			return React.Children.only( this.props.children );
		} else {
			return null;
		}
	}
}

PageTitle.propTypes = {
	title: PropTypes.string,
};

const reducePropsToState = propsList => {
	const innermostProps = propsList[ propsList.length - 1 ];
	if ( innermostProps ) {
		return innermostProps.title;
	}
}

const handleChange = title => {
	document.title = title ? `${ title } - ${ SITE_NAME }` : SITE_NAME;
};

export default withSideEffect(
	reducePropsToState,
	handleChange
)( PageTitle );

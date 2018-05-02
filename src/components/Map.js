import React from 'react';

const MAPBOX_BASE = 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/static';

export default function Map( props ) {
	const { height, location, width, zoom } = props;

	const args = `access_token=${ window.H2Data.site.mapbox_key }`;
	const marker = `pin-s-marker+7DC9DA(${ location })`;
	const mapUrl = `${ MAPBOX_BASE }/${ marker }/${ location },${ zoom },0,0/${ width }x${ height }@2x?${ args }`;
	const style = {
		height: `${ height }px`,
		width: `${ width }px`,
	};

	return <img
		alt={ `Map of ${ location }` }
		className="Map"
		src={ mapUrl }
		style={ style }
	/>;
}

Map.defaultProps = {
	zoom: 1.0,
};

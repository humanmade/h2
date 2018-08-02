import marked from 'marked';

export default function ( href, title, text ) {
	if ( href === text && ! title ) {
		// Autolinked, so skip it.
		return href;
	}

	return marked.Renderer.prototype.link.apply( this, arguments );
};

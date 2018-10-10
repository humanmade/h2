import marked from 'marked';

const renderLink = function ( href, title, text ) {
	if ( href === text && ! title ) {
		// Autolinked, so skip it.
		return href;
	}

	return marked.Renderer.prototype.link.apply( this, arguments );
}

// Build custom renderer.
const render = new marked.Renderer();
render.link = renderLink;

export default function compileMarkdown( text ) {
	return marked( text, { renderer: render } );
}

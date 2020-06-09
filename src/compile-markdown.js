import marked from 'marked';

class CustomRender extends marked.Renderer {
	link( href, title, text ) {
		if ( href === text && ! title ) {
			// Autolinked, so skip it.
			return href;
		}

		return super.link( href, title, text );
	}
}

// Build custom renderer.
const renderer = new CustomRender();

export default function compileMarkdown( text ) {
	return marked( text, { renderer } );
}

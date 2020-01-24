import marked from 'marked';

class CustomRender extends marked.Renderer {
	// eslint-disable-next-line no-undef
	tasklisttoken = '<!-- H2_TASKLIST_ITEM -->';

	link( href, title, text ) {
		if ( href === text && ! title ) {
			// Autolinked, so skip it.
			return href;
		}

		return super.link( href, title, text );
	}

	list( body, ordered ) {
		if ( body.indexOf( this.tasklisttoken ) >= 0 ) {
			return '<ul class="Tasklist">' + body.replace( new RegExp( this.tasklisttoken, 'g' ), '' ) + '</ul>';
		}

		return super.list( body, ordered );
	}

	listitem( text ) {
		const listMatch = text.match( /^\[(x| )] ?(.+)/i );
		if ( listMatch ) {
			const checked = listMatch[1] !== ' ';
			return `<li class="Tasklist-Item"${ checked ? ' data-checked' : '' }>${ listMatch[2] }</li>\n` + this.tasklisttoken;
		}

		return super.listitem( text );
	}
}

// Build custom renderer.
const renderer = new CustomRender();

export default function compileMarkdown( text ) {
	return marked( text, { renderer } );
}

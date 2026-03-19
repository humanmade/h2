import { marked } from 'marked';

const TASK_LIST_TOKEN = '<!-- H2_TASKLIST_ITEM -->';

class CustomRender extends marked.Renderer {
	link( href, title, text ) {
		if ( href === text && ! title ) {
			// Autolinked, so skip it.
			return href;
		}

		return super.link( href, title, text );
	}

	list( body, ordered ) {
		if ( body.indexOf( TASK_LIST_TOKEN ) >= 0 ) {
			return '<ul class="Tasklist">' + body.replace( new RegExp( TASK_LIST_TOKEN, 'g' ), '' ) + '</ul>';
		}

		return super.list( body, ordered );
	}

	listitem( text ) {
		const listMatch = text.match( /^\[(x| )] ?(.+)/i );
		if ( listMatch ) {
			const checked = listMatch[1] !== ' ';
			return `<li class="Tasklist-Item"${ checked ? ' data-checked' : '' }>${ listMatch[2] }</li>\n` + TASK_LIST_TOKEN;
		}

		return super.listitem( text );
	}
}

// Build custom renderer.
const renderer = new CustomRender();

export default function compileMarkdown( text ) {
	return marked( text, { renderer } );
}

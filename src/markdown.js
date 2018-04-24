import marked from 'marked';

class CustomRender extends marked.Renderer {
	tasklisttoken = '<!-- H2_TASKLIST_ITEM -->';

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

const renderer = new CustomRender();

export const compileMarkdown = text => {
	return marked( text, { renderer } );
};

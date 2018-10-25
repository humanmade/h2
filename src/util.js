const ENTITY_REGEX = /&#(?:([0-9]+)|x([a-fA-F0-9]+));/g;

/**
 * Decode numeric entities in text.
 *
 * Decodes numeric (decimal and hexadecimal) entities into their Unicode
 * representation as a string. Does not handle named entities.
 *
 * This is a much more lightweight decoder than is needed for generic HTML
 * handling, as we control the server-side representation.
 *
 * @param {string} text
 * @return {string}
 */
export function decodeEntities( text ) {
	return text.replace(
		ENTITY_REGEX,
		( _, decimal, hex ) => {
			const codePoint = decimal ? parseInt( decimal, 10 ): parseInt( hex, 16 );
			return codePointToSymbol( codePoint );
		}
	);
}

/**
 * Convert a code point to the Unicode symbol it represents.
 *
 * From https://github.com/mathiasbynens/he
 *
 * @param {Number} codePoint Unicode code point for a symbol
 * @return {string} Symbol represented by the code point
 */
export function codePointToSymbol( codePoint ) {
	let output = '';
	if ( ( codePoint >= 0xD800 && codePoint <= 0xDFFF ) || codePoint > 0x10FFFF ) {
		// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
		// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
		// REPLACEMENT CHARACTER.”
		return '\uFFFD';
	}
	if ( codePoint > 0xFFFF ) {
		codePoint -= 0x10000;
		output += String.fromCharCode( ( ( codePoint >>> 10 ) & 0x3FF ) | 0xD800 );
		codePoint = ( 0xDC00 | codePoint ) & 0x3FF;
	}
	output += String.fromCharCode( codePoint );
	return output;
}

/**
 * From TinyMCE: https://github.com/tinymce/tinymce/blob/master/src/plugins/paste/main/ts/core/WordFilter.ts
 */
export function isWordContent( content ) {
	return (
		/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i.test( content ) ||
		/class="OutlineElement/.test( content ) ||
		/id="?docs-internal-guid-/.test( content )
	);
}

/**
 * From https://github.com/euangoddard/clipboard2markdown
 */
export function cleanConvertedMarkdown( str ) {
	return str
		.replace( /[\u2018\u2019\u00b4]/g, '\'' )
		.replace( /[\u201c\u201d\u2033]/g, '"' )
		.replace( /[\u2212\u2022\u00b7\u25aa]/g, '-' )
		.replace( /[\u2013\u2015]/g, '--' )
		.replace( /\u2014/g, '---' )
		.replace( /\u2026/g, '...' )
		.replace( /[ ]+\n/g, '\n' )
		.replace( /\s*\\\n/g, '\\\n' )
		.replace( /\s*\\\n\s*\\\n/g, '\n\n' )
		.replace( /\s*\\\n\n/g, '\n\n' )
		.replace( /\n-\n/g, '\n' )
		.replace( /\n\n\s*\\\n/g, '\n\n' )
		.replace( /\n\n\n*/g, '\n\n' )
		.replace( /[ ]+$/gm, '' )
		.replace( /^\s+|[\s\\]+$/g, '' );
}

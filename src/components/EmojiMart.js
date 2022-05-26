import { Picker, emojiIndex } from 'emoji-mart';

// Used by EmojiCompletion.
export { emojiIndex };

/**
 * We need Picker defined as a default export to leverage React.lazy.
 * See https://reactjs.org/docs/code-splitting.html#named-exports
 */
export default Picker;

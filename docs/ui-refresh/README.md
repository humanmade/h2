# H2 Next UI review

The UI review compared `next` at `a1873f8` with the final changes in this PR. Screenshots were used as temporary review artifacts.

The review used the same local WordPress site at 1280 × 720. Representative widgets were injected only into screenshot-preview requests, without changing the saved widget configuration. A temporary local draft was used for the draft screenshots and moved to Trash after capture. Loading components are rendered directly from each revision in 800px and 375px fixture frames.

The original header-search integration is already merged in #669. This PR includes the subsequent UI work and the single-site result-pill refinement.

## Stream, replies, and sidebar widgets

Consistent gutters and avatar sizes, aligned replies, lighter separators, compact widget headings and search.

## Sidebar section navigation

Shared site header dimensions and alignment, with a quiet chevron back control.

## Page header spacing

Space between the search header and page content, with the shared content alignment.

## Profile sidebar

Compact identity block, neutral navigation rows, and readable stacked profile details.

## Inline editing and editor actions

Editable header title, visible Cancel, and no Reply controls while editing; shared button styling.

## New-post composer

Clear type hierarchy, plain placeholders, sentence-case tabs, and consistent spacing.

## Draft selection

Inline disclosure replaces the oversized modal; draft rows include a recoverable Trash action.

## Saved-draft footer and actions

Compact word count and save status, a real preview link, and Move to Trash beside Save/Publish.

## Single-site search results

Hide redundant site pills when exactly one site is selected; keep them for all-site and multi-site searches.

## Sidebar pagination

Compact, aligned Older/Newer controls with matching chevrons and spacing.

## Post preview hovercard

Smaller card, softer border/shadow, neutral pointer, and clearer title/content/author hierarchy.

## Main-content pagination

Matching pagination controls with breathing room below the final post.

## Shared split buttons and menus

Neutral secondary actions, matched split-button heights, softer corners, and quieter menus.

## Post and reply placeholders

Responsive placeholders match the updated avatars, text offsets, line spacing, and post padding. Desktop and mobile fixtures shown together.

## Behavior verified outside screenshots

- Title-only edits save and persist after refresh; Cancel discards title and body edits for posts and pages. Unsaved-change protection includes titles.
- Draft selection refreshes on open. Trashing the active draft resets the editor; trashing a different draft preserves unrelated unsaved content. Both use WordPress Trash, and test drafts remained recoverable there.
- The hovercard entrance has one translation rather than stacking an extra 20px offset that disappears at the end.
- Sidebar/widget option updates, additions, and deletions invalidate the widget preload cache; unrelated option updates retain it. An already-open app still needs a refresh after admin changes.
- Page loading uses one placeholder without a post reply action. Desktop and mobile placeholder geometry were checked.

## Validation

`npm run lint`, `npm run build`, `php -l functions.php`, `php -l inc/namespace.php`, and `git diff --check`. Browser checks covered editing/cancel, draft save/select/trash, preview mode, sidebar navigation, search scope, pagination, and hovercards.

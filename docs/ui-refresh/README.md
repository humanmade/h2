# H2 Next UI review

Before screenshots use `next` at `a1873f8`; after screenshots use this PR. The comparison is the final UI against the baseline, rather than intermediate iterations.

Captures use the same local WordPress site at 1280 × 720. Representative widgets were injected only into screenshot-preview requests, without changing the saved widget configuration. A temporary local draft was used for the draft screenshots and moved to Trash after capture. Loading components are rendered directly from each revision in 800px and 375px fixture frames.

The original header-search integration is already merged in #669. This PR includes the subsequent UI work and the single-site result-pill refinement.

## Stream, replies, and sidebar widgets

Consistent gutters and avatar sizes, aligned replies, lighter separators, compact widget headings and search.

| Before | After |
| --- | --- |
| ![Before: Stream, replies, and sidebar widgets](before/01-stream-and-widgets.png) | ![After: Stream, replies, and sidebar widgets](after/01-stream-and-widgets.png) |

## Sidebar section navigation

Shared site header dimensions and alignment, with a quiet chevron back control.

| Before | After |
| --- | --- |
| ![Before: Sidebar section navigation](before/02-sidebar-navigation.png) | ![After: Sidebar section navigation](after/02-sidebar-navigation.png) |

## Page header spacing

Space between the search header and page content, with the shared content alignment.

| Before | After |
| --- | --- |
| ![Before: Page header spacing](before/03-page-template.png) | ![After: Page header spacing](after/03-page-template.png) |

## Profile sidebar

Compact identity block, neutral navigation rows, and readable stacked profile details.

| Before | After |
| --- | --- |
| ![Before: Profile sidebar](before/04-profile.png) | ![After: Profile sidebar](after/04-profile.png) |

## Inline editing and editor actions

Editable header title, visible Cancel, and no Reply controls while editing; shared button styling.

| Before | After |
| --- | --- |
| ![Before: Inline editing and editor actions](before/05-inline-edit-and-buttons.png) | ![After: Inline editing and editor actions](after/05-inline-edit-and-buttons.png) |

## New-post composer

Clear type hierarchy, plain placeholders, sentence-case tabs, and consistent spacing.

| Before | After |
| --- | --- |
| ![Before: New-post composer](before/06-composer.png) | ![After: New-post composer](after/06-composer.png) |

## Draft selection

Inline disclosure replaces the oversized modal; draft rows include a recoverable Trash action.

| Before | After |
| --- | --- |
| ![Before: Draft selection](before/07-drafts-panel.png) | ![After: Draft selection](after/07-drafts-panel.png) |

## Saved-draft footer and actions

Compact word count and save status, a real preview link, and Move to Trash beside Save/Publish.

| Before | After |
| --- | --- |
| ![Before: Saved-draft footer and actions](before/08-saved-draft-footer.png) | ![After: Saved-draft footer and actions](after/08-saved-draft-footer.png) |

## Single-site search results

Hide redundant site pills when exactly one site is selected; keep them for all-site and multi-site searches.

| Before | After |
| --- | --- |
| ![Before: Single-site search results](before/09-single-site-search.png) | ![After: Single-site search results](after/09-single-site-search.png) |

## Sidebar pagination

Compact, aligned Older/Newer controls with matching chevrons and spacing.

| Before | After |
| --- | --- |
| ![Before: Sidebar pagination](before/10-sidebar-pagination.png) | ![After: Sidebar pagination](after/10-sidebar-pagination.png) |

## Post preview hovercard

Smaller card, softer border/shadow, neutral pointer, and clearer title/content/author hierarchy.

| Before | After |
| --- | --- |
| ![Before: Post preview hovercard](before/11-post-hovercard.png) | ![After: Post preview hovercard](after/11-post-hovercard.png) |

## Main-content pagination

Matching pagination controls with breathing room below the final post.

| Before | After |
| --- | --- |
| ![Before: Main-content pagination](before/12-main-pagination.png) | ![After: Main-content pagination](after/12-main-pagination.png) |

## Shared split buttons and menus

Neutral secondary actions, matched split-button heights, softer corners, and quieter menus.

| Before | After |
| --- | --- |
| ![Before: Shared split buttons and menus](before/13-button-menu.png) | ![After: Shared split buttons and menus](after/13-button-menu.png) |

## Post and reply placeholders

Responsive placeholders match the updated avatars, text offsets, line spacing, and post padding. Desktop and mobile fixtures shown together.

| Before | After |
| --- | --- |
| ![Before: Post and reply placeholders](before/14-loading-states.png) | ![After: Post and reply placeholders](after/14-loading-states.png) |

## Behavior verified outside screenshots

- Title-only edits save and persist after refresh; Cancel discards title and body edits for posts and pages. Unsaved-change protection includes titles.
- Draft selection refreshes on open. Trashing the active draft resets the editor; trashing a different draft preserves unrelated unsaved content. Both use WordPress Trash, and test drafts remained recoverable there.
- The hovercard entrance has one translation rather than stacking an extra 20px offset that disappears at the end.
- Sidebar/widget option updates, additions, and deletions invalidate the widget preload cache; unrelated option updates retain it. An already-open app still needs a refresh after admin changes.
- Page loading uses one placeholder without a post reply action. Desktop and mobile placeholder geometry were checked.

## Validation

`npm run lint`, `npm run build`, `php -l functions.php`, `php -l inc/namespace.php`, and `git diff --check`. Browser checks covered editing/cancel, draft save/select/trash, preview mode, sidebar navigation, search scope, pagination, and hovercards.

# zen-tabstack

A Zen Browser extension that keeps your most recently used tab at the top of the sidebar

Every time you switch to a tab, it moves to position one. The result is a sidebar ordered by recency, with your oldest/least-used tabs drifting to the bottom.

## Behavior

- Activated tab moves to the top of the unpinned tab list
- On browser start, all tabs are sorted by last accessed time
- Pinned tabs are never reordered

## Install

**Temporary (development):**
1. Go to `about:debugging` → This Firefox
2. Click **Load Temporary Add-on...**
3. Select `manifest.json`

**Permanent:**
Download the `.xpi` from the [releases page](../../releases) and drag it into the browser, or install via `about:addons` → gear icon → Install Add-on From File.


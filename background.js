"use strict";

const isMoving = new Map();

async function getPinnedCount(windowId) {
  const pinned = await browser.tabs.query({ windowId, pinned: true });
  return pinned.length;
}

async function sortWindow(windowId) {
  const allTabs = await browser.tabs.query({ windowId });

  const pinned = allTabs.filter(t => t.pinned);
  const unpinned = allTabs.filter(t => !t.pinned);
  const pinnedCount = pinned.length;

  unpinned.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));

  for (let i = 0; i < unpinned.length; i++) {
    const targetIndex = pinnedCount + i;
    if (unpinned[i].index !== targetIndex) {
      await browser.tabs.move(unpinned[i].id, { index: targetIndex });
    }
  }
}

async function sortAllWindows() {
  const windows = await browser.windows.getAll();
  await Promise.all(windows.map(w => sortWindow(w.id)));
}

async function handleActivated({ tabId, windowId }) {
  if (isMoving.get(windowId)) return;
  isMoving.set(windowId, true);

  try {
    const tab = await browser.tabs.get(tabId);

    if (tab.pinned) return;

    const pinnedCount = await getPinnedCount(windowId);

    if (tab.index === pinnedCount) return;

    await browser.tabs.move(tabId, { index: pinnedCount });
  } catch (err) {
    console.error("[zen-recent-tabs] handleActivated error:", err);
  } finally {
    isMoving.set(windowId, false);
  }
}

browser.runtime.onInstalled.addListener(() => {
  sortAllWindows().catch(err =>
    console.error("[zen-recent-tabs] onInstalled sort error:", err)
  );
});

browser.runtime.onStartup.addListener(() => {
  sortAllWindows().catch(err =>
    console.error("[zen-recent-tabs] onStartup sort error:", err)
  );
});

browser.tabs.onActivated.addListener(handleActivated);

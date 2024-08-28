import { sleepTab, suspendTab, displayBuckets } from './tabs-manager';

export function setupContextMenu(): void {
  let contexts: chrome.contextMenus.ContextType[] = [
    'page',
    'action',
    'page_action',
    'browser_action',
  ];

  chrome.contextMenus.removeAll();

  let parent = chrome.contextMenus.create({
    title: 'Bucket - Manage Tabs',
    id: 'parent',
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: 'Sleep current tab',
    parentId: parent,
    id: 'sleep-tab',
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: 'Suspend current tab',
    parentId: parent,
    id: 'suspend-tab',
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: 'Display Buckets',
    parentId: parent,
    id: 'display-buckets',
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: 'Send to Bucket',
    parentId: parent,
    id: 'send-to-bucket',
    contexts: contexts,
  });

  if (chrome.contextMenus.onClicked === undefined) {
    console.log('No context menu click handler');
    return;
  }

  if (chrome.contextMenus.onClicked.hasListener(clickHandler)) {
    console.log('Has menu click handler');
    return
  }

  // chrome.contextMenus.onClicked.hasListener(clickHandler) && chrome.contextMenus.onClicked.removeListener(clickHandler);
  chrome.contextMenus.onClicked.addListener(clickHandler);

  function clickHandler(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
    console.log('Context menu item clicked: ', info.menuItemId);

    if (info.menuItemId === 'sleep-tab') {
      sleepTab(tab);
    } else if (info.menuItemId === 'suspend-tab') {
      suspendTab();
    } else if (info.menuItemId === 'display-buckets') {
      displayBuckets();
    } else if (info.menuItemId === 'send-to-bucket') {
      console.log('Sending to Bucket');
    } else {
      console.log('Unknown menu item clicked: ', info.menuItemId);
    }
  }

}

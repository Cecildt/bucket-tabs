export function setupContextMenu(): void {
  let contexts: chrome.contextMenus.ContextType[] = [
    'page',
    'action',
    'page_action',
    'browser_action',
  ];

  // Create a parent item and two children.
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
    title: 'Display Buckets',
    parentId: parent,
    id: 'diaplay-buckets',
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: 'Send to Bucket',
    parentId: parent,
    id: 'send-to-bucket',
    contexts: contexts,
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'sleep-tab') {
      sleepTab(tab);
    } else if (info.menuItemId === 'diaplay-buckets') {
      displayBuckets();
    } else if (info.menuItemId === 'send-to-bucket') {
      console.log('Sending to Bucket');
    } else {
      console.log('Unknown menu item clicked: ', info.menuItemId);
    }
  });

  function sleepTab(tab?: chrome.tabs.Tab): void {
    console.log('Sleeping tab: ', tab?.title);
  }

  function displayBuckets(): void {
    console.log('Displaying Buckets');

    // chrome.tabs.create({ url: info.linkUrl });
  }
}

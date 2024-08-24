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
    id: 'display-buckets',
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
    } else if (info.menuItemId === 'display-buckets') {
      displayBuckets();
    } else if (info.menuItemId === 'send-to-bucket') {
      console.log('Sending to Bucket');
    } else {
      console.log('Unknown menu item clicked: ', info.menuItemId);
    }
  });

  function sleepTab(tab?: chrome.tabs.Tab): void {
    if (tab === undefined) {
      console.log('No tab to sleep');
      return;
    }

    console.log('Sleeping tab: $1 - $2', tab.title, tab.url);
    let sleepURL = 'sleep/index.html?title=' + tab.title + '&url=' + tab.url;
    let id = tab.id;
    let title = 'Sleeping - ' + tab.title;

    if (id === undefined) {
      console.log('No tab ID');
      return;
    }

    if (title === undefined) {
      console.log('No tab title');
      title = 'Sleeping Tab';
    }

    chrome.tabs.update(id, { url: sleepURL });
    
  }

  function displayBuckets(): void {
    console.log('Displaying Buckets');

    chrome.tabs.create({ url: "buckets/index.html", pinned: true });
  }
}

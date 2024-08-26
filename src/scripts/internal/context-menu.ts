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

  chrome.contextMenus.onClicked.addListener((info, tab) => {
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
  });

  function sleepTab(tab?: chrome.tabs.Tab): void {
    console.log('Sleeping tab');
    if (tab === undefined) {
      console.log('No tab to sleep');
      return;
    }

    console.log('Sleeping tab: $1 - $2', tab.title, tab.url);
    let sleepURL =
      'sleep/index.html?bt-title=' + tab.title + '&bt-url=' + tab.url;
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

  function suspendTab(tab?: chrome.tabs.Tab): void {
    console.log('Suspending tab');
    if (tab === undefined) {
      console.log('No tab to suspend');

      getCurrentTab().then((currentTab) => {
        if (currentTab === undefined) {
          console.log('No current tab');
          return;
        }

        let id = currentTab.id;

        if (id === undefined) {
          console.log('No tab ID');
          return;
        }

        chrome.tabs.discard(id);
      });

      return;
    }

    let id = tab.id;

    if (id === undefined) {
      console.log('No tab ID');
      return;
    }

    // chrome.tabs.create({ url: 'buckets/index.html', pinned: true });
    chrome.tabs.discard(id);
  }

  function displayBuckets(): void {
    console.log('Displaying Buckets');

    chrome.tabs.create({ url: 'buckets/index.html', pinned: true });
  }

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    if (tab === undefined) {
      console.log('No current tab found.');
    }

    return tab;
  }
}

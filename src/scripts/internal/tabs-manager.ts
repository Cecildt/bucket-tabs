import { traceInfo, traceWarning } from "./trace";
import { BucketListDataModel, TabDataModel } from './bucket-data-model';

export function sleepTab(tab?: chrome.tabs.Tab): void {
  traceInfo('Sleeping tab');
  if (tab === undefined) {
    traceWarning('No tab to sleep');
    return;
  }

  traceInfo('Sleeping tab: $1 - $2', tab.title, tab.url);
  let sleepURL =
    'sleep/index.html?bt-title=' + tab.title + '&bt-url=' + tab.url;
  let id = tab.id;
  let title = 'Sleeping - ' + tab.title;

  if (id === undefined) {
    traceWarning('No tab ID');
    return;
  }

  if (title === undefined) {
    traceWarning('No tab title');
    title = 'Sleeping Tab';
  }

  chrome.tabs.update(id, { url: sleepURL });
}

export function suspendTab(tab?: chrome.tabs.Tab): void {
  traceInfo('Suspending tab');
  if (tab === undefined) {
    traceWarning('No tab to suspend');

    getCurrentTab().then((currentTab) => {
      if (currentTab === undefined) {
        traceWarning('No current tab');
        return;
      }

      let id = currentTab.id;

      if (id === undefined) {
        traceWarning('No tab ID');
        return;
      }

      chrome.tabs.discard(id);
    });

    return;
  }

  let id = tab.id;

  if (id === undefined) {
    traceWarning('No tab ID');
    return;
  }

  // chrome.tabs.create({ url: 'buckets/index.html', pinned: true });
  chrome.tabs.discard(id);
}

export function suspendAllTabs(): void {
  traceInfo('Suspending all tabs');

  chrome.tabs.query({ currentWindow: true}, (tabs) => {
    for (let tab of tabs) {
      let id = tab.id;

      if (id === undefined) {
        traceWarning('No tab ID');
        return;
      }

      chrome.tabs.discard(id);
    }
  });
}

export function displayBuckets(): void {
    traceInfo('Displaying Buckets');

    chrome.tabs.query({  title: 'Bucket Tabs Management' }, (tabs) => {
      if (tabs.length === 0) {
        chrome.tabs.create({url: 'buckets/index.html', pinned: true });
        return;
      }

      let tab = tabs[0];
      let id = tab.id;

      if (id === undefined) {
        traceWarning('No tab ID');
        return;
      }

      chrome.tabs.update(id, { active: true });

    });
  }

export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);

  if (tab === undefined) {
    traceWarning('No current tab found.');
  }

  return tab;
}

export function sendToDefaultBucket(tab?: chrome.tabs.Tab): void {
  traceInfo('Send to Default bucket');
  if (tab === undefined) {
    traceWarning('No tab to send');
    return;
  }

  traceInfo('Sending tab: $1 - $2', tab.title, tab.url);
  let id = tab.id;
  let title = tab.title;
  let url = tab.url;

  if (id === undefined) {
    traceWarning('No tab ID');
    return;
  }

  if (title === undefined) {
    traceWarning('No tab title');
    title = 'Unknown Tab';
  }

  if (url === undefined) {
    traceWarning('No tab URL');
    return;
  }

  const chromeURL = 'chrome://';
  const chromeExtensionURL = 'chrome-extension://';

  if (url.startsWith(chromeURL) || url.startsWith(chromeExtensionURL)) {
    traceInfo('Ignoring Chrome URLs');
    return;
  }

  const bucketList: BucketListDataModel = new BucketListDataModel();
  bucketList.initDataSet().then(() => {
    let defaultBucket = bucketList.getDefaultBucket();

    if (defaultBucket === undefined) {
      traceWarning('No default bucket found');
      return;
    }

    const storeTab: TabDataModel = new TabDataModel(title, url, defaultBucket.getTabs().length + 1);
    
    defaultBucket.addTab(storeTab);
    bucketList.saveBucket(defaultBucket);

    chrome.tabs.remove(id);
    refreshBucketManagementTab();
  })
}

export function sendToBuckets(tab?: chrome.tabs.Tab): void {
  traceInfo('Send to my Buckets');
  if (tab === undefined) {
    traceWarning('No tab to send');
    return;
  }

  traceInfo('Sending tab: $1 - $2', tab.title, tab.url);
  let id = tab.id;

  if (id === undefined) {
    traceWarning('No tab ID');
    return;
  }


  chrome.tabs.remove(id);
}

function refreshBucketManagementTab(): void {
  traceInfo('Displaying Buckets');

    chrome.tabs.query({  title: 'Bucket Tabs Management' }, (tabs) => {
      if (tabs.length === 0) {
        return;
      }

      let tab = tabs[0];
      let id = tab.id;

      if (id === undefined) {
        traceWarning('No tab ID');
        return;
      }

      chrome.tabs.reload(id);

    });
}
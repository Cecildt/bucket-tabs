export function sleepTab(tab?: chrome.tabs.Tab): void {
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

export function suspendTab(tab?: chrome.tabs.Tab): void {
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

export function displayBuckets(): void {
    console.log('Displaying Buckets');

    chrome.tabs.query({  title: 'Bucket Tabs' }, (tabs) => {
      if (tabs.length === 0) {
        console.log('No Buckets tab found.');
        chrome.tabs.create({url: 'buckets/index.html', pinned: true });
        return;
      }

      let tab = tabs[0];
      let id = tab.id;

      if (id === undefined) {
        console.log('No tab ID');
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
    console.log('No current tab found.');
  }

  return tab;
}

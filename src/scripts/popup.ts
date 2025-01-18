// Description: This script is responsible for handling the popup window of the extension.

import { sleepTab, suspendTab, displayBuckets, getCurrentTab, suspendAllTabs, sendToDefaultBucket, sendToBuckets } from './internal/tabs-manager';

const default_bucket_button = document.getElementById('bt-btn-default-bucket-tab');
if (default_bucket_button) {
  default_bucket_button.addEventListener('click', async () => {
    let currentTab = await getCurrentTab();
    sendToDefaultBucket(currentTab);
  });
}

const send_buckets_button = document.getElementById('bt-btn-send-buckets-tab');
if (send_buckets_button) {
  send_buckets_button.addEventListener('click', async () => {
    // let currentTab = await getCurrentTab();
    // sendToBuckets(currentTab);
    const buckets_list = document.getElementById('bt-buckets-selection');
    if (buckets_list) {
      const buttons_list = document.getElementById('bt-buttons-selection');
      buttons_list?.classList.add('hidden');
      buckets_list.classList.remove('hidden');
    }

  });
}

const sleep_button = document.getElementById('bt-btn-sleep-tab');
if (sleep_button) {
    sleep_button.addEventListener('click', async () => {
    let currentTab = await getCurrentTab();
    sleepTab(currentTab);
  });
}

const suspend_button = document.getElementById('bt-btn-suspend-current-tab');
if (suspend_button) {
    suspend_button.addEventListener('click', async () => {
    let currentTab = await getCurrentTab();
    suspendTab(currentTab);
  });
}

const suspend_all_button = document.getElementById('bt-btn-suspend-all-tab');
if (suspend_all_button) {
    suspend_all_button.addEventListener('click', async () => {
    suspendAllTabs();
  });
}

const display_button = document.getElementById('bt-btn-display-buckets');
if (display_button) {
    display_button.addEventListener('click', async () => {
    displayBuckets();
  });
}

const send_all_default_bucket_button = document.getElementById('bt-btn-send-all-default-bucket');
if (send_all_default_bucket_button) {
  send_all_default_bucket_button.addEventListener('click', async () => {
    displayBuckets();
  });
}

const send_all__bucket_button = document.getElementById('bt-btn-send-all-bucket');
if (send_all__bucket_button) {
  send_all__bucket_button.addEventListener('click', async () => {
    displayBuckets();
  });
}
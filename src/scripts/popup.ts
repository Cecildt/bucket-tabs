// Description: This script is responsible for handling the popup window of the extension.

import { sleepTab, suspendTab, displayBuckets, getCurrentTab, suspendAllTabs } from './internal/tabs-manager';

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
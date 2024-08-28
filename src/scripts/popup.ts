import { sleepTab, suspendTab, displayBuckets, getCurrentTab } from './internal/tabs-manager';

console.log('Popup script loaded');

const sleep_button = document.getElementById('bt-btn-sleep-tab');
if (sleep_button) {
    sleep_button.addEventListener('click', async () => {
    console.log('Sleep tab button clicked');
    let currentTab = await getCurrentTab();
    sleepTab(currentTab);
  });
}

const suspend_button = document.getElementById('bt-btn-suspend-current-tab');
if (suspend_button) {
    suspend_button.addEventListener('click', async () => {
    console.log('Suspend tab button clicked');
    let currentTab = await getCurrentTab();
    suspendTab(currentTab);
  });
}

const display_button = document.getElementById('bt-btn-display-buckets');
if (display_button) {
    display_button.addEventListener('click', async () => {
    console.log('Display buckets button clicked');
    displayBuckets();
  });
}
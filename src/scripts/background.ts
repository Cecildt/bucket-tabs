/* This is the background script, also known as the service worker. */

import { setBadgeText } from './internal/index';
import { setupContextMenu } from './internal/context-menu';

// setBadgeText('5');

chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension installed');
    setupContextMenu();
});

chrome.runtime.onStartup.addListener(function () {
    console.log('Extension started');
});

chrome.runtime.onSuspendCanceled.addListener(function () {
    console.log('Extension resumed');
    // setupContextMenu();
});

chrome.runtime.onUpdateAvailable.addListener(function () {
    console.log('Extension updated');
    // setupContextMenu();
});

chrome.runtime.onConnect.addListener(function (port) {
    console.log('Connected to port: ', port);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log('Tab activated: ', activeInfo);
    // setupContextMenu();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    
    if (changeInfo.status === 'complete') {
        console.log('Tab updated: ', tabId, changeInfo, tab);
        setupContextMenu();
    }
});
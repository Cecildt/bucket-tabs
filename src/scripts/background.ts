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
    setupContextMenu();
});

chrome.runtime.onSuspendCanceled.addListener(function () {
    console.log('Extension resumed');
    setupContextMenu();
});

chrome.runtime.onUpdateAvailable.addListener(function () {
    console.log('Extension updated');
    setupContextMenu();
});

chrome.runtime.onConnect.addListener(function (port) {
    console.log('Connected to port: ', port);
});

chrome.runtime.onRestartRequired.addListener(function (reason) {
    console.log('Restart required: ', reason);
});


chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log('Tab activated: ', activeInfo);
    setupContextMenu();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log('Tab updated: ', tabId, changeInfo, tab);
    setupContextMenu();
});
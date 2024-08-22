/* This is the background script, also known as the service worker. */

import { setBadgeText } from './internal/index';
import { setupContextMenu } from './internal/context-menu';

// setBadgeText('5');

chrome.runtime.onInstalled.addListener(function () {
    setupContextMenu();
});
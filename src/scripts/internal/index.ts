/* This file can be used to export functionality that can then be used in the
 * extension's content and background scripts.
 */

export function setBadgeText(text: string): void {
  chrome.action.setBadgeText({ text });

  chrome.action.setBadgeBackgroundColor(
    {color: '#00FF00'},  // Also green
    () => { chrome.action.setBadgeText({ text: text}) },
  );
}
// Description: Logic for storing and retrieving data from local storage

export function initStorage(): void {
  console.log('Storage initialized');

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ buckets: [] });
  });
}

export function getStorage(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

export function setStorage(key: string, value: any): void {
  chrome.storage.local.set({ [key]: value });
}

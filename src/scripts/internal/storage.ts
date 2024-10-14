// Description: Logic for storing and retrieving data from local storage

import { BucketDataModel } from "./bucket-data-model";

interface BucketStorageDataModel {
    BucketID: String;
    BucketName: String;
    Order: Number;
}

export function initStorage(): void {
  console.log('Storage initialized');

  if (window.globalBucketTabsState.getBrowserStorage()) {
    localStorage.setItem('buckets', JSON.stringify([]));
  } else {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.storage.local.set({ buckets: [] });
    });
  }
}

export function getBucketsStorage(): Promise<Array<BucketDataModel>> {
  let storedBuckets: Array<BucketDataModel> = [];

  getStorage('buckets').then((buckets: Array<BucketStorageDataModel>) => {
      if (buckets.length === 0) {
        buckets.forEach((bucket: BucketStorageDataModel) => {
        storedBuckets.push(new BucketDataModel(bucket.BucketName, bucket.Order));
        });
      }
  });

  return Promise.resolve(storedBuckets);
}

export function setBucketsStorage(buckets: Array<BucketDataModel>): void {
  setStorage('buckets', buckets);
}

export function getArchivedStorage(): Promise<Array<BucketDataModel>> {
  return getStorage('archived');
}

export function setArchivedStorage(archived: Array<BucketDataModel>): void {
  setStorage('archived', archived);
}

export function getStorage(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.globalBucketTabsState.getBrowserStorage()) {
      let keys = localStorage.getItem(key);

      if (keys === null) {
        resolve([]);
      } else {
        resolve(JSON.parse(keys));
      }
    } else {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    }
  });
}

export function removeStorage(key: string): void {
  if (window.globalBucketTabsState.getBrowserStorage()) {
    localStorage.removeItem(key);
  } else {
    chrome.storage.local.remove(key);
  }
}

export function setStorage(key: string, value: any): void {
  if (window.globalBucketTabsState.getBrowserStorage()) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    chrome.storage.local.set({ [key]: value });
  }
}

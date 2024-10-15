// Description: Logic for storing and retrieving data from local storage

import { BucketDataModel, TabDataModel } from './bucket-data-model';

interface BucketStorageDataModel {
  BucketID: String;
  BucketName: String;
  Order: Number;
  BucketTabs: Array<TabStorageDataModel>;
}

interface TabStorageDataModel {
  TabID: Number;
  TabName: String;
  TabURL: String;
  TabBucketID: Number;
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

export async function getBucketsStorage(): Promise<Array<BucketDataModel>> {
  let storedBuckets: Array<BucketDataModel> = [];

  const buckets: Array<BucketStorageDataModel> = await getStorage('buckets');
  if (buckets.length > 0) {
    buckets.forEach((bucket: BucketStorageDataModel) => {
      let newBucket = new BucketDataModel(
        bucket.BucketID,
        bucket.BucketName,
        bucket.Order
      );

      bucket.BucketTabs.forEach((tab: TabStorageDataModel) => {
        let tabData = new TabDataModel(
          tab.TabID,
          tab.TabName,
          tab.TabURL,
          tab.TabBucketID,
          tab.Order
        );
        newBucket.addTab(tabData);
      });

      storedBuckets.push(newBucket);
    });
  }

  return Promise.resolve(storedBuckets);
}

export function setBucketsStorage(buckets: Array<BucketDataModel>): void {
  let storageBuckets: Array<BucketStorageDataModel> = [];

  buckets.forEach((bucket: BucketDataModel) => {
    let storedTabs: Array<TabStorageDataModel> = [];

    bucket.getTabs().forEach((tab: TabDataModel) => {
      let storedTab: TabStorageDataModel = {
        TabID: tab.getTabID(),
        TabName: tab.getTabName(),
        TabURL: tab.getTabURL(),
        TabBucketID: tab.getTabBucketID(),
        Order: tab.getOrder(),
      };

      storedTabs.push(storedTab);
    });

    let storageBucket: BucketStorageDataModel = {
      BucketID: bucket.getBucketID(),
      BucketName: bucket.getBucketName(),
      Order: bucket.getOrder(),
      BucketTabs: storedTabs,
    };

    storageBuckets.push(storageBucket);
  });

  setStorage('buckets', storageBuckets);
}

export async function getArchivedStorage(): Promise<Array<BucketDataModel>> {
  let storedBuckets: Array<BucketDataModel> = [];

  const buckets: Array<BucketStorageDataModel> = await getStorage('archived');

  if (buckets.length > 0) {
    buckets.forEach((bucket: BucketStorageDataModel) => {
      let newBucket = new BucketDataModel(
        bucket.BucketID,
        bucket.BucketName,
        bucket.Order
      );

      bucket.BucketTabs.forEach((tab: TabStorageDataModel) => {
        let tabData = new TabDataModel(
          tab.TabID,
          tab.TabName,
          tab.TabURL,
          tab.TabBucketID,
          tab.Order
        );
        newBucket.addTab(tabData);
      });
      storedBuckets.push(newBucket);
    });
  }

  return Promise.resolve(storedBuckets);
}

export function setArchivedStorage(archived: Array<BucketDataModel>): void {
  let storageBuckets: Array<BucketStorageDataModel> = [];

  archived.forEach((bucket: BucketDataModel) => {
    let storageTabs: Array<TabStorageDataModel> = [];

    bucket.getTabs().forEach((tab: TabDataModel) => {
      let storageTab: TabStorageDataModel = {
        TabID: tab.getTabID(),
        TabName: tab.getTabName(),
        TabURL: tab.getTabURL(),
        TabBucketID: tab.getTabBucketID(),
        Order: tab.getOrder(),
      };

      storageTabs.push(storageTab);
    });

    let storageBucket: BucketStorageDataModel = {
      BucketID: bucket.getBucketID(),
      BucketName: bucket.getBucketName(),
      Order: bucket.getOrder(),
      BucketTabs: storageTabs,
    };

    storageBuckets.push(storageBucket);
  });

  setStorage('archived', storageBuckets);
}

export async function getStorage(key: string): Promise<any> {
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

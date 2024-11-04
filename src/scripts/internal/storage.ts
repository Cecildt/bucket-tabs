// Description: Logic for storing and retrieving data from local storage

import { BucketDataModel, BucketType, TabDataModel } from './bucket-data-model';

interface BucketStorageDataModel {
  BucketID: String;
  BucketName: String;
  Order: Number;
  BucketTabs: Array<TabStorageDataModel>;
  BucketType: BucketType,
  Starred: Boolean,
  Locked: Boolean
}

interface TabStorageDataModel {
  TabID: String;
  TabName: String;
  TabURL: String;
  Order: Number;
}

export class StorageAdapter {
  private _useBrowserStorage: Boolean = true;
  
  constructor() {
  }

  initStorage(): void {
    console.log('Storage initialized');
  
    if (this._useBrowserStorage) {
      localStorage.setItem('buckets', JSON.stringify([]));
    } else {
      chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.local.set({ buckets: [] });
      });
    }
  }
  
  async getBucketsStorage(): Promise<Array<BucketDataModel>> {
    let storedBuckets: Array<BucketDataModel> = [];
  
    const buckets: Array<BucketStorageDataModel> = await this.getStorage('buckets');
    if (buckets.length > 0) {
      buckets.forEach((bucket: BucketStorageDataModel) => {
        let newBucket = new BucketDataModel(
          bucket.BucketID,
          bucket.BucketName,
          bucket.Order,
          bucket.BucketType,
          bucket.Starred,
          bucket.Locked
        );
  
        bucket.BucketTabs.forEach((tab: TabStorageDataModel) => {
          let tabData = new TabDataModel(
            tab.TabName,
            tab.TabURL,
            tab.Order,
            tab.TabID,
          );
          newBucket.addTab(tabData);
        });
  
        storedBuckets.push(newBucket);
      });
    }
  
    return Promise.resolve(storedBuckets);
  }
  
  setBucketsStorage(buckets: Array<BucketDataModel>): void {
    let storageBuckets: Array<BucketStorageDataModel> = [];
  
    buckets.forEach((bucket: BucketDataModel) => {
      let storedTabs: Array<TabStorageDataModel> = [];
  
      bucket.getTabs().forEach((tab: TabDataModel) => {
        let storedTab: TabStorageDataModel = {
          TabID: tab.getTabID(),
          TabName: tab.getTabName(),
          TabURL: tab.getTabURL(),
          Order: tab.getOrder(),
        };
  
        storedTabs.push(storedTab);
      });
  
      let storageBucket: BucketStorageDataModel = {
        BucketID: bucket.getBucketID(),
        BucketName: bucket.getBucketName(),
        Order: bucket.getOrder(),
        BucketType: bucket.getBucketType(),
        BucketTabs: storedTabs,
        Starred: bucket.getStarred(),
        Locked: bucket.getLocked(),
      };
  
      storageBuckets.push(storageBucket);
    });
  
    this.setStorage('buckets', storageBuckets);
  }
  
  async getArchivedStorage(): Promise<Array<BucketDataModel>> {
    let storedBuckets: Array<BucketDataModel> = [];
  
    const buckets: Array<BucketStorageDataModel> = await this.getStorage('archived');
  
    if (buckets.length > 0) {
      buckets.forEach((bucket: BucketStorageDataModel) => {
        let newBucket = new BucketDataModel(
          bucket.BucketID,
          bucket.BucketName,
          bucket.Order,
          bucket.BucketType,
          bucket.Starred,
          bucket.Locked
        );
  
        bucket.BucketTabs.forEach((tab: TabStorageDataModel) => {
          let tabData = new TabDataModel(
            tab.TabName,
            tab.TabURL,
            tab.Order,
            tab.TabID,
          );
          newBucket.addTab(tabData);
        });
        storedBuckets.push(newBucket);
      });
    }
  
    return Promise.resolve(storedBuckets);
  }
  
  setArchivedStorage(archived: Array<BucketDataModel>): void {
    let storageBuckets: Array<BucketStorageDataModel> = [];
  
    archived.forEach((bucket: BucketDataModel) => {
      let storageTabs: Array<TabStorageDataModel> = [];
  
      bucket.getTabs().forEach((tab: TabDataModel) => {
        let storageTab: TabStorageDataModel = {
          TabID: tab.getTabID(),
          TabName: tab.getTabName(),
          TabURL: tab.getTabURL(),
          Order: tab.getOrder(),
        };
  
        storageTabs.push(storageTab);
      });
  
      let storageBucket: BucketStorageDataModel = {
        BucketID: bucket.getBucketID(),
        BucketName: bucket.getBucketName(),
        Order: bucket.getOrder(),
        BucketType: bucket.getBucketType(),
        BucketTabs: storageTabs,
        Starred: bucket.getStarred(),
        Locked: bucket.getLocked()
      };
  
      storageBuckets.push(storageBucket);
    });
  
    this.setStorage('archived', storageBuckets);
  }
  
  private async getStorage(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this._useBrowserStorage) {
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
  
  private removeStorage(key: string): void {
    if (this._useBrowserStorage) {
      localStorage.removeItem(key);
    } else {
      chrome.storage.local.remove(key);
    }
  }
  
  private setStorage(key: string, value: any): void {
    if (this._useBrowserStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      chrome.storage.local.set({ [key]: value });
    }
  }
  
}



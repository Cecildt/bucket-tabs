import { ulid } from 'ulid';
import { StorageAdapter } from './storage';
import { traceInfo } from './trace';

export enum BucketType {
  Default = 'default',
  Archived = 'archived',
  Normal = 'normal'
}

export class BucketListDataModel {
  private _buckets: Array<BucketDataModel> = [];
  private _archived: Array<BucketDataModel> = [];
  private _storageAdapter = new StorageAdapter();

  constructor() {}

  async initDataSet(): Promise<void> {
    let buckets = await this._storageAdapter.getBucketsStorage();
    let archived = await this._storageAdapter.getArchivedStorage();

    if (buckets.length > 0) {
      this._buckets = buckets;
    } else {
      this._buckets.push(
        new BucketDataModel(undefined, 'Default Bucket', 1, BucketType.Default, false, true)
      );

      this._storageAdapter.setBucketsStorage(this._buckets);
    }

    if (archived.length > 0) {
      this._archived = archived;
    } else {
      this._archived.push(new BucketDataModel(undefined, 'Archived Bucket', 1, BucketType.Archived, false, true));
      this._storageAdapter.setArchivedStorage(this._archived);
    }
  }

  async initDemoDataSet(): Promise<void> {
    let buckets = await this._storageAdapter.getBucketsStorage();
    let archived = await this._storageAdapter.getArchivedStorage();

    if (buckets.length > 0) {
      this._buckets = buckets;
    } else {
      // Default bucket
      let defaultBucket = new BucketDataModel(
        undefined,
        'Default Bucket',
        1,
        BucketType.Default,
        false,
        true
      );
      defaultBucket.addTab(
        new TabDataModel('Google', 'https://www.google.com', 1)
      );
      defaultBucket.addTab(
        new TabDataModel('YouTube', 'https://www.youtube.com', 2)
      );
      defaultBucket.addTab(
        new TabDataModel('Reddit', 'https://www.reddit.com', 3)
      );

      this._buckets.push(defaultBucket);

      // Demo bucket
      let demoBucket = new BucketDataModel(undefined, 'Demo Bucket', 2);
      demoBucket.addTab(
        new TabDataModel('Twitter', 'https://twitter.com', 1)
      );
      demoBucket.addTab(
        new TabDataModel('Facebook', 'https://www.facebook.com', 2)
      );
      this._buckets.push(demoBucket);
    }

    if (archived.length > 0) {
      this._archived = archived;
    } else {
      // Archived bucket
      this._archived = [];
      let archivedBuckets = new BucketDataModel(
        undefined,
        'Archived Bucket',
        1,
        BucketType.Archived,
        false,
        true
      );
      archivedBuckets.addTab(
        new TabDataModel('GitHub', 'https://github.com', 1)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow', 'https://stackoverflow.com', 2)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 2', 'https://stackoverflow.com', 3)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 3', 'https://stackoverflow.com', 4)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 4', 'https://stackoverflow.com', 5)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 5', 'https://stackoverflow.com', 6)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 6', 'https://stackoverflow.com', 7)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 7', 'https://stackoverflow.com', 8)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 8', 'https://stackoverflow.com', 9)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 9', 'https://stackoverflow.com', 10)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 10', 'https://stackoverflow.com', 11)
      );
      archivedBuckets.addTab(
        new TabDataModel('StackOverflow 11', 'https://stackoverflow.com', 12)
      );
      

      this._archived.push(archivedBuckets);
    }

    this._storageAdapter.setBucketsStorage(this._buckets);
    this._storageAdapter.setArchivedStorage(this._archived);
  }

  addBucket(bucket: BucketDataModel): void {
    bucket.setOrder(this._buckets.length + 1);
    this._buckets.push(bucket);
    this._storageAdapter.setBucketsStorage(this._buckets);
  }

  removeBucket(bucket: BucketDataModel): void {
    let index = this._buckets.indexOf(bucket);
    if (index > -1) {
      this._buckets.splice(index, 1);
    }

    this._storageAdapter.setBucketsStorage(this._buckets);
  }

  removeAllBuckets(): void {
    let defaultBuckets = this._buckets.filter((bucket) => {
      let bucketType = bucket.getBucketType();
      return bucketType === BucketType.Default;
    });

    this._buckets = defaultBuckets;
    this._storageAdapter.setBucketsStorage(this._buckets);
  }

  getBuckets(): Array<BucketDataModel> {
    return this._buckets;
  }

  getBucketByID(bucketID: String): BucketDataModel | undefined {
    return this._buckets.find((bucket) => bucket.getBucketID() === bucketID);
  }

  getArchivedBuckets(): Array<BucketDataModel> {
    return this._archived;
  }

  getDefaultBucket(): BucketDataModel | undefined {  
    return this._buckets.find((bucket) => bucket.getBucketType() === BucketType.Default);
  }

  saveBucket(bucket: BucketDataModel): void {
    let index = this._buckets.findIndex(
      (item) => item.getBucketID() === bucket.getBucketID()
    );

    if (index > -1) {
      this._buckets[index] = bucket;
      this._storageAdapter.setBucketsStorage(this._buckets);
    }
  }

  saveArchiveBucket(bucket: BucketDataModel): void {
    let index = this._archived.findIndex(
      (item) => item.getBucketID() === bucket.getBucketID()
    );

    if (index > -1) {
      this._archived[index] = bucket;
      this._storageAdapter.setArchivedStorage(this._archived);
    }
  }
}

export class BucketDataModel {
  private BucketID: String = ulid();
  private BucketName: String = '';
  private Order: Number = -1;
  private BucketTabs: Array<TabDataModel> = [];
  private BucketType: BucketType = BucketType.Normal;
  private Starred: Boolean = false;
  private Locked: Boolean = false;

  constructor(
    id: String = ulid(),
    name: String,
    order: Number,
    bucketType?: BucketType,
    starred?: Boolean,
    locked?: Boolean
  ) {
    this.BucketID = id;
    this.BucketName = name;
    this.Order = order;
    this.BucketType = bucketType || BucketType.Normal;
    this.Starred = starred || false;
    this.Locked = locked || false;
  }

  addTab(tab: TabDataModel): void {

    let index = this.BucketTabs.findIndex((item) => item.getTabID() === tab.getTabID());
    if (index > -1) {
      traceInfo('Tab already exists - ID');
      return;
    }

    let tabIndex = this.BucketTabs.findIndex((item) => item.getTabURL() === tab.getTabURL());
    if (tabIndex > -1) {
      traceInfo('Tab already exists - URL');
      return;
    }

    tab.setOrder(this.BucketTabs.length + 1);    
    this.BucketTabs.push(tab);
  }

  removeTab(tab: TabDataModel): void {
    let index = this.BucketTabs.indexOf(tab);
    if (index > -1) {
      this.BucketTabs.splice(index, 1);
    }
  }

  removeTabs(): void {
    this.BucketTabs = [];
  }

  getTabs(): Array<TabDataModel> {
    return this.BucketTabs;
  }

  getOrder(): Number {
    return this.Order;
  }

  setOrder(order: Number): void {
    this.Order = order;
  }

  getBucketID(): String {
    return this.BucketID;
  }

  getBucketName(): String {
    return this.BucketName;
  }

  getBucketType(): BucketType {
    return this.BucketType;
  }

  getStarred(): Boolean {
    return this.Starred;
  }

  setStarred(value: Boolean): void {
    this.Starred = value;
  }

  getLocked(): Boolean {
    return this.Locked;
  }

  setLocked(value: Boolean): void {
    this.Locked = value;
  }

  setBucketName(name: String): void {
    this.BucketName = name;
  }
}

export class TabDataModel {
  private TabID: String = '';
  private TabName: String = '';
  private TabURL: String = '';
  private Order: Number = -1;

  constructor(
    name: String,
    url: String,
    order: Number,
    id?: String,
  ) {
    this.TabID = id ?? ulid();
    this.TabName = name;
    this.TabURL = url;
    this.Order = order;
  }

  setOrder(order: Number): void {
    this.Order = order;
  }

  getOrder(): Number {
    return this.Order;
  }

  getTabID(): String {
    return this.TabID;
  }

  getTabName(): String {
    return this.TabName;
  }

  getTabURL(): String {
    return this.TabURL;
  }

  setTabName(name: String): void {
    this.TabName = name;
  }

  setTabURL(url: String): void {
    this.TabURL = url;
  }

  setTabID(id: String): void {
    this.TabID = id;
  }
}

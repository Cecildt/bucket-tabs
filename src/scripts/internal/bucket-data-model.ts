import { ulid } from 'ulid';
import { StorageAdapter } from './storage';

export class BucketListDataModel {
  private _buckets: Array<BucketDataModel> = [];
  private _archived: Array<BucketDataModel> = [];
  private _storageAdapter = new StorageAdapter();

  constructor() {
  }

  async initDataSet(): Promise<void> {
    let buckets = await this._storageAdapter.getBucketsStorage();
    let archived = await this._storageAdapter.getArchivedStorage();

    if (buckets.length > 0) {
      this._buckets = buckets;
    } else {
      this._buckets.push(
        new BucketDataModel(undefined, 'Default Bucket', 1, true)
      );

      this._storageAdapter.setBucketsStorage(this._buckets);
    }

    if (archived.length > 0) {
      this._archived = archived;
    } else {
      this._archived.push(new BucketDataModel(undefined, 'Archived Bucket', 1));
      this._storageAdapter.setArchivedStorage(this._archived);
    }
  }

  initDemoDataSet(): void {
    this._buckets = [];
    this._buckets.push(
      new BucketDataModel(undefined, 'Default Bucket', 1, true)
    );
    this._buckets.push(new BucketDataModel(undefined, 'Demo Bucket', 2));

    this._archived = [];
    this._archived.push(
      new BucketDataModel(undefined, 'Archived Bucket', 1, true)
    );

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
      let defaultType = bucket.getDefaultType();
      return defaultType === true;
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
  private DefaultType: Boolean = false;
  private Starred: Boolean = false;
  private Locked: Boolean = false;

  constructor(
    id: String = ulid(),
    name: String,
    order: Number,
    defaultType?: Boolean,
    starred?: Boolean,
    locked?: Boolean
  ) {
    this.BucketID = id;
    this.BucketName = name;
    this.Order = order;
    this.DefaultType = defaultType || false;
    this.Starred = starred || false;
    this.Locked = locked || false;
  }

  addTab(tab: TabDataModel): void {
    tab.setOrder(this.BucketTabs.length + 1);
    this.BucketTabs.push(tab);
  }

  removeTab(tab: TabDataModel): void {
    let index = this.BucketTabs.indexOf(tab);
    if (index > -1) {
      this.BucketTabs.splice(index, 1);
    }
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

  getDefaultType(): Boolean {
    return this.DefaultType;
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
}

export class TabDataModel {
  private TabID: Number = -1;
  private TabName: String = '';
  private TabURL: String = '';
  private TabBucketID: Number = -1;
  private Order: Number = -1;

  constructor(
    id: Number,
    name: String,
    url: String,
    bucketID: Number,
    order: Number
  ) {
    this.TabID = id;
    this.TabName = name;
    this.TabURL = url;
    this.TabBucketID = bucketID;
    this.Order = order;
  }

  setOrder(order: Number): void {
    this.Order = order;
  }

  getOrder(): Number {
    return this.Order;
  }

  getTabID(): Number {
    return this.TabID;
  }

  getTabName(): String {
    return this.TabName;
  }

  getTabURL(): String {
    return this.TabURL;
  }

  getTabBucketID(): Number {
    return this.TabBucketID;
  }

  setTabBucketID(id: Number): void {
    this.TabBucketID = id;
  }

  setTabName(name: String): void {
    this.TabName = name;
  }

  setTabURL(url: String): void {
    this.TabURL = url;
  }

  setTabID(id: Number): void {
    this.TabID = id;
  }
}

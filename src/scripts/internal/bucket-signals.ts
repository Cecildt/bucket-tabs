import { BucketDataModel, BucketType } from './bucket-data-model';
import { createSignal } from './signals';

export enum BucketEvents {
  LoadBuckets,
  LoadArchive,
  AddBucket,
  DeleteBucket,
  DeleteAllBuckets,
  ExportBuckets,
  ArchiveBucket,
  LockBucket,
  StarBucket,
  RenameBucket,
}

export interface RenameBucketType {
  BucketID: String;
  BucketName: String;
}

export class BucketSignals {
  private _loadBucketsSignal = createSignal<void>();
  private _loadArchiveSignal = createSignal<void>();
  private _addBucketSignal = createSignal<void>();
  private _deleteBucketSignal = createSignal<String>();
  private _deleteAllBucketsSignal = createSignal<void>();
  private _exportBucketsSignal = createSignal<void>();
  private _archiveBucketSignal = createSignal<String>();
  private _lockBucketSignal = createSignal<String>();
  private _starBucketSignal = createSignal<String>();
  private _renameBucketSignal = createSignal<RenameBucketType>();

  constructor() {
    this.setupSignals();
  }

  emit(event: BucketEvents, value?: any) {
    switch (event) {
      case BucketEvents.LoadBuckets:
        this._loadBucketsSignal();
        break;
      case BucketEvents.LoadArchive:
        this._loadArchiveSignal();
        break;
      case BucketEvents.AddBucket:
        this._addBucketSignal();
        break;
      case BucketEvents.DeleteBucket:
        this._deleteBucketSignal(value);
        break;
      case BucketEvents.DeleteAllBuckets:
        this._deleteAllBucketsSignal();
        break;
      case BucketEvents.ExportBuckets:
        this._exportBucketsSignal();
        break;
      case BucketEvents.ArchiveBucket:
        this._archiveBucketSignal(value);
        break;
      case BucketEvents.LockBucket:
        this._lockBucketSignal(value);
        break;
      case BucketEvents.StarBucket:
        this._starBucketSignal(value);
        break;
      case BucketEvents.RenameBucket:
        this._renameBucketSignal(value);
        break;

      default:
        console.error('No bucket signal match!');
        break;
    }
  }

  private setupSignals() {
    this._loadBucketsSignal(() => {
      console.log('Signal: Load Buckets');
      this.loadBucketsViewData();
    });

    this._loadArchiveSignal(() => {
      console.log('Signal: Load Archive');
      this.loadArchiveViewData();
    });

    this._addBucketSignal(() => {
      console.log('Signal: Add Bucket');
      this.addBucketViewData();
    });

    this._deleteBucketSignal((bucketID) => {
      console.log('Signal: Delete Bucket');
      this.deleteBucketViewData(bucketID);
    });

    this._deleteAllBucketsSignal(() => {
      console.log('Signal: Delete All Buckets');
      this.deleteAllBucketsViewData();
    });

    this._exportBucketsSignal(() => {
      console.log('Signal: Export Buckets');
      this.exportBucketsData();
    });

    this._archiveBucketSignal((bucketID) => {
      console.log('Signal: Archive Bucket');
      this.archiveBucketViewData(bucketID);
    });

    this._lockBucketSignal((bucketID) => {
      console.log('Signal: Lock Bucket');
      this.lockBucketViewData(bucketID);
    });

    this._starBucketSignal((bucketID) => {
      console.log('Signal: Star Bucket');
      this.starBucketViewData(bucketID);
    });

    this._renameBucketSignal((data) => {
      console.log('Signal: Rename Bucket');
      this.renameBucketViewData(data.BucketID, data.BucketName);
    });
  }

  // Signals functions
  private loadBucketsViewData() {
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private loadArchiveViewData() {
    const bucketListEl = document.getElementById('buckets-list-archive');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private addBucketViewData() {
    // Data
    let bucketsCount =
      window.globalBucketTabsState.BucketListDataModel.getBuckets().length + 1;
    let newBucketData = new BucketDataModel(
      undefined,
      'New Bucket - ' + bucketsCount,
      bucketsCount
    );

    window.globalBucketTabsState.BucketListDataModel.addBucket(newBucketData);

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private deleteBucketViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      window.globalBucketTabsState.BucketListDataModel.removeBucket(bucket);
    }

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private deleteAllBucketsViewData() {
    // Data
    window.globalBucketTabsState.BucketListDataModel.removeAllBuckets();

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  // Supporting functions
  private renderBucketsView(
    bucket_list: HTMLElement,
    buckets: BucketDataModel[]
  ): void {
    const bucketsFragment = document.createDocumentFragment();
    const bucket_template = document.getElementById('template-bucket');
    const default_bucket_template = document.getElementById(
      'template-default-bucket'
    );
    const archived_bucket_template = document.getElementById(
      'template-archived-bucket'
    );

    let star_buckets = buckets.filter((bucket) => {
      return bucket.getStarred();
    });

    let unstar_buckets = buckets.filter((bucket) => {
      return !bucket.getStarred();
    });

    star_buckets.sort((a, b) => {
      if (a.getOrder() > b.getOrder()) {
        return 1;
      } else {
        return -1;
      }
    });

    unstar_buckets.sort((a, b) => {
      if (a.getOrder() > b.getOrder()) {
        return 1;
      } else {
        return -1;
      }
    });

    const sorted_buckets = star_buckets.concat(unstar_buckets);

    sorted_buckets.forEach((bucket: BucketDataModel) => {
      if (!bucket_template) return;
      if (!default_bucket_template) return;
      if (!archived_bucket_template) return;

      const fragment = document.createDocumentFragment();
      fragment.appendChild(document.createElement('li'));

      let newBucket = bucket_template.cloneNode(true);
      if (bucket.getBucketType() === BucketType.Default) {
        newBucket = default_bucket_template.cloneNode(true);
      }

      if (bucket.getBucketType() === BucketType.Archived) {
        newBucket = archived_bucket_template.cloneNode(true);
      }

      if (newBucket) {
        if (fragment.firstChild) {
          fragment.firstChild.appendChild(newBucket);
          let bucketEL = fragment.firstChild.firstChild as HTMLElement;
          let bucketID = bucket.getBucketID().toString();
          bucketEL.removeAttribute('id');
          bucketEL.setAttribute('id', bucketID);

          // Set Title
          const collapseTitle = bucketEL.querySelector('.bt-bucket-name');
          if (collapseTitle) {
            collapseTitle.textContent = bucket.getBucketName().toString();
          }

          // Set Tabs Count
          const tabsCountEl = bucketEL.querySelector('.bt-tabs-count');

          if (tabsCountEl) {
            const tabsCount = bucket.getTabs().length;
            tabsCountEl.textContent = tabsCount.toString();
          }

          // Set Star
          const star: HTMLElement | null =
            bucketEL.querySelector('.bt-bucket-star');
          if (star) {
            if (bucket.getStarred()) {
              star.style.display = '';
            } else {
              star.style.display = 'none';
            }
          }

          // Set Lock
          const lock: HTMLElement | null =
            bucketEL.querySelector('.bt-bucket-lock');
          if (lock) {
            if (bucket.getLocked()) {
              lock.style.display = '';
            } else {
              lock.style.display = 'none';
            }

            if (bucket.getBucketType() === BucketType.Default) {
              lock.style.display = '';
            }

            if (bucket.getBucketType() === BucketType.Archived) {
              lock.style.display = '';
            }
          }

          // Set Tabs
          const tabs = bucket.getTabs();
          const tabsEl = bucketEL.querySelector('.bt-tabs-list');
          if (tabsEl) {
            tabsEl.innerHTML = '';

            const tab_template = document.getElementById('tabItemTemplate');
            if (tab_template) {
              tabs.forEach((tab) => {
                let newTab = tab_template.cloneNode(true);
                if (newTab) {
                  let tabEl = newTab as HTMLElement;

                  if (!tabEl) {
                    return;
                  }

                  tabEl.removeAttribute('id');
                  tabEl.setAttribute('id', tab.getTabID().toString());

                  let link = tabEl.children[0] as HTMLLinkElement;

                  if (link) {
                    link.href = tab.getTabURL().toString();
                    link.textContent = tab.getTabName().toString();
                  }

                  tabsEl.appendChild(tabEl);
                }
              });
            }
          }
        }

        bucketsFragment.appendChild(fragment);
      }
    });

    bucket_list.replaceChildren(bucketsFragment);
  }

  private exportBucketsData() {
    // Data Export
    const jsonData =
      window.globalBucketTabsState.BucketListDataModel.getBuckets();

    const archiveData =
      window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets();
    archiveData.forEach((bucket) => {
      jsonData.push(bucket);
    });

    const blob = new Blob([JSON.stringify(jsonData)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buckets-export.json';
    a.click();
  }

  private archiveBucketViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      let archiveBuckets =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets();
      if (archiveBuckets.length > 0) {
        let archiveBucket = archiveBuckets[0];
        bucket.getTabs().forEach((tab) => {
          archiveBucket.addTab(tab);
        });

        window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
          archiveBucket
        );
      }

      window.globalBucketTabsState.BucketListDataModel.removeBucket(bucket);
    }

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }

    const archiveListEl = document.getElementById('buckets-list-archive');
    if (archiveListEl) {
      let archiveBuckets =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets();
      this.renderBucketsView(archiveListEl, archiveBuckets);
    }
  }

  private lockBucketViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.setLocked(!bucket.getLocked());
      window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
    }

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private starBucketViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.setStarred(!bucket.getStarred());
      window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
    }

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }

  private renameBucketViewData(bucketID: String, name: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.setBucketName(name);
      window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
    }

    // View
    const bucketListEl = document.getElementById('buckets-list');
    if (bucketListEl) {
      let buckets =
        window.globalBucketTabsState.BucketListDataModel.getBuckets();
      this.renderBucketsView(bucketListEl, buckets);
    }
  }
}
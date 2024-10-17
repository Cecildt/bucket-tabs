import { BucketDataModel } from './bucket-data-model';
import { createSignal } from './signals';

export enum BucketEvents {
  LoadBuckets,
  LoadArchive,
  AddBucket,
  DeleteBucket,
  DeleteAllBuckets,
}

export class BucketSignals {
  private loadBucketsSignal = createSignal<void>();
  private loadArchiveSignal = createSignal<void>();
  private addBucketSignal = createSignal<void>();
  private deleteBucketSignal = createSignal<String>();
  private deleteAllBucketsSignal = createSignal<void>();

  constructor() {
    this.setupSignals();
  }

  emit(event: BucketEvents, value?: any) {
    switch (event) {
      case BucketEvents.LoadBuckets:
        this.loadBucketsSignal();
        break;
      case BucketEvents.LoadArchive:
        this.loadArchiveSignal();
        break;
      case BucketEvents.AddBucket:
        this.addBucketSignal();
        break;
      case BucketEvents.DeleteBucket:
        this.deleteBucketSignal(value);
        break;
      case BucketEvents.DeleteAllBuckets:
        this.deleteAllBucketsSignal();
        break;

      default:
        console.error('No bucket signal match!');
        break;
    }
  }

  private setupSignals() {
    this.loadBucketsSignal(() => {
      console.log('Signal: Load Buckets');
      this.loadBucketsViewData();
    });

    this.loadArchiveSignal(() => {
      console.log('Signal: Load Archive');
      this.loadArchiveViewData();
    });

    this.addBucketSignal(() => {
      console.log('Signal: Add Bucket');
      this.addBucketViewData();
    });

    this.deleteBucketSignal((bucketID) => {
      console.log('Signal: Delete Bucket');
      this.deleteBucketViewData(bucketID);
    });

    this.deleteAllBucketsSignal(() => {
      console.log('Signal: Delete All Buckets');
      this.deleteAllBucketsViewData();
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

    buckets.forEach((bucket: BucketDataModel) => {
      const bucket_template = document.getElementById('template-bucket');

      if (!bucket_template) return;

      const fragment = document.createDocumentFragment();
      fragment.appendChild(document.createElement('li'));
      let newBucket = bucket_template.cloneNode(true);

      if (newBucket) {
        if (fragment.firstChild) {
          fragment.firstChild.appendChild(newBucket);
          let bucketEL = fragment.firstChild.firstChild as HTMLElement;
          let bucketID = bucket.getBucketID().toString();
          bucketEL.removeAttribute('id');
          bucketEL.setAttribute('id', bucketID);

          const collapseTitle = bucketEL.querySelector('.bt-bucket-name');
          if (collapseTitle) {
            collapseTitle.textContent = bucket.getBucketName().toString();
          }
        }

        bucketsFragment.appendChild(fragment);
      }
    });

    bucket_list.replaceChildren(bucketsFragment);
  }
}

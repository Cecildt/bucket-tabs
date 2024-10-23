import { BucketDataModel, BucketType } from './bucket-data-model';
import { BucketEvents } from './bucket-signals';
import { createSignal } from './signals';

export enum TabEvents {
  AddTab,
  DeleteTab,
  DeleteTabs,
  ArchiveTabs,
  RestoreTabs,
}

export class TabSignals {
  private _archiveTabsSignal = createSignal<String>();
  private _deleteTabsSignal = createSignal<String>();
  private _restoreTabsSignal = createSignal<String>();

  constructor() {
    this.setupSignals();
  }

  emit(event: TabEvents, value?: any) {
    switch (event) {
      case TabEvents.ArchiveTabs:
        this._archiveTabsSignal(value);
        break;
      case TabEvents.DeleteTabs:
        this._deleteTabsSignal(value);
        break;
      case TabEvents.RestoreTabs:
        this._restoreTabsSignal(value);
        break;

      default:
        console.error('No tab signal match!');
        break;
    }
  }

  private setupSignals() {
    this._archiveTabsSignal((bucketID) => {
      console.log('Signal: Archive Tabs');
      this.archiveTabsViewData(bucketID);
    });

    this._deleteTabsSignal((bucketID) => {
      console.log('Signal: Delete Tabs');
      this.deleteTabsViewData(bucketID);
    });

    this._restoreTabsSignal((bucketID) => {
      console.log('Signal: Restore Tabs');
      this.restoreTabsViewData(bucketID);
    });
  }

  // Signals functions
  private archiveTabsViewData(bucketID: String) {
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

      bucket.removeTabs();
      window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
    }

    // View
    window.globalBucketTabsState.BucketSignals.emit(BucketEvents.LoadBuckets);
    window.globalBucketTabsState.BucketSignals.emit(BucketEvents.LoadArchive);
  }

  private deleteTabsViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.removeTabs();
      window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);

      // View
      window.globalBucketTabsState.BucketSignals.emit(BucketEvents.LoadBuckets);
    } else {
      let archiveBucket =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];

      if (archiveBucket) {
        archiveBucket.removeTabs();
        window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(archiveBucket);

        // View
        window.globalBucketTabsState.BucketSignals.emit(
          BucketEvents.LoadArchive
        );
      }
    }
  }

  private restoreTabsViewData(bucketID: String) {
    console.log('Restore tabs: ', bucketID);
  }
}

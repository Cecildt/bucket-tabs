import { BucketDataModel, BucketType } from './bucket-data-model';
import { BucketEvents } from './bucket-signals';
import { createSignal } from './signals';

export interface CurrentTabInfo {
  BucketID: String;
  TabID: String;
}

export enum TabEvents {
  AddTab,
  DeleteTab,
  DeleteTabs,
  ArchiveTabs,
  ArchiveTab,
  RestoreTabs,
  OpenWindowTab,
}

export class TabSignals {
  private _archiveTabsSignal = createSignal<String>();
  private _deleteTabsSignal = createSignal<String>();
  private _restoreTabsSignal = createSignal<String>();
  private _deleteTabSignal = createSignal<CurrentTabInfo>();
  private _archiveTabSignal = createSignal<CurrentTabInfo>();
  private _openWindowTabSignal = createSignal<CurrentTabInfo>();

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
      case TabEvents.DeleteTab:
        this._deleteTabSignal(value);
        break;
      case TabEvents.ArchiveTab:
        this._archiveTabSignal(value);
        break;
      case TabEvents.OpenWindowTab:
        this._openWindowTabSignal(value);
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

    this._archiveTabSignal((currentTabInfo) => {
      console.log('Signal: Archive Tab');
      this.archiveTab(currentTabInfo);
    });

    this._deleteTabSignal((currentTabInfo) => {
      console.log('Signal: Delete Tab');
      this.deleteTab(currentTabInfo);
    });

    this._openWindowTabSignal((currentTabInfo) => {
      console.log('Signal: Open New Window Tab');
      this.openWindowTab(currentTabInfo);
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
        window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
          archiveBucket
        );

        // View
        window.globalBucketTabsState.BucketSignals.emit(
          BucketEvents.LoadArchive
        );
      }
    }
  }

  private restoreTabsViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.getTabs().forEach((tab) => {
        window.open(tab.getTabURL().toString(), '_blank');
      });

      if (!bucket.getLocked()) {
        bucket.removeTabs();
        window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);

        // View
        window.globalBucketTabsState.BucketSignals.emit(
          BucketEvents.LoadBuckets
        );
      }
    } else {
      let archiveBucket =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];

      if (archiveBucket) {
        archiveBucket.getTabs().forEach((tab) => {
          window.open(tab.getTabURL().toString(), '_blank');
        });

        if (!archiveBucket.getLocked()) {
          archiveBucket.removeTabs();
          window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
            archiveBucket
          );

          // View
          window.globalBucketTabsState.BucketSignals.emit(
            BucketEvents.LoadArchive
          );
        }
      }
    }
  }

  private deleteTab(currentTabInfo: CurrentTabInfo) {
    if (!currentTabInfo) {
      return;
    }

    if (currentTabInfo.BucketID === '') {
      return;
    }

    if (currentTabInfo.TabID === '') {
      return;
    }

    // Data
    let bucket = window.globalBucketTabsState.BucketListDataModel.getBucketByID(
      currentTabInfo.BucketID
    );

    if (bucket) {
      let currentTab = bucket
        .getTabs()
        .find((tab) => tab.getTabID() === currentTabInfo.TabID);

      if (currentTab) {
        bucket.removeTab(currentTab);
        window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
        // View
        window.globalBucketTabsState.BucketSignals.emit(
          BucketEvents.LoadBuckets
        );
      }
    }
  }

  private archiveTab(currentTabInfo: CurrentTabInfo) {
    if (!currentTabInfo) {
      return;
    }

    if (currentTabInfo.BucketID === '') {
      return;
    }

    if (currentTabInfo.TabID === '') {
      return;
    }

    // Data
    let bucket = window.globalBucketTabsState.BucketListDataModel.getBucketByID(
      currentTabInfo.BucketID
    );

    if (bucket) {
      let currentTab = bucket
        .getTabs()
        .find((tab) => tab.getTabID() === currentTabInfo.TabID);

      if (currentTab) {
        let archiveBucket =
          window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];

        if (archiveBucket) {
          archiveBucket.addTab(currentTab);
          window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(archiveBucket);
          
          bucket.removeTab(currentTab);
          window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);

          // View
          window.globalBucketTabsState.BucketSignals.emit(
            BucketEvents.LoadBuckets
          );
          window.globalBucketTabsState.BucketSignals.emit(
            BucketEvents.LoadArchive
          );
        }
      }
    }
  }

  private openWindowTab(currentTabInfo: CurrentTabInfo) {
    if (!currentTabInfo) {
      return;
    }

    if (currentTabInfo.BucketID === '') {
      return;
    }

    if (currentTabInfo.TabID === '') {
      return;
    }

    // Data
    let bucket = window.globalBucketTabsState.BucketListDataModel.getBucketByID(
      currentTabInfo.BucketID
    );

    if (bucket) {
      let currentTab = bucket
        .getTabs()
        .find((tab) => tab.getTabID() === currentTabInfo.TabID);

      if (currentTab) {
        // TODO: Fix to use Chrome API to open new window with tab
        window.open(currentTab.getTabURL().toString(), '_blank');
      }
    }


  }
}

import { BucketDataModel, BucketType } from './bucket-data-model';
import { BucketEvents } from './bucket-signals';
import { createSignal } from './signals';
import { traceInfo } from './trace';

export interface CurrentTabInfo {
  BucketID: String;
  TabID: String;
}

export interface MoveTabToBucketType {
  TabID: String;
  CurrentBucketID: String;
  NewBucketID: String;
}

export enum TabEvents {
  AddTab,
  DeleteTab,
  DeleteTabs,
  ArchiveTabs,
  ArchiveTab,
  RestoreTabs,
  RestoreTabsGrouped,
  OpenWindowTab,
  MoveTabToBucket,
  MoveTabDialog,
}

export class TabSignals {
  private _archiveTabsSignal = createSignal<String>();
  private _deleteTabsSignal = createSignal<String>();
  private _restoreTabsSignal = createSignal<String>();
  private _restoreTabsGroupedSignal = createSignal<String>();
  private _deleteTabSignal = createSignal<CurrentTabInfo>();
  private _archiveTabSignal = createSignal<CurrentTabInfo>();
  private _openWindowTabSignal = createSignal<CurrentTabInfo>();
  private _moveTabToBucketSignal = createSignal<MoveTabToBucketType>();
  private _moveTabDialogSignal = createSignal<CurrentTabInfo>();

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
      case TabEvents.RestoreTabsGrouped:
        this._restoreTabsGroupedSignal(value);
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
      case TabEvents.MoveTabToBucket:
        this._moveTabToBucketSignal(value);
        break;
      case TabEvents.MoveTabDialog:
        this._moveTabDialogSignal(value);
        break;

      default:
        console.error('No tab signal match!');
        break;
    }
  }

  private setupSignals() {
    this._archiveTabsSignal((bucketID) => {
      traceInfo('Signal: Archive Tabs');
      this.archiveTabsViewData(bucketID);
    });

    this._deleteTabsSignal((bucketID) => {
      traceInfo('Signal: Delete Tabs');
      this.deleteTabsViewData(bucketID);
    });

    this._restoreTabsSignal((bucketID) => {
      traceInfo('Signal: Restore Tabs');
      this.restoreTabsViewData(bucketID);
    });

    this._restoreTabsGroupedSignal((bucketID) => {
      traceInfo('Signal: Restore Tabs Grouped');
      this.restoreTabsGroupedViewData(bucketID);
    });

    this._archiveTabSignal((currentTabInfo) => {
      traceInfo('Signal: Archive Tab');
      this.archiveTab(currentTabInfo);
    });

    this._deleteTabSignal((currentTabInfo) => {
      traceInfo('Signal: Delete Tab');
      this.deleteTab(currentTabInfo);
    });

    this._openWindowTabSignal((currentTabInfo) => {
      traceInfo('Signal: Open New Window Tab');
      this.openWindowTab(currentTabInfo);
    });

    this._moveTabToBucketSignal((currentTabInfo) => {
      traceInfo('Signal: Move Tab To Bucket');
      this.moveTabToBucket(currentTabInfo);
    });

    this._moveTabDialogSignal((currentTabInfo) => {
      traceInfo('Signal: Move Tab Dialog');
      this.moveTabDialog(currentTabInfo);
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

  private restoreTabsGroupedViewData(bucketID: String) {
    // Data
    let bucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

    if (bucket) {
      bucket.getTabs().forEach((tab) => {
        // TODO: Fix to use Chome API to create browser group and restore tabs
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
          // TODO: Fix to use Chome API to create browser group and restore tabs
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

    if (!bucket) {
      bucket =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];
      if (bucket.getBucketID() !== currentTabInfo.BucketID) {
        bucket = undefined;
      }
    }

    if (bucket) {
      let currentTab = bucket
        .getTabs()
        .find((tab) => tab.getTabID() === currentTabInfo.TabID);

      if (currentTab) {
        bucket.removeTab(currentTab);

        // View
        if (bucket.getBucketType() === BucketType.Archived) {
          window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
            bucket
          );
          window.globalBucketTabsState.BucketSignals.emit(
            BucketEvents.LoadArchive
          );
        } else {
          window.globalBucketTabsState.BucketListDataModel.saveBucket(bucket);
          window.globalBucketTabsState.BucketSignals.emit(
            BucketEvents.LoadBuckets
          );
        }
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
          window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
            archiveBucket
          );

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

  private moveTabToBucket(currentTabInfo: MoveTabToBucketType) {
    if (!currentTabInfo) {
      return;
    }

    if (currentTabInfo.CurrentBucketID === '') {
      return;
    }

    if (currentTabInfo.TabID === '') {
      return;
    }

    // Data
    let currentBucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(
        currentTabInfo.CurrentBucketID
      );

    if (!currentBucket) {
      currentBucket =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];
      if (currentBucket.getBucketID() !== currentTabInfo.CurrentBucketID) {
        currentBucket = undefined;
      }
    }

    let newBucket =
      window.globalBucketTabsState.BucketListDataModel.getBucketByID(
        currentTabInfo.NewBucketID
      );
    if (!newBucket) {
      newBucket =
        window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets()[0];
      if (newBucket.getBucketID() !== currentTabInfo.CurrentBucketID) {
        newBucket = undefined;
      }
    }

    if (!currentBucket) {
      return;
    }

    if (!newBucket) {
      return;
    }

    let currentTab = currentBucket
      .getTabs()
      .find((tab) => tab.getTabID() === currentTabInfo.TabID);

    if (currentTab) {
      newBucket.addTab(currentTab);
      if (currentBucket.getBucketType() === BucketType.Archived) {
        window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
          newBucket
        );
      } else {
        window.globalBucketTabsState.BucketListDataModel.saveBucket(newBucket);
      }

      currentBucket.removeTab(currentTab);

      if (currentBucket.getBucketType() === BucketType.Archived) {
        window.globalBucketTabsState.BucketListDataModel.saveArchiveBucket(
          currentBucket
        );
      } else {
        window.globalBucketTabsState.BucketListDataModel.saveBucket(
          currentBucket
        );
      }
      
      // View
      window.globalBucketTabsState.BucketSignals.emit(BucketEvents.LoadBuckets);
      window.globalBucketTabsState.BucketSignals.emit(BucketEvents.LoadArchive);
    }
  }

  private moveTabDialog(currentTabInfo: CurrentTabInfo) {
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

    let buckets = window.globalBucketTabsState.BucketListDataModel.getBuckets();
    let archiveBuckets =
      window.globalBucketTabsState.BucketListDataModel.getArchivedBuckets();

    if (bucket) {
      buckets = buckets.filter((b) => b.getBucketID() !== bucket.getBucketID());
    } else {
      archiveBuckets = archiveBuckets.filter(
        (b) => b.getBucketID() !== archiveBuckets[0].getBucketID()
      );
    }

    if (archiveBuckets.length > 0) {
      buckets.push(archiveBuckets[0]);
    }

    // View
    let listFragment = document.createDocumentFragment();

    buckets.forEach((bucket) => {
      let item = document.createElement('li');
      item.classList.add('flex', 'items-center', 'py-2');
      item.innerHTML = `<input type="radio" name="bucket" class="radio radio-success mr-5" value="${bucket.getBucketID()}" />
                        <span>${bucket.getBucketName()}</span>`;
      listFragment.appendChild(item);
    });

    let bucketList = document.getElementById('bt-move-tab-buckets-list');
    if (bucketList) {
      bucketList.innerHTML = '';
      bucketList.appendChild(listFragment);
    }

    let moveTabButton = document.getElementById('bt-move-tab-bucket-btn');
    moveTabButton?.setAttribute('data-tab-id', currentTabInfo.TabID.toString());
    moveTabButton?.setAttribute(
      'data-current-bucket-id',
      currentTabInfo.BucketID.toString()
    );

    const renameBucketDialog = document.getElementById(
      'bt-move-tab-bucket-dialog'
    );
    if (renameBucketDialog) {
      renameBucketDialog.showModal();
    }
  }
}

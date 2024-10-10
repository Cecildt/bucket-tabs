import { BucketListDataModel } from './bucket-data-model';

export class GlobalBucketTabsState {
    private CurrentBucketID: String = '';
    private CurrentBucketName: String = '';
    private BrowserStorage: Boolean = false;
    public BucketListDataModel: BucketListDataModel = new BucketListDataModel();

    
    constructor() {
    }

    initDataSet(): void {
        this.BucketListDataModel.initDataSet();
    }

    setCurrentBucketName(name: String): void{
        this.CurrentBucketName = name;
    }

    getCurrentBucketName(): String {
        return this.CurrentBucketName;
    }

    setCurrentBucketID(id: String): void{
        this.CurrentBucketID = id;
    }

    getCurrentBucketID(): String {
        return this.CurrentBucketID;
    }

    setBrowserStorage(value: Boolean): void {
        this.BrowserStorage = value;
    }

    getBrowserStorage(): Boolean {
        return this.BrowserStorage;
    }
}

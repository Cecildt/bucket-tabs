import { BucketListDataModel } from './bucket-data-model';
import { BucketSignals } from './bucket-signals';
import { TabSignals } from './tab-signals';

export class GlobalBucketTabsState {
    private _currentBucketID: String = '';
    private _currentBucketName: String = '';
    
    public BucketListDataModel: BucketListDataModel = new BucketListDataModel();
    public BucketSignals = new BucketSignals();
    public TabSignals = new TabSignals();

    
    constructor() {
    }

    async initDataSet(): Promise<void> {
        await this.BucketListDataModel.initDataSet();
    }

    setCurrentBucketName(name: String): void{
        this._currentBucketName = name;
    }

    getCurrentBucketName(): String {
        return this._currentBucketName;
    }

    setCurrentBucketID(id: String): void{
        this._currentBucketID = id;
    }

    getCurrentBucketID(): String {
        return this._currentBucketID;
    }
}

import { BucketListDataModel } from './bucket-data-model';

export class GlobalBucketTabsState {
    private CurrentBucketID: String = '';
    private CurrentBucketName: String = '';
    public BucketListDataModel: BucketListDataModel = new BucketListDataModel();
    
    constructor() {
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
}

export class GlobalBucketTabsObject {
    private CurrentBucketID: String = '';
    private CurrentBucketName: String = '';
    
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

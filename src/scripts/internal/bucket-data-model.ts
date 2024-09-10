
export class BucketListDataModel {
    private Buckets: Array<BucketDataModel> = [];

    constructor() {
        this.Buckets.push(new BucketDataModel(1, 'Default Bucket', 1));
        this.Buckets.push(new BucketDataModel(2, 'Archive Bucket', 99));
    }

    addBucket(bucket: BucketDataModel): void {
        bucket.setOrder(this.Buckets.length+1);
        this.Buckets.push(bucket);
    }

    removeBucket(bucket: BucketDataModel): void {
        let index = this.Buckets.indexOf(bucket);
        if (index > -1) {
            this.Buckets.splice(index, 1);
        }
    }

    getBuckets(): Array<BucketDataModel> {
        return this.Buckets;
    }
}


export class BucketDataModel {
    private BucketID: Number = -1;
    private BucketName: String = '';
    private Order: Number = -1;
    private BucketTabs: Array<TabDataModel> = [];    
    
    constructor(id: Number, name: String, order: Number) {
        this.BucketID = id;
        this.BucketName = name;        
        this.Order = order;
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

    setOrder(order: Number): void {
        this.Order = order;
    }
}

export class TabDataModel {
    private TabID: Number = -1;
    private TabName: String = '';    
    private TabURL: String = '';
    private TabBucketID: Number = -1;
    private Order: Number = -1;
    
    constructor(id: Number, name: String, url: String, bucketID: Number, order: Number) {
        this.TabID = id;
        this.TabName = name;
        this.TabURL = url;
        this.TabBucketID = bucketID;
        this.Order = order;
    }

    setOrder(order: Number): void {
        this.Order = order;
    }
}
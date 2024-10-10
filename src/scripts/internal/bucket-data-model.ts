import { ulid } from 'ulid'
import { setBucketsStorage, getBucketsStorage, getArchivedStorage, setArchivedStorage } from './storage'

export class BucketListDataModel {
    private Buckets: Array<BucketDataModel> = [];
    private Archived: Array<BucketDataModel> = [];

    constructor() {               
    }

    async initDataSet(): Promise<void> {

        let buckets = await getBucketsStorage();
        let archived = await getArchivedStorage();

        if (buckets.length > 0) {
            this.Buckets = buckets;
        } else {
            this.Buckets.push(new BucketDataModel('Default Bucket', 1));
            setBucketsStorage(this.Buckets);
        }

        if (archived.length > 0) {
            this.Archived = archived;
        } else {
            this.Archived.push(new BucketDataModel('Archived Bucket', 1));
            setArchivedStorage(this.Archived);
        }
    }

    initDemoDataSet(): void {
        this.Buckets.push(new BucketDataModel('Default Bucket', 1));
        this.Buckets.push(new BucketDataModel('Demo Bucket', 2));
        this.Archived.push(new BucketDataModel('Archived Bucket', 1));

        setBucketsStorage(this.Buckets);
        setArchivedStorage(this.Archived);
    }

    addBucket(bucket: BucketDataModel): void {
        bucket.setOrder(this.Buckets.length+1);
        this.Buckets.push(bucket);
        setBucketsStorage(this.Buckets);
    }

    removeBucket(bucket: BucketDataModel): void {
        let index = this.Buckets.indexOf(bucket);
        if (index > -1) {
            this.Buckets.splice(index, 1);
        }
        setBucketsStorage(this.Buckets);
    }

    getBuckets(): Array<BucketDataModel> {
        return this.Buckets;
    }
}


export class BucketDataModel {
    private BucketID: String = ulid();
    private BucketName: String = '';
    private Order: Number = -1;
    private BucketTabs: Array<TabDataModel> = [];    
    
    constructor(name: String, order: Number) {
        this.BucketName = name;        
        this.Order = order;
        console.log(this.BucketID);
    }

    public addTab(tab: TabDataModel): void {
        tab.setOrder(this.BucketTabs.length + 1);
        this.BucketTabs.push(tab);
    }

    public removeTab(tab: TabDataModel): void {
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

    getBucketID(): String {
        return this.BucketID;
    }

    getBucketName(): String {
        return this.BucketName
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
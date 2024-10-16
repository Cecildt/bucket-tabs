import { BucketDataModel } from "./bucket-data-model";
import { createSignal } from "./signals";

export enum BucketEvents {
    AddBucket,
    DeleteBucket
}

export class BucketSignals{
    private addBucketSignal = createSignal<void>();
    private deleteBucketSignal = createSignal<String>();
    
    constructor(){
        this.addBucketSignal(() => {
            console.log('Signal: Add Bucket');
            this.addBucketViewData();
        });
        
        this.deleteBucketSignal((bucketID) => {
            console.log('Signal: Delete Bucket');
            this.deleteBucketViewData(bucketID);
        });
    }
    
    emit(event: BucketEvents, value?: any){
        switch (event) {
            case BucketEvents.AddBucket:
                this.addBucketSignal();
                break;
            case BucketEvents.DeleteBucket:
                this.deleteBucketSignal(value);
                break;
        
            default:
                console.error('No bucket signal match!');
                break;
        }
    }

    private addBucketViewData(){
        const bucket_template = document.getElementById('template-bucket');

        if (!bucket_template) return;

        const bucketList = document.getElementById('buckets-list');

        if (!bucketList) return;

        let bucketsCount =
          window.globalBucketTabsState.BucketListDataModel.getBuckets().length + 1;
        let newBucketData = new BucketDataModel(
          undefined,
          'New Bucket - ' + bucketsCount,
          bucketsCount
        );
        window.globalBucketTabsState.BucketListDataModel.addBucket(
          newBucketData
        );

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement('li'));
        let newBucket = bucket_template.cloneNode(true);

        if (newBucket) {
          if (fragment.firstChild) {
            fragment.firstChild.appendChild(newBucket);
            let bucket = fragment.firstChild.firstChild;
            (bucket as HTMLElement).removeAttribute('id');
            (bucket as HTMLElement).setAttribute(
              'id',
              newBucketData.getBucketID().toString()
            );

            const collapseTitle = (bucket as HTMLElement).querySelector(
              '.collapse-title'
            );
            if (collapseTitle) {
              collapseTitle.textContent = newBucketData
                .getBucketName()
                .toString();
            }
          }

          bucketList?.appendChild(fragment);
        }
    }
    
    private deleteBucketViewData(bucketID: String){
        // Data
        let bucket = window.globalBucketTabsState.BucketListDataModel.getBucketByID(bucketID);

        if (bucket) {
            window.globalBucketTabsState.BucketListDataModel.removeBucket(bucket);    
        }

        // View
        let bucketGroupEl = document.getElementById(bucketID.toString());
        
        if (bucketGroupEl) {
            bucketGroupEl.remove();
        }
        
    }

    private renderBuckets(){
        
    }

}
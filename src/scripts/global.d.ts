import { GlobalBucketTabsObject } from "./internal/global-object";

declare global {
    interface Window {
      // Declare the global functions and variables here
      globalBucketTabsObject: GlobalBucketTabsObject
    }
  }
import { GlobalBucketTabsState } from "./internal/global-state";

declare global {
    interface Window {
      // Declare the global functions and variables here
      globalBucketTabsState: GlobalBucketTabsState
    }
  }

  // declare module "daisyui";
/**
 * Tiny. Compiled code for signals results in 15 lines of JS, < 500 bytes of uncompressed code.
 * 
 * Usage:
 * 
 * const clickedSave = createSignal<Doc>();
 * 
 * clickedSave(doc => {
 *   // do something to save the doc, or when the doc is saved
 * })
 * 
 * clickedSave(doc);
 */
export interface SignalListener<T> {
    (event: T): void;
  }
  export interface SignalUnsubscriber {
    (): void;
  }
  export interface SignalSubscriber<T> {
    (listener: SignalListener<T>): SignalUnsubscriber;
  }
  export interface SignalDispatcher<T> {
    (event: T): void;
  }
  export type Signal<T> = SignalSubscriber<T> & SignalDispatcher<T>;
  export type SignalReturn = SignalUnsubscriber & void;
  
  
  export function createSignal<T = void>(): Signal<T> {
    const subscribers = new Set<SignalListener<T>>();
  
    return (eventOrListener: any): any => {
      if (typeof eventOrListener === 'function') {
        subscribers.add(eventOrListener);
        return () => { subscribers.delete(eventOrListener) };
      } else {
        subscribers.forEach(listener => listener(eventOrListener));
      }
    }
  }
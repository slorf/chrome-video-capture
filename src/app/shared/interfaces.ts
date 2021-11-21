// add captureStream to the HTMLVideoElement, thanks to typescript's interface merging capabilities
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
// could also augment the HTMLMediaElement instead, because that is being extended by the
// HTMLVideoElement and HTMLAudioElement
declare global {
  interface HTMLVideoElement {
    captureStream(framesPerSecond?: number): MediaStream;
  }
}

export interface MessageInterface {
  type: Actions;
  payload?: any;
}

export enum Actions {
  toggle = 'tg.videoCapture.toggleCapture',
  start = 'tg.videoCapture.startCapture',
  stop = 'tg.videoCapture.stopCapture',
  cancel = 'tg.videoCapture.cancelCapture',
  toggleContextMenu = 'tg.videoCapture.toggleContextMenu',
  togglePopup = 'tg.videoCapture.togglePopup',
}

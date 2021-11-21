import { VideoCapture } from './video-capture.class';
import { Actions, MessageInterface } from '../shared/interfaces';

const videoMap = new Map<string, HTMLVideoElement>(); // map of available video tags by src
const videoCaptures = new Map<string, VideoCapture>(); // list of running video captures
let $video: HTMLVideoElement = null; // reference to video element that was last clicked to open context menu
detectVideoElements();

// cache last clicked video element
document.addEventListener('contextmenu', showContextMenuHandler);
// listen for context menu events
chrome.runtime.onMessage.addListener(contextMenuEventHandler);

function showContextMenuHandler(event: MouseEvent & { target: HTMLVideoElement }) {
  const { target } = event;
  if (target && target.tagName === 'VIDEO') {
    // cache selected video element
    $video = target;

    // update contextmenu options
    const message: MessageInterface = {
      type: Actions.toggleContextMenu,
      payload: videoCaptures.has($video.src),
    };
    chrome.runtime.sendMessage(message);
  }
}

function contextMenuEventHandler(
  request: MessageInterface,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageInterface) => void
) {
  let { type: action, payload } = request;

  if (action === Actions.togglePopup) {
    const videos = detectVideoElements();
    return sendResponse({
      type: action,
      payload: videos,
    });
  }

  const src: string = action === Actions.toggle ? payload : $video?.src;
  if (!videoMap.has(src)) throw new Error("Can't find the video");
  const video = videoMap.get(src);

  if (action === Actions.toggle) {
    action = videoCaptures.has(src) ? Actions.stop : Actions.start;
  }

  switch (action) {
    case Actions.start: {
      if (!src) throw new Error("Can't read video source");
      if (videoCaptures.has(src)) throw new Error('This video is already being captured');

      const videoCapture = new VideoCapture(video);
      videoCapture.start();
      videoCaptures.set(src, videoCapture);
      break;
    }
    case Actions.stop:
    case Actions.cancel: {
      if (!src) throw new Error("Can't read video source");
      if (!videoCaptures.has(src)) throw new Error('This video is not being captured');

      const videoCapture = videoCaptures.get(src);
      videoCapture.stop(action === Actions.cancel);
      videoCaptures.delete(src);
      break;
    }
  }
}

function detectVideoElements(): { title: string; src: string; isCapturing: boolean }[] {
  const $videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');

  videoMap.clear();
  const videos = Array.from($videos)
    .filter((video) => video.src)
    .map((video) => {
      const { src } = video;
      videoMap.set(src, video);

      const title = VideoCapture.getTitle(video);
      const isCapturing = videoCaptures.has(src);
      return { title, src, isCapturing };
    });

  return videos;
}

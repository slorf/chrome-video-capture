import { Actions, MessageInterface } from '../shared/interfaces';

const detectBtn = document.getElementById('detectVideoElements');
const videoList = document.getElementById('videoList');

let activeTab: chrome.tabs.Tab;
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  activeTab = tab;
  updateVideoList();
});

detectBtn.addEventListener('click', updateVideoList);

videoList.addEventListener('click', setClickEventListener);

// request list of video tags from content script
function updateVideoList() {
  const message: MessageInterface = {
    type: Actions.togglePopup,
  };
  chrome.tabs.sendMessage(activeTab.id, message, (response: MessageInterface) => {
    const videos: { title: string; src: string; isCapturing: boolean }[] = response?.payload || [];

    if (videos.length === 0) {
      videoList.innerHTML = '<li>No video tags found.</li>';
    } else {
      videoList.innerHTML = videos
        .map(
          (video) =>
            `<li>${video.title} <button value='${video.src}'>${video.isCapturing ? 'x' : '&nbsp;'}</button></li>`
        )
        .join('');
    }
  });
}

function setClickEventListener(event: MouseEvent) {
  const target = event.target as HTMLButtonElement;
  if (target?.tagName !== 'BUTTON') return;

  toggleVideoCapture(target.value);
}

function toggleVideoCapture(src: string) {
  const message: MessageInterface = {
    type: Actions.toggle,
    payload: src,
  };
  chrome.tabs.sendMessage(activeTab.id, message);
}

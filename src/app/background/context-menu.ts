import { Actions } from '../shared/interfaces';

export function createContextMenus() {
  chrome.contextMenus.create({
    id: Actions.start,
    title: 'Start capture',
    contexts: ['video'],
  });

  chrome.contextMenus.create({
    id: Actions.stop,
    title: 'Stop capture and download',
    contexts: ['video'],
    visible: false,
  });

  chrome.contextMenus.create({
    id: Actions.cancel,
    title: 'Cancel capture',
    contexts: ['video'],
    visible: false,
  });
}

export function toggleContextMenu(isCapturing: boolean) {
  chrome.contextMenus.update(Actions.start, {
    visible: !isCapturing,
  });

  chrome.contextMenus.update(Actions.stop, {
    visible: isCapturing,
  });

  chrome.contextMenus.update(Actions.cancel, {
    visible: isCapturing,
  });
}

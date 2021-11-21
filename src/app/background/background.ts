import { createContextMenus, toggleContextMenu } from './context-menu';
import { Actions, MessageInterface } from '../shared/interfaces';

// init
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

//  messages from content or popup scripts
chrome.runtime.onMessage.addListener(messageHandler);

// click events from context menu
chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);

function messageHandler(
  request: { type: string; payload: any },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageInterface) => void
) {
  const { type, payload } = request;
  switch (type) {
    case Actions.toggleContextMenu:
      toggleContextMenu(payload);
      break;

    // case Actions.togglePopup:
    //   chrome.pageAction.show(sender.tab.id);
    //   chrome.pageAction.setTitle({ tabId: sender.tab.id, title: payload });
    //   break;
  }
}

function contextMenuClickHandler(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
  const action: Actions = info.menuItemId;
  switch (action) {
    case Actions.start:
    case Actions.stop:
    case Actions.cancel:
      return toggleCapture(action, tab);
  }
}

function toggleCapture(action: Actions, tab: chrome.tabs.Tab) {
  const message: MessageInterface = {
    type: action,
  };
  chrome.tabs.sendMessage(tab.id, message);
}

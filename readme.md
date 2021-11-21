# Video capture Chrome extension

This Chrome extension lets you capture streams from a html video tag (if it isn't DRM protected).

## Disclaimer

This is by no means perfect. I just wanted to dabble a bit into making a Chrome extension and play with the MediaRecorder lib.

## Possible upcoming features

- Event handlers and css pointer events on the video that prevent the context menu from showing when right clicking a video element: <sup>[6]</sup>
  - We could either remove all these settings from all video elements, but that may be a bit too intrusive and would probably disable some custom player interaction.
  - I added a popup window to the extension that reads all `video` tags and lists them up. Then we can start recording from the popup, instead of the video context menu.
- Enable/disable extension per page <sup>[7]?</sup>
- Use `import` (module support) to share the action names instead of duplicating it and keeping it in sync on both background and content scripts <sup>[10]?</sup>

[6]: https://developer.chrome.com/docs/extensions/mv3/options/
[7]: https://developer.chrome.com/docs/extensions/mv3/user_interface/
[10]: https://medium.com/front-end-weekly/es6-modules-in-chrome-extensions-an-introduction-313b3fce955b

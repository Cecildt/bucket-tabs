<img src="https://github.com/Cecildt/bucket-tabs/blob/main/public/assets/images/icon128.png?raw=true" align="right" width="128" height="128" title="bucket-tabs">

# Bucket Tabs

A browser extension with Astro to manage tabs and safe of memory usage.  

Currently still in development. The focus is to make it first feature complete for Chromium based browsers and then support other browsers.

## 🌟 Features

- 🚀 Manage browser tabs into buckets.
- 🚀 Save memory usage by unloading tabs.

## 🚧 Before starting

Make sure you have some understanding of extension development. Here are some resources:

- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

## 🛠️ Setup

This project uses the following repository as a template:
[catonaut-node](https://github.com/AminoffZ/catonaut-node)

Use the template or clone the project, navigate into the project folder and run:

```bash
npm install
```

### The manifest

The manifest is a JSON file that defines the extension's name, version, functionality, permissions, and other details. It is required for all browser extensions and must be carefully constructed to ensure the extension is secure and efficient (and works).

For additional information visit the [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/) documentation page. Please note that some browsers, like [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings), require specific information for extensions to work.

Example:

```json
{
  "manifest_version": 3,
  "name": "Your Extension Name",
  "version": "0.1.0",
  "web_accessible_resources": [
    {
      "matches": ["http://*/*"],
      "resources": ["assets/styles/content.css"]
    }
  ],
  "content_scripts": [
    {
      "matches": ["http://*/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "index.html"
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "yourcustom@token.io",
      "strict_min_version": "42.0"
    }
  },
  "icons": {
    "16": "assets/icon16.png",
    "32": "assets/icon32.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  }
}
```

## Modifying a page

### JavaScript

To add JavaScript to modify the page, edit the src/scripts/content.ts. It will be compiled to JavaScript when you build the extension. Look at **Build** for more information.

### What is a content.ts?

A content script is a JavaScript file that runs in the context of a web page and can modify its content and behavior. The content script can read and modify the HTML, CSS, and JavaScript of the web page, and can be used to add new functionality, modify existing functionality, or manipulate the content of the page in various ways.

The name "content.ts" is often used as a convention to indicate that the file contains the code for a content script. However, developers are free to use any filename they like for their content script.

For additional information visit the [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) documentation page.

### What is a background.ts?

Background scripts create service workers that live independent of any other window or tab. These allows extensions to observe and act in response to events. Commonly leveraging Chrome's Browser API they can be used to listen for events, such as the addition of a new tab or navigation to a new URL. They can also be used to keep state across multiple pages within the extension.

For example, a background script can listen for an event, such as the user clicking on the browser action icon, then dispatch an event to the content script in the active tab to take action.

For additional information visit the [background script](https://developer.chrome.com/docs/extensions/mv3/background_pages/) documentation page.

### CSS

To add CSS to the DOM, you need to create a CSS file in the public folder and reference it in the manifest.json. The above manifest example assumes there is a file called content.css in the public/assets/styles/ folder.

### HTML

For manipulating the DOM, HTML can be added or changed [programmatically](https://developer.mozilla.org/en-US/docs/Web/API/Document) using JavaScript. Your best friends for achieving this are most likely going to be [document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), [document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and [Node.insertBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore).

## The Popup

You can modify the popup just like you would modify an Astro app. You can start by modifying the src/pages/index.astro file. When starting, there is a Placeholder component inside the body that you can modify at src/components/Placeholder.astro or remove.

### Changing the icon

You can generate the icons from an image.

1. Replace the public/assets/images/example.png
2. Run the following command in the terminal:

```bash
npm run icons
```

This will create the icons referenced by default in the manifest of sizes 16, 32, 48 and 128.
Ensure you have the required imagemagick cli dependency installed on you machine. If not, run the following command for Ubuntu:

```bash
sudo apt install imagemagick
```

imagemagick website: [imagemagick](https://imagemagick.org/index.php)

### Testing the popup

You can test the popup by running the following command in the terminal:

```bash
npm run dev
```

This will start a development server and open the popup in your browser as if it were a website. You can then modify the popup and see the changes in real time.

## Testing your extension

Thankfully you don't have to get your extension published before being able to test it. Refer to [**Before starting**](https://github.com/AminoffZ/catonaut/tree/main#-before-starting) for information about testing an extension, also referred to as loading unpacked extensions. You do however need to build the extension to be able to test it.

## Build

To build the extension, run:

```bash
npm run build
```

## 🏗️ Project structure

<pre>
root
├── 📁 build-tools
├── 📁 dist
├── 📁 public
└── 📁 src
    ├── 📁 pages
    └── 📁 scripts
        └── 📁 internal
</pre>

### build-tools

Contains tools used for building the extension. You should not need to modify anything in this folder.

### dist

Contains the built extension. This folder can be loaded as an unpacked extension.

### public

Contains the public files. This folder is copied to the dist folder when building the extension. The files are not modified in any way.

### src

Contains the source files. This is where you will be doing most of your work.

### src/pages

Contains the index.astro. This is compiled to HTML when building the extension and functions as the popup. I find adding a folder src/components/ and importing them in the index.astro to be a good way to structure the popup.

### src/scripts

Contains the content.ts and background.ts. These are compiled to JavaScript when building the extension. The content.ts is injected into the DOM of the page.

### src/scripts/internal

Not necessary although I find that a useful way to structure the scripts is to add files in this folder and import their functionality in the content.ts and background.ts.

## Examples

[Example extension published to the Chrome Web Store](https://github.com/AminoffZ/github-repo-size). Note that there may be quite a few differences between the example and this repository.

## 💅 Formatting

I added a .prettierrc for contributing. If building for your own purposes, feel free to remove it.
To format with the provided configuration, run:

```bash
npm run format
```

## Inspect Chrome extension storage

Run the following command in DevTools console to inspect the extension storage:

```bash
chrome.storage.local.get(function(result) { console.log(result); });
```


## Links

 - [Icons from svgrepo](https://www.svgrepo.com/collection/twemoji-emojis/)


// workaround para trabalhar com ES Modules nas extensões
// https://github.com/gverni/ChromeExtensionsBoilerplates/blob/master/ES6-modules/content.js

// Content script is injecting a script with ES6 module support into the current page
const script = document.createElement('script')
script.setAttribute('type', 'module')
script.setAttribute('src', chrome.extension.getURL('main.js'))
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
head.insertBefore(script, head.lastChild)
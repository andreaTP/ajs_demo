/** @jsx h */
const akkajsFront = require('./akkajs_dom_front.js')
const domHandlers = require('../handlers/dom-handlers.js')

/*
const local = require('../local/local.js')

console.log("here port is %o", local.port)

console.log("first ")
local.port.postMessage()

local.port.postMessage = function(e) {console.log("assigned")}

console.log("then ")

local.port.postMessage()
*/

//new akkajsFront.UiManager(require('../local/local.js'), domHandlers)

//new akkajsFront.UiManager(new Worker('./js/local.out.js'), domHandlers)

//new akkajsFront.UiManager(new Worker('./js/local.out.js'), domHandlers)

//new akkajsFront.UiManager(new Worker('./js/local.out.js'), domHandlers)

new akkajsFront.UiManager(new SharedWorker('./js/local.out.js', 'one'), domHandlers)

new akkajsFront.UiManager(new SharedWorker('./js/local.out.js', 'two'), domHandlers)

new akkajsFront.UiManager(new SharedWorker('./js/local.out.js', 'three'), domHandlers)

//new akkajsFront.UiManager(new SharedWorker('./js/local.out.js'), domHandlers)

//new akkajsFront.UiManager(new Worker('./js/demo.out.js'), domHandlers)

//new akkajsFront.UiManager(new SharedWorker('./js/prime1.out.js'), domHandlers)

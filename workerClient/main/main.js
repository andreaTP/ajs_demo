/** @jsx h */
const h = require('virtual-dom/h')
const patch = require('virtual-dom/patch')
const createElement = require('virtual-dom/create-element')

const fromJson = require('vdom-as-json').fromJson
const applyPatch = require('vdom-serialized-patch/patch')

const worker = new Worker('./js/worker.out.js')

// let see how does this work
const domHandlers = require('../shared/dom-handlers.js')

const elems = new Map()

worker.onmessage = function(e) {
  if (e.data.create !== undefined) {
    // console.log("creating "+e.data.create)
    const elem = createElement(fromJson(e.data))
    if (elems.has(e.data.create)) {
      elems
        .get(e.data.create)
        .appendChild(elem)
    } else {
      document
        .getElementById(e.data.create)
        .appendChild(elem)
    }
    elems.set(e.data.id, elem)
  } else if (e.data.update !== undefined) {
    // console.log("updating")
    applyPatch(elems.get(e.data.id), e.data)
  } else if (e.data.remove !== undefined) {
    // console.log("removing")
    try {
      const node = elems.get(e.data.remove)
      node.parentNode.removeChild(node)
      node.remove()
    } catch (e) {
    } finally {
      elems.delete(e.data.remove)
    }
  } else if (e.data.register) {
    // console.log("registering function")
    const elem = elems.get(e.data.id)
    const funName = e.data.function

    elem.addEventListener(e.data.register, function(event) {
      const msg = {}
      msg.id = e.data.id
      msg.value = domHandlers[funName](event)

      worker.postMessage(msg)
    }, false)
  } else {
    console.log("unmatched message %o", e.data)
  }
}

/** @jsx h */
const h = require('virtual-dom/h')
const patch = require('virtual-dom/patch')
const createElement = require('virtual-dom/create-element')

const fromJson = require('vdom-as-json').fromJson
const applyPatch = require('vdom-serialized-patch/patch')

// let see how does this work
const domHandlers = require('../shared/dom-handlers.js')

const uiManagement = function(worker, orElse) {
  const elems = new Map()

  return function(e) {
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
      const node = elems.get(e.data.remove)

      try {
        node.parentNode.removeChild(node)
      } catch (e) {}
      try {
        node.remove()
      } catch (e) {}

      elems.delete(e.data.remove)
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
      orElse(e)
    }
  }
}

const worker1 = new Worker('./js/worker.out.js')

//make this an object
worker1.onmessage = uiManagement(worker1, function(e) {
  console.log("worker1 unmatched message %o", e.data)
})

const worker2 = new SharedWorker('./js/sharedw.out.js')

worker2.port.onmessage = uiManagement(worker2.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})

const worker3 = new SharedWorker('./js/sharedw2.out.js')

worker3.port.onmessage = uiManagement(worker3.port, function(e) {
  console.log("worker3 unmatched message %o", e.data)
})
/*
const worker4 = new SharedWorker('./js/sharedw3.out.js')

worker4.port.onmessage = uiManagement(worker4.port, function(e) {
  console.log("worker4 unmatched message %o", e.data)
})

const worker5 = new SharedWorker('./js/sharedw4.out.js')

worker5.port.onmessage = uiManagement(worker5.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})

const worker6 = new SharedWorker('./js/sharedw5.out.js')

worker6.port.onmessage = uiManagement(worker6.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})

const worker7 = new SharedWorker('./js/sharedw6.out.js')

worker7.port.onmessage = uiManagement(worker7.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})

const worker8 = new SharedWorker('./js/sharedw7.out.js')

worker8.port.onmessage = uiManagement(worker8.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})

const worker9 = new SharedWorker('./js/sharedw8.out.js')

worker9.port.onmessage = uiManagement(worker9.port, function(e) {
  console.log("worker2 unmatched message %o", e.data)
})
*/
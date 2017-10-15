/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('../akkajs-dom/akkajs-dom.js')

const dom_handlers = require('../handlers/dom-handlers.js')

const system = akkajs.ActorSystem.create()


class Example extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  postMount() {
    this.spawn(new Button())
  }
  render(value) {
    if (value === undefined) {
      return <h1>Hello</h1>
    } else {
      return <h1>{value}</h1>
    }
  }
  receive(msg) {
    this.update(msg)
  }
}

class Button extends akkajs_dom.DomActor {
  render() {
    return <button>Bho</button>
  }
  events() {
    return { "click": dom_handlers.click }
  }
  receive(msg) {
    example.tell("clicked")
  }
}

const example = system.spawn(new Example())

setTimeout(function() {
  example.tell("Hello world!")
}, 2000)

module.exports = {
  localPort: akkajs_dom.localPort
}

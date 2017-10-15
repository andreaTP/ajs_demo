/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('../akkajs-dom/akkajs-dom.js')

const dom_handlers = require('../handlers/dom-handlers.js')

const system = akkajs.ActorSystem.create()


class Example extends akkajs_dom.DomActor {
  constructor() {
    super("root")
    this.status = 0
  }
  postMount() {
    this.spawn(new Button())
  }
  render(value) {
    if (value === undefined) {
      return <h1>Hello</h1>
    } else {
      return <h1>{++this.status}</h1>
    }
  }
  receive(msg) {
    this.update(msg)
  }
}

class Button extends akkajs_dom.DomActor {
  render() {
    return <button>Click me</button>
  }
  events() {
    return { "click": dom_handlers.click }
  }
  receive(msg) {
    example.tell("click")
  }
}

const example = system.spawn(new Example())

module.exports = {
  localPort: akkajs_dom.localPort
}

/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('./akkajs-dom.js')

const dom_handlers = require('../shared/dom-handlers.js')

const system = akkajs.ActorSystem.create()

class Example extends akkajs_dom.DomActor {
  render() {
    return <h2>Hello Son</h2>
  }
}

class Counter extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  receive(msg) {
    console.log("RECEIVED %o", msg)
    if (msg.id) {
      console.log("YAY " + msg.id)
      return
    }

    if (this.status === undefined) {
      this.status = 0
    } else {
      this.status += 1
    }

    if (this.status == 1) {
      this.spawn(
        new Example()
      )
    }

    if (this.status == 3) {
      this.register("click", dom_handlers.clickActionHandler, system)
    }

    if (this.status > 10) {
      this.self().kill()
      clearInterval(interval)
    } else {
      this.update(this.status)
    }
  }
  render(value) {
    if (value === undefined) {
      return <h1>Initialize Me</h1>
    } else {
      return <h1>{value}</h1>
    }
  }
}

const example = system.spawn(new Counter())

const interval = setInterval(
  function() {
    example.tell("1")
  }, 1000
)

/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('akkajs-dom/work')

const dom_handlers = require('./dom-handlers.js')

const system = akkajs.ActorSystem.create()

class PingPong extends akkajs_dom.DomActor {
  constructor() {
    super("root")
    this.status = 0
    this.name = "ping"
  }
  render(value) {
    return <div className="box">{[
      <h1>PingPong</h1>,
      <p>{"received " + value + " pings"}</p>
    ]}</div>
  }
  postMount() {
    this.spawn(new Button())
    this.update(this.status)
  }
  receive(msg) {
    this.update(++this.status)
  }
}

class Button extends akkajs_dom.DomActor {
  render() {
    return <button>Send Ping</button>
  }
  events() {
    return { "click": dom_handlers.click }
  }
  receive(msg) {
    akkajs_dom.sharedWorkerPort.tellTo(
      "akka://default/user/ping",
      "ping"
    )
  }
}

const pingpong = system.spawn(new PingPong())

module.exports = {
  localPort: akkajs_dom.localPort
}

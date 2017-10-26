/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem } = require("akkajs")
const { DomActor, sharedWorkerPort, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")

const system = ActorSystem.create()

class PingPong extends DomActor {
  constructor () {
    super("root")
    this.status = 0
    this.name = "ping"
  }
  render (value) {
    return <div className='box'>{[
      <h1>PingPong</h1>,
      <p>{"received " + value + " pings"}</p>
    ]}</div>
  }
  postMount () {
    this.spawn(new Button())
    this.update(this.status)
  }
  receive () {
    this.update(++this.status)
  }
}

class Button extends DomActor {
  render () {
    return <button>Send Ping</button>
  }
  events () {
    return { "click": domHandlers.click }
  }
  receive () {
    sharedWorkerPort.tellTo(
      "akka://default/user/ping",
      "ping"
    )
  }
}

system.spawn(new PingPong())

module.exports = {
  localPort
}

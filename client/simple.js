/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem } = require("akkajs")
const { DomActor, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")

const system = ActorSystem.create()

class Example extends DomActor {
  constructor () {
    super("root")
    this.status = 0
  }
  postMount () {
    this.spawn(new Button())
  }
  render (value) {
    if (value === undefined) {
      return <div className='box'>
        <h1>Hello</h1>
      </div>
    } else {
      return <div className='box'>
        <h1>{++this.status}</h1>
      </div>
    }
  }
  receive (msg) {
    this.update(msg)
  }
}

class Button extends DomActor {
  render () {
    return <button>Click me</button>
  }
  events () {
    return { "click": domHandlers.click }
  }
  receive () {
    this.parent().tell("click")
  }
}

system.spawn(new Example())

module.exports = {
  localPort
}

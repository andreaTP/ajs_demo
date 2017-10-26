/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem } = require("akkajs")
const { DomActor, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")
const { uuid } = require("./utils.js")

const system = ActorSystem.create()

class ToDoList extends DomActor {
  constructor () {
    super("root")
    this.id = uuid()
  }
  render () {
    return <div className='box'>{[
      <input id={"elem" + this.id} />,
      <div id={"button" + this.id} />,
      <ul id={"list" + this.id} />
    ]}</div>
  }
  postMount () {
    this.spawn(new Button(this.id))
  }
  receive (msg) {
    this.spawn(new ListElement(this.id, msg))
  }
}

class Button extends DomActor {
  constructor (id) {
    super("button" + id)
  }
  render () {
    return <button>Add</button>
  }
  events () {
    return { "click": domHandlers.getInputValue }
  }
  receive (msg) {
    this.parent().tell(msg)
  }
}

class ListElement extends DomActor {
  constructor (id, value) {
    super("list" + id)
    this.value = value
  }
  render () {
    return <li>{this.value}</li>
  }
  postMount () {
    this.spawn(new KillButton())
  }
}

class KillButton extends DomActor {
  render () {
    return <button>X</button>
  }
  events () {
    return { "click": domHandlers.killMe }
  }
  receive (msg) {
    if (msg.killMe) {
      this.parent().kill()
    }
  }
}

system.spawn(new ToDoList())

module.exports = {
  localPort
}

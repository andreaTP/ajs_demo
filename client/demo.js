/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('akkajs-dom/work')

const dom_handlers = require('./dom-handlers.js')

const system = akkajs.ActorSystem.create()

const uuid = function() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

class ToDoList extends akkajs_dom.DomActor {
  constructor() {
    super("root")
    this.id = uuid()
  }
  render(value) {
    return <div>{[
      <input id={"elem" + this.id}></input>,
      <div id={"button" + this.id}/>,
      <ul id={"list" + this.id}></ul>
    ]}</div>
  }
  postMount() {
    this.spawn(new Button(this.id))
  }
  receive(msg) {
    this.spawn(new ListElement(this.id, msg))
  }
}

class Button extends akkajs_dom.DomActor {
  constructor(id) {
    super("button" + id)
  }
  render() {
    return <button>Add</button>
  }
  events() {
    return { "click": dom_handlers.getInputValue }
  }
  receive(msg) {
    this.parent().tell(msg)
  }
}

class ListElement extends akkajs_dom.DomActor {
  constructor(id, value) {
    super("list" + id)
    this.value = value
  }
  render() {
    return <li>{this.value}</li>
  }
  postMount() {
    this.spawn(new KillButton())
  }
}

class KillButton extends akkajs_dom.DomActor {
  render() {
    return <button>X</button>
  }
  events() {
    return { "click": dom_handlers.killMe }
  }
  receive(msg) {
    if (msg.killMe) {
      this.parent().kill()
    }
  }
}

const todoList = system.spawn(new ToDoList())

class Validator extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  render(value) {
    return <div>
        <h4>Validator type everything but "a"</h4>
    </div>
  }
  postMount() {
    this.spawn(new EchoedInput())
  }
}

class EchoedInput extends akkajs_dom.DomActor {
  render() {
    return <div><input></input></div>
  }
  events() {
    return { "keyup": dom_handlers.getKeyUp }
  }
  postMount() {
    this.echo = this.spawn(new EchoOut())
  }
  receive(msg) {
    if (msg instanceof ResetInput) {
      this.update()
    } else {
      this.echo.tell(msg)
    }
  }
}

class ResetInput{}
const reset = new ResetInput()

class EchoOut extends akkajs_dom.DomActor {
  render(value) {
    return <p>{value}</p>
  }
  postMount() {
    this.parent().tell(reset)
    this.status = ""
    this.update("type above")
  }
  receive(msg) {
    if (msg == 'a') {
      throw 42
    } else {
      this.status += msg
      this.update(this.status)
    }
  }
}

const example = system.spawn(new Validator())

module.exports = {
  localPort: akkajs_dom.localPort
}

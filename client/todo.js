/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('akkajs-dom/work')

const dom_handlers = require('./dom-handlers.js')
const utils = require('./utils.js')

const system = akkajs.ActorSystem.create()

class ToDoList extends akkajs_dom.DomActor {
  constructor() {
    super("root")
    this.id = utils.uuid()
  }
  render(value) {
    return <div className="box">{[
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

module.exports = {
  localPort: akkajs_dom.localPort
}

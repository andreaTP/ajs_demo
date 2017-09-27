/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('./akkajs-dom.js')

const dom_handlers = require('../shared/dom-handlers.js')

const system = akkajs.ActorSystem.create()


class ToDoList extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  postMount() {
    this.spawn(new Button())
  }
  render(value) {
    return <div>{[
      <input id="elem"></input>,
      <div id="button"/>,
      <ul id="list"></ul>
    ]}</div>
  }
  receive(msg) {
    this.spawn(new ListElement(msg))
  }
}

class Button extends akkajs_dom.DomActor {
  constructor() {
    super("button")
  }
  postMount() {
    this.register("click", dom_handlers.getInputValue)
  }
  render() {
    return <button>Add</button>
  }
  receive(msg) {
    this.parent().tell(msg)
  }
}

class ListElement extends akkajs_dom.DomActor {
  constructor(value) {
    super("list")
    this.value = value
  }
  postMount() {
    this.spawn(new KillButton())
  }
  render() {
    return <li>{this.value}</li>
  }
}

class KillButton extends akkajs_dom.DomActor {
  postMount() {
    this.register("click", dom_handlers.killMe)
  }
  render() {
    return <button>X</button>
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
  postMount() {
    this.spawn(new EchoedInput())
  }
  render(value) {
    return <div>
        <h4>Validator type everything but "a"</h4>
    </div>
  }
}

class EchoedInput extends akkajs_dom.DomActor {
  postMount() {
    this.register("keyup", dom_handlers.getKeyUp)
    this.echo = this.spawn(new EchoOut())
  }
  render() {
    return <div><input></input></div>
  }
  receive(msg) {
    this.echo.tell(msg)
  }
}

class EchoOut extends akkajs_dom.DomActor {
  postMount() {
    this.status = ""
    this.update("type above")
  }
  render(value) {
    return <p>{value}</p>
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

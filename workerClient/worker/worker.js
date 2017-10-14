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
  render(value) {
    return <div>{[
      <input id="elem"></input>,
      <div id="button"/>,
      <ul id="list"></ul>
    ]}</div>
  }
  postMount() {
    this.spawn(new Button())
  }
  receive(msg) {
    this.spawn(new ListElement(msg))
  }
}

class Button extends akkajs_dom.DomActor {
  constructor() {
    super("button")
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
  constructor(value) {
    super("list")
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

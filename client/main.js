/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('./akkajs-dom.js')

var system = akkajs.ActorSystem.create()

class ToDoList extends akkajs_dom.DomActor {
  constructor() {
    super(document.body)
  }
  render(value) {
    return <div>{[
      <input id="elem"></input>,
      <button onclick=
        {ev => { this.self().tell(document.getElementById("elem").value) }}
      >Add</button>,
      <ul id="list"></ul>
    ]}</div>
  }
  operative(msg) {
    this.spawn(new ListElement(msg))
  }
}

class ListElement extends akkajs_dom.DomActor {
  constructor(value) {
    super(document.getElementById("list"))
    this.value = value
  }
  render() {
    return <li>{[
        this.value,
        <button onclick={ev => { this.self().kill()} }>X</button>
    ]}</li>
  }
}

let todoList = system.spawn(new ToDoList())

class Validator extends akkajs_dom.DomActor {
  constructor() {
    super(document.body)
  }
  preMount() {
    this.status = ""
    this.update(this.status)
  }
  operative(msg) {
    if (msg == "a") {
      throw "Illegal key pressed"
    } else {
      this.status += msg
      this.update(this.status)
    }
  }
  render(value) {
    return <div>{[
        <h4>Validator type everything but "a"</h4>,
        <input onkeyup={ev => {this.self().tell(ev.key)}} value={value}></input>,
        <p>{value}</p>
    ]}</div>
  }
}

let example = system.spawn(new Validator())

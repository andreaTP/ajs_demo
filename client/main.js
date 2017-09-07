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
    let son = this.spawn(new akkajs_dom.DomActorFromTemplate(
      <li>{[
          msg,
          <button onclick={ev => { son.kill()} }>X</button>
      ]}</li>,
      document.getElementById("list")
    ))
  }
}

let todoList1 = system.spawn(new ToDoList())

let todoList2 =
  system.spawn(new akkajs_dom.DomActorFromRender(function(value) {
      if (value !== undefined) {
        let son = this.spawn(new akkajs_dom.DomActorFromTemplate(
          <li>{[
              value,
              <button onclick={ev => { son.kill()} }>X</button>
          ]}</li>,
          document.getElementById("list2")
        ))
      }


      return <div>{[
        <input id="elem2"></input>,
        <button onclick={ev => { this.self().tell(
          new akkajs_dom.Update(document.getElementById("elem2").value)
        ) } }>Add</button>,
        <ul id="list2"></ul>
      ]}</div>
    },
    document.body
  ))

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
        this.self().tell(new akkajs_dom.Update(this.status))
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


  class SupervisorExample extends akkajs.Actor {
    preStart() {
      this.spawn(new Validator())
    }
  }

  let example = system.spawn(new SupervisorExample())

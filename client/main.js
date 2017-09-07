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
    if (value !== undefined) {
      let son = this.spawn(new akkajs_dom.DomActorFromTemplate(
        <li>{[
            value,
            <button onclick={ev => { son.kill()} }>X</button>
        ]}</li>,
        document.getElementById("list")
      ))
    }

    return <div>{[
      <input id="elem"></input>,
      <button onclick={ev => { this.self().tell(
        new akkajs_dom.Update(document.getElementById("elem").value)
      ) } }>Add</button>,
      <ul id="list"></ul>
    ]}</div>
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

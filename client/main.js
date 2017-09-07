/** @jsx h */

var h = require('virtual-dom/h');

var profile = <div>
  <h3>CIAO</h3>
</div>

console.log("profile is %o", profile)

const akkajs = require('akkajs')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const createElement = require('virtual-dom/create-element')

class Update { constructor(value) { this.value = value } }
class GetParentNode { constructor() {} }
class ParentNode { constructor(node) { this.node = node } }

class DomActor extends akkajs.Actor {
  constructor(parentNode) {
    super()
    this.parentNode = parentNode

    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.receive = this.receive.bind(this)
    this.preStart = this.preStart.bind(this)
    this.postStop = this.postStop.bind(this)

    this.tree = this.render()
    this.node = createElement(this.tree)
  }
  update(newValue) {
    let newTree = this.render(newValue)
    let patches = diff(this.tree, newTree)
    this.node = patch(this.node, patches)
    this.tree = newTree
  }
  preStart() {
    if (this.parentNode !== undefined) {
      this.parentNode.appendChild(this.node)
    } else {
      this.parent().tell(new GetParentNode())
    }
  }
  receive(msg) {
    if (msg instanceof Update) {
      this.update(msg.value)
    } else if (msg instanceof GetParentNode) {
      this.sender().tell(new ParentNode(this.node))
    } else if (msg instanceof ParentNode) {
      this.parentNode = msg.node
      this.parentNode.appendChild(this.node)
    } else {
      this.operative(msg)
    }
  }
  postStop() {
    console.log(`${this.self().path()} is going to stop`)
    try {
      this.parentNode.removeChild(this.node)
      this.node.remove()
    } catch (e) {}
  }
}

class DomActorFromTemplate extends DomActor {
  constructor(template, parentNode) {
    super()
    this.template = template
    this.parentNode = parentNode

    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.receive = this.receive.bind(this)
    this.preStart = this.preStart.bind(this)
    this.postStop = this.postStop.bind(this)

    this.tree = this.render()
    this.node = createElement(this.tree)
  }
  render(value) {
   return this.template
  }
}


var system = akkajs.ActorSystem.create()

class HelloDom extends DomActor {
  constructor() {
    super(document.body)
  }
  render(value) {
    if (value === undefined) {
      return <h1>Hello World</h1>
    } else {
      return <h1>{"Hello " + value}</h1>
    }
  }
  operative(msg) {
    if (msg === "example") {
      //this.spawn(new Example())
      // onclick={ev => { this.self().kill()} }

      let son = this.spawn(
        new DomActorFromTemplate(<div>{[
          <h3>Ciao</h3>,
          <button onclick={ev => { son.kill()} }>X</button>
        ]}</div>)
      )
      //this.spawn(newDomActorFromTemplate()
    }
  }
}

class ToDoList extends DomActor {
  constructor() {
    super(document.body)
  }
  render(value) {
    if (value !== undefined) {
      let son = this.spawn(new DomActorFromTemplate(
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
        new Update(document.getElementById("elem").value)
      ) } }>Add</button>,
      <ul id="list"></ul>
    ]}</div>
  }
}


let todoList = system.spawn(new ToDoList())


//let helloDom = system.spawn(new HelloDom())
/*
setTimeout(() => {
  console.log("ciao")
  helloDom.tell(new Update("Andrea"))
}, 1000)
*/
/*
setTimeout(() => {
  helloDom.tell("example")
}, 300)
*/

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

    this.init = this.init.bind(this)

    this.init()
  }
  init() {
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
    try {
      this.parentNode.removeChild(this.node)
      this.node.remove()
    } catch (e) {}
  }
}

class DomActorFromTemplate extends DomActor {
  constructor(template, parentNode) {
    super(parentNode)
    this.template = template
    //this.parentNode = parentNode

    this.init()
  }
  render(value) {
   return this.template
  }
}

class DomActorFromRender extends DomActor {
  constructor(render, parentNode) {
    super(parentNode)
    this.parentNode = parentNode

    this.dyn_render = render.bind(this)

    this.init()
  }
  render(value) {
    if (this.dyn_render !== undefined)
      return this.dyn_render(value)
  }
}

module.exports = {
  Update: Update,
  DomActor: DomActor,
  DomActorFromTemplate: DomActorFromTemplate,
  DomActorFromRender: DomActorFromRender
}

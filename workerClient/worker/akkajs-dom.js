const akkajs = require('akkajs')
const diff = require('virtual-dom/diff')
const createElement = require('virtual-dom/create-element')

const toJson = require('vdom-as-json').toJson
const serializePatch = require('vdom-serialized-patch/serialize')

class Update { constructor(value) { this.value = value } }

class DomActor extends akkajs.Actor {
  constructor(parentNode, comm) {
    super()
    this.parentNode = parentNode
    this.comm = comm

    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.receive = this.receive.bind(this)
    this.preStart = this.preStart.bind(this)
    this.postStop = this.postStop.bind(this)
  }
  update(newValue) {
    let newNode = this.render(newValue)
    let serializedPatch =
      serializePatch(diff(this.node, newNode))
    serializedPatch.update = this.path()
    serializedPatch.id = this.path()
    comm.tell(serializedPatch)
    this.node = newNode
  }
  mount() {
    if (this.node === undefined) {
      this.node = this.render()
    }

    let node = toJson(this.node)
    node.create = this.parentNode
    node.id = this.path()
    comm.tell(node)
  }
  preStart() {
    if (this.parentNode === undefined) {
      let lio = this.path().lastIndexOf("/")
      this.parentNode = this.path().substring(0, lio)
    }
    console.log("parent is "+this.parentNode)

    this.mount()
  }
  postStop() {
    console.log("has to remove")
    comm.tell({"remove": this.path()})
  }
}


module.exports = {
  Update: Update,
  DomActor: DomActor
}

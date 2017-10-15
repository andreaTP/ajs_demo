const akkajs = require('akkajs')
const diff = require('virtual-dom/diff')
const createElement = require('virtual-dom/create-element')

const toJson = require('vdom-as-json').toJson
const serializePatch = require('vdom-serialized-patch/serialize')

const systems = new Map()

class Port {
  constructor() {
    this.postMessage = this.postMessage.bind(this)
    this.onmessage = this.onmessage.bind(this)
  }
  onmessage(msg) { console.log("NOT ASSIGNED YET") }
  postMessage(e) {
    const sys = systems.get(getSystemPath(e.id))
    sys.select(e.id).tell(e.value)
  }
}

const port = new Port()

const localPostMessage = function(e) {port.onmessage({"data": e})}

const getSystemPath = function(actorPath) {
  const splitted = actorPath.split('/')
  return (splitted[0] + "//" + splitted[2] + "/" + splitted[3])
}

class DomActor extends akkajs.Actor {
  constructor(parentNode) {
    super()
    // internal usage
    this.parentNode = parentNode

    // filled by user
    this.render = this.render.bind(this)

    // called by user
    this.update = this.update.bind(this)
    this.register = this.register.bind(this)
    this.events = this.events.bind(this)

    // internal usage
    this.mount = this.mount.bind(this)

    //filled by user
    this.receive = this.receive.bind(this)
    this.preStart = this.preStart.bind(this)
    this.postStop = this.postStop.bind(this)

    this.postMount = this.postMount.bind(this)
  }
  update(newValue) {
    const newNode = this.render(newValue)
    const serializedPatch =
      serializePatch(diff(this.node, newNode))
    serializedPatch.update = this.path()
    serializedPatch.id = this.path()
    localPostMessage(serializedPatch)
    this.node = newNode
  }
  mount() {
    if (this.node === undefined) {
      this.node = this.render()
    }

    const node = toJson(this.node)
    node.create = this.parentNode
    node.id = this.path()
    localPostMessage(node)

    const events = this.events()
    for (const k in events) {
      this.register(k, events[k])
    }

    this.postMount()
  }
  events() { }
  register(eventName, eventFunction) {
    const reg = {}
    reg.register = eventName
    reg.function = eventFunction.name
    reg.id = this.path()

    systems.set(getSystemPath(this.path()), this.system())
    localPostMessage(reg)
  }
  preStart() {
    if (this.parentNode === undefined) {
      const lio = this.path().lastIndexOf("/")
      this.parentNode = this.path().substring(0, lio)
    }

    this.mount()
  }
  postStop() {
    localPostMessage({"remove": this.path()})
  }
  postMount() { }
}

module.exports = {
  DomActor,
  port
}

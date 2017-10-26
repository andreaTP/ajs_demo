/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem, Actor } = require("akkajs")
const { DomActor, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")
const { uuid } = require("./utils.js")

const system = ActorSystem.create()

class Track {
  constructor (topic) {
    this.topic = topic
  }
}
class Tweet {
  constructor (from, text) {
    this.from = from
    this.text = text
  }
}

class WSActor extends Actor {
  constructor (address) {
    super()

    this.address = address
    this.operative = this.operative.bind(this)
  }
  preStart () {
    this.ws = new WebSocket(this.address)

    this.ws.onopen = () => {
      this.become(this.operative)
    }
    this.ws.onmessage = (event) => {
      this.self().tell(event.data)
    }
  }
  receive () {
    console.log("not ready...")
  }
  operative (msg) {
    if (msg instanceof Track) { this.ws.send(msg.topic) } else {
      const json = JSON.parse(msg)
      this.parent().tell(new Tweet(json.user.name, json.text))
    }
  }
}

class TwitterUiActor extends DomActor {
  constructor (address) {
    super("root")
    this.id = uuid()
    this.address = address
  }
  render (value) {
    let from = "finger crossed"
    let msg = "not yet arrived"
    if (value !== undefined && value instanceof Tweet) {
      from = value.from
      msg = value.text
    }

    return <div className='box'>{[
      <input id={"elem" + this.id} />,
      <div id={"button" + this.id} />,
      <h3 id={("from" + this.id).toUpperCase()}>{from}</h3>,
      <p id={"msg" + this.id}>{msg}</p>
    ]}</div>
  }
  postMount () {
    this.wsActor = this.spawn(new WSActor(this.address))
    this.spawn(new TrackButton(this.id, this.wsActor))
  }
  receive (msg) {
    this.update(msg)
  }
}

class TrackButton extends DomActor {
  constructor (id, wsActor) {
    super("button" + id)
    this.wsActor = wsActor
  }
  render () {
    return <button>Track</button>
  }
  events () {
    return { "click": domHandlers.getInputValue }
  }
  receive (msg) {
    this.wsActor.tell(new Track(msg))
  }
}

system.spawn(
  new TwitterUiActor("ws://localhost:9002")
)

module.exports = {
  localPort
}
/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem, Actor } = require("akkajs")
const { DomActor, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")

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

class TrackInput extends DomActor {
  constructor (wsActor) {
    super()
    this.wsActor = wsActor
  }
  render () {
    return <input placeholder={"track"} />
  }
  events () {
    return { "keyup": domHandlers.getTrackValue }
  }
  receive (msg) {
    if (msg !== undefined) {
      this.wsActor.tell(new Track(msg))
    }
  }
}

class TwitterUiActor extends DomActor {
  constructor (address) {
    super("root")
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
      <h3 id={"from"}>{from}</h3>,
      <p id={"msg"}>{msg}</p>
    ]}</div>
  }
  postMount () {
    this.wsActor = this.spawn(new WSActor(this.address))
    this.spawn(new TrackInput(this.wsActor))
  }
  receive (msg) {
    this.update(msg)
  }
}

system.spawn(
  new TwitterUiActor("ws://localhost:9002")
)

module.exports = {
  localPort
}

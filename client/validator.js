/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('akkajs-dom/work')

const dom_handlers = require('./dom-handlers.js')
const utils = require('./utils.js')

const system = akkajs.ActorSystem.create()

class Validator extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  render(value) {
    return <div className="box">
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

module.exports = {
  localPort: akkajs_dom.localPort
}

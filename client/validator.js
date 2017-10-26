/** @jsx h */
const h = require("virtual-dom/h")
const { ActorSystem } = require("akkajs")
const { DomActor, localPort } = require("akkajs-dom/work")

const domHandlers = require("./dom-handlers.js")

const system = ActorSystem.create()

class Validator extends DomActor {
  constructor () {
    super("root")
  }
  render () {
    return <div className='box'>
      <h4>Validator type everything but "a"</h4>
    </div>
  }
  postMount () {
    this.spawn(new EchoedInput())
  }
}

class EchoedInput extends DomActor {
  render () {
    return <div><input /></div>
  }
  events () {
    return { "keyup": domHandlers.getKeyUp }
  }
  postMount () {
    this.echo = this.spawn(new EchoOut())
  }
  receive (msg) {
    if (msg instanceof ResetInput) {
      this.update()
    } else {
      this.echo.tell(msg)
    }
  }
}

class ResetInput {}
const reset = new ResetInput()

class EchoOut extends DomActor {
  render (value) {
    return <p>{value}</p>
  }
  postMount () {
    this.parent().tell(reset)
    this.status = ""
    this.update("type above")
  }
  receive (msg) {
    if (msg === "a") {
      throw 42
    } else {
      this.status += msg
      this.update(this.status)
    }
  }
}

system.spawn(new Validator())

module.exports = {
  localPort
}

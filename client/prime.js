/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('./akkajs-dom/akkajs-dom.js')

const dom_handlers = require('./dom-handlers.js')

const system = akkajs.ActorSystem.create()


class PrimeUI extends akkajs_dom.DomActor {
  constructor() {
    super("root")
  }
  render(value) {
    return <div>{[
      <h1>{value}</h1>
    ]}</div>
  }
  postMount() {
    this.spawn(new StartButton())
  }
  receive(msg) {
    this.update(msg)
  }
}

class StartButton extends akkajs_dom.DomActor {
  render() {
    if (this.status === undefined || this.status == false) {
      return <button>Get primes</button>
    } else {
      return <div></div>
    }
  }
  events() {
    return { "click": dom_handlers.click }
  }
  receive(msg) {
    if (this.status === undefined || this.status == false) {
      this.status = true
      system.spawn(new PrimeFinder(this.parent())).tell(0)
    }

    this.update()
  }
}

const nextPrime = function(last) {
  let num = last + 1
  while (true) {
    let check = num - 1
    while (
      check > 1 &&
      num % check != 0
      ) {
      check -= 1
    }
    if (check <= 1) {
      break
    } else {
      num += 1
    }
  }
  return num
}

const primeUI = system.spawn(new PrimeUI())

class PrimeFinder extends akkajs.Actor {
  receive(last) {
    let next = nextPrime(last)
    primeUI.tell(next)
    // if we wanna stop it .. because messages are scheduled on setImmediate
    // setTimeout(() => {this.self().tell(next)}, 0)
    this.self().tell(next)
  }
}

module.exports = {
  localPort: akkajs_dom.localPort
}

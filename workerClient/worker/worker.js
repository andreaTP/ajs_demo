/** @jsx h */
const h = require('virtual-dom/h')
const akkajs = require('akkajs')
const akkajs_dom = require('./akkajs-dom.js')

const system = akkajs.ActorSystem.create()

class Comm extends akkajs.Actor {
  constructor() {
    super()
    this.name = "pinger"
    this.receive = this.receive.bind(this)
  }
  receive(msg) {
    if (this.sender() === undefined)
      console.log("RECEIVED MESSAGE FROM UI %o", msg)
    else {
      console.log("sending msg to UI")
      postMessage(msg)
    }
  }
}

comm = system.spawn(new Comm())

onmessage = function(e) {
  console.log('Message received from main script')
  comm.tell(e , undefined)
}

// setTimeout(
//   () => {
//     comm.tell("ciao", comm)
//   }, 5000
// )

class Example extends akkajs_dom.DomActor {
  //contructor to be fixed
  constructor() {
    super(undefined, comm)
  }
  render() {
    return <h2>Hello Son</h2>
  }
}

class Counter extends akkajs_dom.DomActor {
  constructor() {
    super("root", comm)
  }
  receive(msg) {
    if (this.status === undefined) {
      this.status = 0
    } else {
      this.status += 1
    }

    if (this.status == 1) {
      this.spawn(
        new Example()
      )
    }

    if (this.status > 10) {
      this.self().kill()
      clearInterval(interval)
    } else {
      this.update(this.status)
    }
  }
  render(value) {
    if (value === undefined) {
      return <h1>Initialize Me</h1>
    } else {
      return <h1>{value}</h1>
    }
  }
}

const example = system.spawn(new Counter())

const interval = setInterval(
  function() {
    example.tell("1")
  }, 2000
)

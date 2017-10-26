const { Actor, ActorSystem } = require("akkajs")
const fs = require("fs")
const TwitterModule = require("node-tweet-stream")

const credentials =
  JSON.parse(fs.readFileSync(".credentials", "utf8"))

class TwitterActor extends Actor {
  preStart () {
    this.twitter = new TwitterModule(credentials)

    this.twitter.on("tweet", (tweet) => {
      this.parent().tell(JSON.stringify(tweet))
    })
  }
  postStop () {
    this.twitter.untrackAll()
    this.twitter.abort()
  }
  receive (msg) {
    console.log("going to track " + msg)
    this.twitter.track(msg)
  }
}

class WSChannel extends Actor {
  constructor (connection) {
    super()
    this.connection = connection
  }
  preStart () {
    this.twitterActor = this.spawn(new TwitterActor())

    this.connection.on("message", (msg) => {
      this.twitterActor.tell(msg.utf8Data)
    })
    this.connection.on("close", () => {
      this.self().kill()
    })
  }
  receive (msg) {
    this.connection.send(msg)
  }
}

class WSServerActor extends Actor {
  constructor (port) {
    super()
    this.port = port
  }
  preStart () {
    const WebSocketServer = require("websocket").server
    const http = require("http")

    this.server = http.createServer((request, response) => {
      response.writeHead(404)
      response.end("not available")
    })

    this.wsServer = new WebSocketServer({
      httpServer: this.server,
      keepaliveInterval: 1000,
      keepaliveGracePeriod: 3000,
      autoAcceptConnections: false
    })

    this.server.listen(this.port, () => {
      console.log("Server is listening on port " + this.port)
    })

    this.wsServer.on("request", (req) => {
      this.spawn(new WSChannel(req.accept(false, req.origin)))
    })
  }
  receive () {}
}

const system = ActorSystem.create("TwitterStremingServer")

system.spawn(new WSServerActor(9002))

// minimal example for twitter integration
/*
class DemoTwitterListener extends Actor {
  preStart () {
    this.spawn(new TwitterActor()).tell("Pizza")
  }
  receive (msg) {
    console.log("DEMO RECEIVED: " + msg)
  }
}

setTimeout(() => {
  console.log("starting demo listener")
  system.spawn(new DemoTwitterListener())
}, 2000)
*/

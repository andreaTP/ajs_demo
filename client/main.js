/** @jsx h */
const { UiManager } = require("akkajs-dom/page")
const domHandlers = require("./dom-handlers.js")

/*
new UiManager(
  // require("./simple.js"),
  new Worker("./js/simple.out.js"),
  domHandlers
)
*/
/*
new UiManager(
  new Worker("./js/simple.out.js"),
  domHandlers
)

new UiManager(
  new SharedWorker("./js/simple.out.js", "one"),
  domHandlers
)

new UiManager(
  new SharedWorker("./js/simple.out.js", "two"),
  domHandlers
)
*/
/*
new UiManager(
  // require("./todo.js"),
  new Worker("./js/todo.out.js"),
  domHandlers
)

new UiManager(
  new Worker("./js/validator.out.js"),
  domHandlers
)
*/
/*
new UiManager(
  new SharedWorker("./js/todo.out.js"),
  domHandlers
)

new UiManager(
  new SharedWorker("./js/validator.out.js"),
  domHandlers
)
*/
/*
new UiManager(
  // require("./prime.js"),
  new Worker("./js/prime.out.js"),
  domHandlers
)
*/

/*
const ping = new SharedWorker("./js/pingpong.out.js", "ping")
const pong = new SharedWorker("./js/pingpong.out.js", "pong")

new UiManager(
  ping,
  domHandlers,
  function (e) {
    pong.port.postMessage(e.data)
  }
)

new UiManager(
  pong,
  domHandlers,
  function (e) {
    ping.port.postMessage(e.data)
  }
)
*/

new UiManager(
  // require("./twitter.js"),
  new Worker("./js/twitter.out.js"),
  // new SharedWorker("./js/twitter.out.js"),
  domHandlers
)

new UiManager(
  new Worker("./js/twitter.out.js"),
  domHandlers
)

/*
const primesN = 10
for (let i = 0; i < primesN; i++) {
  const name = "shared" + i
  new UiManager(
    new SharedWorker("./js/prime.out.js", name),
    domHandlers
  )
}

new UiManager(
  require("./prime.js"),
  // require("./simple.js"),
  domHandlers
)
*/

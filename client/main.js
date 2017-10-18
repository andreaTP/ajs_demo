/** @jsx h */
const akkajs_dom_page = require("akkajs-dom/page")
const domHandlers = require("./dom-handlers.js")

new akkajs_dom_page.UiManager(
  // require("./simple.js"),
  new Worker("./js/simple.out.js"),
  domHandlers
)
/*
new akkajs_dom_page.UiManager(
  new Worker("./js/simple.out.js"),
  domHandlers
)

new akkajs_dom_page.UiManager(
  new SharedWorker("./js/simple.out.js", "one"),
  domHandlers
)

new akkajs_dom_page.UiManager(
  new SharedWorker("./js/simple.out.js", "two"),
  domHandlers
)
*/
new akkajs_dom_page.UiManager(
  // require("./todo.js"),
  new Worker("./js/todo.out.js"),
  domHandlers
)

new akkajs_dom_page.UiManager(
  new Worker("./js/validator.out.js"),
  domHandlers
)
/*
new akkajs_dom_page.UiManager(
  new SharedWorker("./js/todo.out.js"),
  domHandlers
)

new akkajs_dom_page.UiManager(
  new SharedWorker("./js/validator.out.js"),
  domHandlers
)
*/
new akkajs_dom_page.UiManager(
  // require("./prime.js"),
  new Worker("./js/prime.out.js"),
  domHandlers
)
/*
const primesN = 10
for (i=0; i<primesN; i++) {
  const name = "shared" + i
  new akkajs_dom_page.UiManager(
    new SharedWorker("./js/prime.out.js", name),
    domHandlers
  )
}
*/

const ping = new SharedWorker("./js/pingpong.out.js", "ping")
const pong = new SharedWorker("./js/pingpong.out.js", "pong")

new akkajs_dom_page.UiManager(
  ping,
  domHandlers,
  function (e) {
    pong.port.postMessage(e.data)
  }
)

new akkajs_dom_page.UiManager(
  pong,
  domHandlers,
  function (e) {
    ping.port.postMessage(e.data)
  }
)

new akkajs_dom_page.UiManager(
  // require("./twitter.js"),
  // new Worker("./js/twitter.out.js"),
  new SharedWorker("./js/twitter.out.js"),
  domHandlers
)

new akkajs_dom_page.UiManager(
  new Worker("./js/twitter.out.js"),
  domHandlers
)

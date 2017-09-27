
const getInputValue = function(event) {
  return document.getElementById("elem").value
}

const getKeyUp = function(event) {
  return event.key
}

const killMe = function(event) {
  return {
    "killMe": true
  }
}

module.exports = {
  getInputValue,
  getKeyUp,
  killMe
}

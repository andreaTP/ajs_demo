
const getInputValue = function (event) {
  return event.srcElement.parentNode.parentNode.childNodes[0].value
}

const getTrackValue = function (event) {
  event.preventDefault()
  if (event.keyCode === 13) {
    return event.srcElement.value
  }
}

const getKeyUp = function (event) {
  return event.key
}

const killMe = function () {
  return {
    "killMe": true
  }
}

const click = function () {
  return {
    "click": true
  }
}

module.exports = {
  getInputValue,
  getTrackValue,
  getKeyUp,
  killMe,
  click
}

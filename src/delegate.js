
function matches (element, selector, target) {
  if (target === element) return
  if (target.matches && target.matches(selector)) return target
  return matches(element, selector, target.parentNode)
}

function delegateOne (element, selector, type, callback) {
  function wrapper (e) {
    var match = matches(element, selector, e.target)
    if (match) {
      return callback.call(match, e)
    }
  }
  element.addEventListener(type, wrapper, false)
  return function () {
    element.removeEventListener(type, wrapper, false)
  }
}

function delegateAll (element, options) {
  var undelegates = []
  for (var selector in options) {
    var types = options[selector]
    for (var type in types) {
      var callback = types[type]
      undelegates.push(delegateOne(element, selector, type, callback))
    }
  }
  return function () {
    var callback
    while ((callback = undelegates.shift())) {
      callback()
    }
  }
}

module.exports = delegateAll

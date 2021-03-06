/**
 * Checks if the passed in value is a string
 * @param {*} val
 * @return {boolean}
 */
export function isString(val) {
  return typeof val === 'string' || objectToString(val) === '[object String]'
}

/**
 * Checks if the passed in value is an array
 * @param {*} val
 * @return {boolean}
 */
export function isArray(val) {
  return Array.isArray || objectToString(val) === '[object Array]'
}

/**
 * Checks if the passed in value is a function
 * @param {*} val
 * @return {boolean}
 */
export function isFunction(obj) {
  return typeof obj === 'function' || false
}

/**
 * Checks if the passed in value is of type Object
 * @param {*} val
 * @return {boolean}
 */
export function isObject(obj) {
  var type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

/**
 * Extends an object with the properties of additional objects
 * @param {object} obj
 * @param {object} objects
 * @return {object}
 */
export function extend(obj) {
  var length = arguments.length

  if (!obj || length < 2) {
    return obj || {}
  }

  for (var index = 1; index < length; index++) {
    var source = arguments[index]
    var keys = Object.keys(source)
    var l = keys.length

    for (var i = 0; i < l; i++) {
      var key = keys[i]
      obj[key] = source[key]
    }
  }

  return obj
}

/**
 * Creates a shallow clone of an object
 * @param {object} obj
 * @return {object}
 */
export function clone(obj) {
  if (!exports.isObject(obj)) {
    return obj
  }
  return exports.isArray(obj) ? obj.slice() : exports.extend({}, obj)
}

/**
 * Iterates over a collection of elements yielding each iteration to an
 * iteratee. The iteratee may be bound to the context argument and is invoked
 * each time with three arguments (value, index|key, collection). Iteration may
 * be exited early by explicitly returning false.
 * @param {array|object|string} collection
 * @param {function} iteratee
 * @param {*} context
 * @return {array|object|string}
 */
export function each(collection, iteratee, context) {
  var length = collection ? collection.length : 0
  var i = -1
  var keys
  var origIteratee

  if (context) {
    origIteratee = iteratee
    iteratee = function(value, index, innerCollection) {
      return origIteratee.call(context, value, index, innerCollection)
    }
  }

  if (isLength(length)) {
    while (++i < length) {
      if (iteratee(collection[i], i, collection) === false) {
        break
      }
    }
  } else {
    keys = Object.keys(collection)
    length = keys.length
    while (++i < length) {
      if (iteratee(collection[keys[i]], keys[i], collection) === false) {
        break
      }
    }
  }

  return collection
}

/**
 * Returns a new function the invokes `func` with `partialArgs` prepended to
 * any passed into the new function. Acts like `Array.prototype.bind`, except
 * it does not alter `this` context.
 * @param {function} func
 * @param {*} partialArgs
 * @return {function}
 */
export function partial(func) {
  var slice = Array.prototype.slice
  var partialArgs = slice.call(arguments, 1)

  return function() {
    return func.apply(this, partialArgs.concat(slice.call(arguments)))
  }
}

/**
 * Returns a factory method that allows construction with or without `new`
 */
export function toFactory(Klass) {
  var Factory = function(...args) {
    return new Klass(...args)
  }

  Factory.__proto__ = Klass // eslint-disable-line no-proto
  Factory.prototype = Klass.prototype
  return Factory
}

/**
 * Returns the text value representation of an object
 * @private
 * @param {*} obj
 * @return {string}
 */
function objectToString(obj) {
  return obj && typeof obj === 'object' && toString.call(obj)
}

/**
 * Checks if the value is a valid array-like length.
 * @private
 * @param {*} val
 * @return {bool}
 */
function isLength(val) {
  return typeof val === 'number'
    && val > -1
    && val % 1 === 0
    && val <= Number.MAX_VALUE
}

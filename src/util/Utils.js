'use-strict'

const MongoError = require('../errors/MongoError')

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

class Utils extends null {
  static mergeDefault (def, given) {
    if (!given) return def
    for (const key in def) {
      if (!has(given, key) || given[key] === undefined) {
        given[key] = def[key]
      } else if (given[key] === Object(given[key])) {
        given[key] = Utils.mergeDefault(def[key], given[key])
      }
    }
    return given
  }

  static handleError (error) {
    let { reason, message } = error
    if (message.split(' ')[0] === 'getaddrinfo' && message.split(' ')[1] === 'ENOTFOUND') {
      message = `Uknown Host ${message.split(' ')[2]}`
    } else if (message.split(' ')[0] === 'Invalid' && message.split(' ')[1] === 'scheme,') {
      message = 'Invalid connection string provided, expected to start with "mongodb://" or "mongodb+srv://"'
    }

    throw new MongoError(message, reason ?? null)
  }

  /**
     * Check if the array contains only a given type.
     * @param {Array<any>} array The array to check
     * @param {string} type The type to check for
     * @returns
     */
  static checkArray (array, type) {
    for (const key of array) {
      if (typeof key !== type) return false
    }
    return true
  }
}

module.exports = Utils

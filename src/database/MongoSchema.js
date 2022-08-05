'use-strict'

const { Schema } = require('mongoose')
const mongoose = require('mongoose')
const MongoModel = require('./MongoModel')

/**
 * Represents a mongoose Schema
 */
class MongoSchema extends Schema {
  /**
	 * The name of the collection.
	 * @param {string} name The name of the collection.
	 * @return {MongoModel}
	 * @public
	 */
  model (name, makeCache = true) {
    if (typeof name !== 'string') throw new TypeError('INVALID_TYPE', 'name', 'string')
    if (typeof makeCache !== 'boolean') throw new TypeError('INVALID_TYPE', 'makeCache', 'boolean')
    return new MongoModel(mongoose.model(name, this), makeCache)
  }
}

module.exports = MongoSchema

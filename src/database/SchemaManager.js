'use-strict'

const { TypeError } = require('../errors')
const { Collection } = require('@discordjs/collection')
const SchemaBuilder = require('../builders/SchemaBuilder')
const MongoSchema = require('./MongoSchema')

/**
 * The manager of schemas
 */
class SchemaManager {
  /**
	 * The manager of schemas
	 * @param {Database} database The database managing this.
	 */
  constructor (database) {
    /**
		 * The database managing this.
		 * @type {Database}
		 */
    this.database = database

    /**
		 * The collection with all the schemas.
		 * @type {Collection<string,ModelObject>}
		 */
    this.collection = new Collection()
  }

  /**
	 * Adds a schema to the manager.
	 * @param {string} name The name of the schema.
	 * @param {MongoSchema|SchemaBuilder} schema The schema to add to the manager.
	 * @return {SchemaManager}
	 */
  addSchema (name, schema) {
    this.addSchemas({ name, schema })
    return this
  }

  /**
	 * @typedef {Object} SchemaObject
	 * @property {string} name The name of the schema.
	 * @property {MongoSchema|SchemaBuilder} schema The Schema.
	 */

  /**
	 * @typedef {Object} ModelObject
	 * @property {string} name The name of the model.
	 * @property {MongoModel} model The model.
	 */

  /**
	 * Add multiple schemas at once to the manager.
	 * @param {...SchemaObject|SchemaObject[]} optionSchemas The schemas to add.
	 * @return {SchemaManager}
	 */
  addSchemas(...schemaObjects) {
    let objs
    if (Array.isArray(schemaObjects[0])) {
      objs = schemaObjects[0]
    } else {
      objs = schemaObjects
    }
    for (let obj of objs) {
      if (obj.default) obj = obj.default;
      if (typeof obj.name !== 'string') throw new TypeError('INVALID_TYPE', 'name', 'string')
      if (obj.schema instanceof SchemaBuilder) obj.schema = obj.schema.toSchema()
      if (!(obj.schema instanceof MongoSchema)) throw new TypeError('INVALID_TYPE', 'schema', 'MongoSchema')

      const key = obj.name
      const model = obj.schema.model(key, this.database.client.options.makeCache)
      this[key] = model
      this.collection.set(key, { name: key, model })
    }

    return this
  }
}
module.exports = SchemaManager

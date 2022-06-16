'use-strict'

const { SchemaOptions } = require('mongoose')
const MongoSchema = require('../database/MongoSchema')
const SchemaFieldBuilder = require('./SchemaFieldBuilder')

/**
 * A builder to create a new schema
 */
class SchemaBuilder {
  /**
     * @typedef {Object} SchemaBuilderData
     * @property {SchemaFieldBuilder[]} fields The fields of the schema
     * @property {SchemaOptions} options The options of this schema.
     */
  /**
     * A builder to create a new schema
     * @param {SchemaBuilderData} data
     */
  constructor (data = {}) {
    /**
         * The fields of this schema
         * @type {SchemaFieldBuilder[]}
         */
    this.fields = data.fields ?? []

    /**
         * The options of this schema
         * @type {SchemaOptions}
         */
    this.options = data.options ?? {}
  }

  /**
     * Add a field to the schema
     * @param {(builder: SchemaFieldBuilder) => SchemaFieldBuilder} input
     * @returns {SchemaBuilder}
     */
  addField (input) {
    const result = input(new SchemaFieldBuilder())
    this.fields.push(result)
    return this
  }

  /**
     * Set the options of this schema
     * @param {SchemaOptions} options The new options
     * @returns {SchemaBuilder}
     */
  setOptions (options) {
    this.options = options
    return this
  }

  /**
     * Returns the JSON object
     * @returns {Object}
     */
  toJSON () {
    const obj = {}
    for (const field of this.fields) {
      if (field instanceof SchemaFieldBuilder) {
        const json = field.toJSON()
        const name = json.name
        delete json.name
        obj[name] = json
      }
    }

    return {
      fields: obj,
      options: this.options
    }
  }

  /**
     * Creates the mongo schema object
     * @return {MongoSchema}
     */
  toSchema () {
    return new MongoSchema(
      this.toJSON().fields,
      this.options
    )
  }
}

module.exports = SchemaBuilder

const { Schema, SchemaDefinition, SchemaOptions } = require('mongoose');
const mongoose = require('mongoose');
const MongoModel = require('./MongoModel');

/**
 * Represents a mongoose Schema
 */
class MongoSchema extends Schema {
    /**
     * Represents a mongoose Schema
     * @param {SchemaDefinition} obj 
     * @param {SchemaOptions} options The options of this schema
     */
    constructor(obj, options) {
        super(obj, options);
    }

    /**
     * The name of the collection.
     * @param {string} name The name of the collection.
     * @return {MongoModel}
     * @public
     */
    model(name, makeCache = true) {
        return new MongoModel(mongoose.model(name, this), makeCache);
    }
}

module.exports = MongoSchema;


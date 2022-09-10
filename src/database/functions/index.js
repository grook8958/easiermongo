/**
 * Increments a field's value by a specific `amount`
 * * Only available in edit/update methods and if the the field type is `number`
 * @param {string} fieldName The field name (can also be "object.propertyName")
 * @param {number} amount The amount to increment the field by
 * @returns {object}
 * @example
 * model.edit('some-id', {
 *   _id: 'some-id',
 *   ...increment('some-field', 10) // Increment by 10 the value of "some-field"
 * }
 */
exports.increment = (fieldName, amount) => {
	return { $inc: { [fieldName]: amount } };
};
/**
 * Pull a specific `value` from an array in the database
 * * Only available in edit/update methods and if the field type is an `Array`
 * @param {string} fieldName The field name (can also be "object.propertyName")
 * @param {number} value The value to pull from the array
 * @returns {object}
 * @example
 * model.edit('some-id', {
 *   _id: 'some-id',
 *   ...pull('some-field', 'theValue') // Removes "theValue" from the array
 * }
 */
exports.pull = (fieldName, value) => {
	return { $pull: { [fieldName]: value } };
};
/**
 * Push a specific `value` in an array in the database
 * * Only available in edit/update methods and if the field type is an `Array`
 * @param {string} fieldName The field name (can also be "object.propertyName")
 * @param {number} value The value to push into the array
 * @returns {object}
 * @example
 * model.edit('some-id', {
 *   _id: 'some-id',
 *   ...push('some-field', 'theValue') // Adds "theValue" to the array
 * }
 */
exports.push = (fieldName, value) => {
	return { $push: { [fieldName]: value } };
};

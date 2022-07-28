import MongoSchema from '../../src/database/MongoSchema.js';

export default new MongoSchema({
	_id: {
		type: String,
		required: true,
	},
});

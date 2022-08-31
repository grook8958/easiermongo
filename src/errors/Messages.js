'use strict';

const { register } = require('./EasierMongoError');

const Messages = {
	MONGO_CLIENT_INVALID_OPTION: (prop, must, an = false) => `The ${prop} option must be ${an ? 'an' : 'a'} ${must}`,
	INVALID_TYPE: (prop, must, an = false) => `${prop} must be ${an ? 'an' : 'a'} ${must}`,
	INVALID_FIELD_TYPE: (must, an = false) => `The field type must be ${an ? 'an' : 'a'} ${must}`,
	REQUIRED_FIELD: (field, on) => `"${field}" is required on ${on}.`
};

for (const [name, message] of Object.entries(Messages)) register(name, message);

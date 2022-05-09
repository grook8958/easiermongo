'use strict';

const { register } = require('./EasierMongoError');

const Messages = {
  MONGO_CLIENT_INVALID_OPTION: (prop, must, an = false) => `The ${prop} option must be ${an ? 'an' : 'a'} ${must}`,
  
};

for (const [name, message] of Object.entries(Messages)) register(name, message);

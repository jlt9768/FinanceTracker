const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
  premium: doc.premium,
  email: doc.email,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

/* eslint max-len: ["error", { "code": 150 }] */
AccountSchema.statics.authenticate = (username, password, callback) => AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

// Update the password and salt of the user
AccountSchema.statics.updatePass = (name, userObj, callback) => {
  const search = {
    username: name,
  };
  const password = {
    password: userObj.password,
    salt: userObj.salt,
  };

  return AccountModel.updateOne(search, password, callback);
};

// Update the premium status of the given user
AccountSchema.statics.upgrade = (name, callback) => {
  const search = {
    username: name,
  };
  const premium = {
    premium: true,
  };
  return AccountModel.updateOne(search, premium, callback);
};

AccountSchema.statics.recover = (username, callback) => AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }
  if (!doc) {
    return callback();
  }
  return callback(null, doc);
});

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;

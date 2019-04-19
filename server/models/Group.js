const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');

let GroupModel = {};

const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

const GroupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  name: {
    type: String,
    requried: true,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.statics.toAPI = (doc) => ({
  owner: doc.owner,
  name: doc.name,
});

GroupSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return GroupModel.find(search).select('owner name').exec(callback);
};


GroupModel = mongoose.model('Group', GroupSchema);

module.exports.GroupModel = GroupModel;
module.exports.GroupSchema = GroupSchema;

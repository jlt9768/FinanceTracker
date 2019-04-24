const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');

let FinanceModel = {};

const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

const FinanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    trim: true,
  },
  group: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  type: {
    type: String,
    requried: true,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

FinanceSchema.statics.toAPI = (doc) => ({
  date: doc.date,
  item: doc.item,
  type: doc.type,
  amount: doc.amount,
});

FinanceSchema.statics.findByOwner = (ownerId, groupId, callback) => {
  const search = {
    owner: convertId(ownerId),
    group: groupId,
  };
  return FinanceModel.find(search).select('date item type amount').exec(callback);
};


FinanceModel = mongoose.model('Finance', FinanceSchema);

module.exports.FinanceModel = FinanceModel;
module.exports.FinanceSchema = FinanceSchema;

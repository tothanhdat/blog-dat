const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const registerCustomer = new Schema({

    name: String,

    email: String,

    questionContent: String,

    blogID: { type: Schema.Types.ObjectId, ref: 'blog' },

    createAt: { type: Date, required: true, default: Date.now },
  
});

const REGISTER_CUSTOMER = mongoose.model('register_customer', registerCustomer);
module.exports  = REGISTER_CUSTOMER;
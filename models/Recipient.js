const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
	email: String,
	responded: { type: Boolean, default: false }
});

//this will be a subdocument, so we won't register it with gomgoose.model
// we export it to use it in the Survey model as a subdocument
module.exports = recipientSchema;

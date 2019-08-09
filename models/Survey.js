const mongoose = require('mongoose');
const RecipientSchema = require('./Recipient');
const { Schema } = mongoose;

const surveySchema = new Schema({
	title: String,
	subject: String,
	body: String,
	recipients: [RecipientSchema], // array of subdocuments
	yes: { type: Number, default: 0 },
	no: { type: Number, default: 0 },
	dateSent: Date,
	lastResponded: Date,
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('surveys', surveySchema);

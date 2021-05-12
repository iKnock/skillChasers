const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteSchema = new Schema({
    problemDescription: String,
    skills: [String],
    placeOfWork: String,
    numOfConsultant: String,
    projectDuration: String,
    status: String,
    remark: String,
    date: { type: Date, default: Date.now },
    _user: { type: Schema.Types.ObjectId, ref: 'Quote' }
});

mongoose.model('Quote', quoteSchema);

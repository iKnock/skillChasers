const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteSchema = new Schema({
    problemDescription: {
        type: String,
        required: [true, 'Put the description of the project!'],
        trim: true
    },
    skills: [{
        type: String,
        required: [true, 'Put the required skills!'],
        trim: true
    }],
    placeOfWork: String,
    numOfConsultant: String,
    projectDuration: String,
    status: {
        type: String,
        required: [true, 'Put the required skills!'],
        trim: true,
        enum: ['created', 'approved']
    },
    remark: String,
    date: { type: Date, default: Date.now },
    _user: { type: Schema.Types.ObjectId, ref: 'Quote' }
});

mongoose.model('Quote', quoteSchema);

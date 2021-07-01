const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'User Name is required!'],
        unique: [true, 'User Name must be unique'],
        trim: true,
    },
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
        enum: ['created', 'approved', 'rejected']
    },
    remark: String,
    date: { type: Date, default: Date.now },
    _user: { type: Schema.Types.ObjectId, ref: 'Quote' }
});

mongoose.model('Quote', quoteSchema);

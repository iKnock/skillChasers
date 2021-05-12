const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User Full Name is required!'],
    trim: true,
  },
  dateOfBirth: String,

  address: { country: String, city: String, street: String },
  email: String,
  role: [String],
  status: String,
  skills: [String],
  projects: [{ projName: String, description: String, tech: [String] }],
  eduInfo: [{ degreeName: String, yearOfGraduation: String }],
  certificate: [{ certificateName: String, certificateDescription: String, certifiedOnDate: String }],

  resource: [{ resourceCode: String, resourceName: String }],
  account: { userName: String, password: String, status: String },
  createdOnDate: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('User', userSchema);

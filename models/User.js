const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User Full Name is required!'],
    trim: true,
  },
  dateOfBirth: String,

  address: {
    country: {
      type: String,
      required: [true, 'Country is required!'],
      trim: true
    }, city: {
      type: String,
      required: [true, 'City is required!'],
      trim: true
    }, street: {
      type: String,
      required: [true, 'Street is required!'],
      trim: true
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    trim: true
  },
  role: {
    type: [String],
    required: [true, 'Atleast one Role is required!'],
    trim: true,
    enum: ['consultant', 'manager']
  },
  status: {
    type: [String],
    required: [true, 'Status is required!'],
    trim: true,
    enum: ['active', 'non active']
  },
  skills: [String],
  projects: [{ projName: String, description: String, tech: [String] }],
  eduInfo: [{ degreeName: String, yearOfGraduation: String }],
  certificate: [{ certificateName: String, certificateDescription: String, certifiedOnDate: String }],

  resource: [{ resourceCode: String, resourceName: String }],
  account: {
    userName: {
      type: String,
      required: [true, 'User Name is required!'],
      trim: true,
    }, password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
    }, status: String
  },
  createdOnDate: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('User', userSchema);

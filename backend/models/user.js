const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  weight: { type: Number, required: true },
  isAdmin: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  results: [
    {
      weight: { type: Number, required: true },
      powerliftingSumWeight: { type: Number, required: true },
      points: { type: Number, required: true },
      date: { type: Date, default: Date.now }, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

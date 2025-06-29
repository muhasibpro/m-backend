const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String }, // parol verify bosqichida qo‘yiladi
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  role: { type: Number, enum: [1, 99], default: 1 }, // 1 - user, 99 - admin
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
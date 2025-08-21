import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);
export default User;
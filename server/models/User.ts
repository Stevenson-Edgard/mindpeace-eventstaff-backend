import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true, default: 'Staff Member' },
  role: { type: String, enum: ['SUPERVISOR', 'GATEKEEPER', 'SECURITY'], default: 'GATEKEEPER' },
  location: { type: String, default: '' },
  activeTime: { type: String, default: '' },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  avatar: { type: String, default: '' }, // URL or base64 string
  currentGateId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;

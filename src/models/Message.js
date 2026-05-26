import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name:    String,
  email:   { type: String, required: true },
  phone:   String,
  subject: String,
  body:    { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export default mongoose.model('Message', messageSchema);

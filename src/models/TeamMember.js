import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  role:  String,
  photo: String,
  order: { type: Number, default: 0 },
}, { versionKey: false });

export default mongoose.model('TeamMember', teamMemberSchema);

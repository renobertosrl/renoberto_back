import mongoose from 'mongoose';

const processStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc:  String,
  order: { type: Number, default: 0 },
}, { versionKey: false });

export default mongoose.model('ProcessStep', processStepSchema);

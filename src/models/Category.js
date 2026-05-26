import mongoose from 'mongoose';

// _id IS the slug (e.g. 'carrelage') — kept as string for simplicity
const categorySchema = new mongoose.Schema({
  _id:  { type: String, required: true },
  name: { type: String, required: true, trim: true },
}, { versionKey: false });

export default mongoose.model('Category', categorySchema);

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  cat:   String,
  title: { type: String, required: true },
  desc:  String,
  price: String,
  order: { type: Number, default: 0 },
}, { versionKey: false });

export default mongoose.model('Service', serviceSchema);

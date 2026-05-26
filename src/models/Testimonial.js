import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  quote:    { type: String, required: true },
  name:     String,
  location: String,
  project:  String,
}, { timestamps: true, versionKey: false });

export default mongoose.model('Testimonial', testimonialSchema);

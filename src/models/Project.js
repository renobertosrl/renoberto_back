import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, trim: true, unique: true, sparse: true },
  category:    { type: String, trim: true },
  location:    { type: String, trim: true },
  surface:     Number,
  duration:    String,
  year:        Number,
  featured:    { type: Boolean, default: false },
  summary:     String,
  description: String,
  cover:       String,
  images:      [String],
  materials:   [String],
  beforeAfter: {
    before: String,
    after:  String,
  },
  views: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });

export default mongoose.model('Project', projectSchema);

import mongoose from 'mongoose';

// Singleton document — always fetched/updated with _id = 'main'
const contentSchema = new mongoose.Schema({
  _id: { type: String, default: 'main' },
  heroImage: String,
  about: {
    title: String,
    body:  String,
    image: String,
  },
  contact: {
    phone:     String,
    whatsapp:  String,
    email:     String,
    address:   String,
    city:      String,
    hours:     String,
    instagram: String,
  },
  stats: [{
    num:   String,
    label: String,
  }],
}, { versionKey: false });

export default mongoose.model('Content', contentSchema);

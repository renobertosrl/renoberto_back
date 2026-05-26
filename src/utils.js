export const toClient = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const { _id, __v, password, ...rest } = obj;
  return { ...rest, id: _id.toString() };
};

// Category uses string slug as _id
export const toCat = (doc) => ({ id: doc._id, name: doc.name });

// Extract Cloudinary public_id from a URL for cleanup on delete
export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = new URL(url).pathname.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return null;
    let start = uploadIdx + 1;
    if (/^v\d+$/.test(parts[start])) start++; // skip version segment
    return parts.slice(start).join('/').replace(/\.[^./]+$/, ''); // strip extension
  } catch {
    return null;
  }
};

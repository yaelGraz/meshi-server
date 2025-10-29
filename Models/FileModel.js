import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },      // שם בקבצי supabase (הייחודי)
  originalName: { type: String, required: true },  // שם המקורי
  url: { type: String, required: true },           // public URL
  mimetype: { type: String },
  size: { type: Number },
  category: { type: String, default: null },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.File || mongoose.model("File", FileSchema);

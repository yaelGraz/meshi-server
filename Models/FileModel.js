import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },   // שם בקאבט (כולל תיקיות לוגיות אם יש)
    guidName: { type: String, required: true, index: true, unique: true },
    originalName: { type: String, required: true },
    url: { type: String },                        // public URL (אם הבאקט ציבורי)
    path: { type: String, required: true },       // הנתיב המדויק בבאקט (למחיקה/החלפה)
    mimetype: { type: String },
    size: { type: Number },
    category: { type: String, index: true },
    subcategory: { type: String, index: true },
    metadata: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("File", FileSchema);

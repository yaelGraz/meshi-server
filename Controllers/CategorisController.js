import mongoose from "mongoose";
import CategoriesModel from "../Models/CategoriesModel.js";

/**
 * עוזר: מנרמל מערך תתי־קטגוריות שהגיע מהלקוח (מחרוזות/אובייקטים) למבנה
 * [{ _id, name }] – שומר _id קיים אם נשלח, יוצר חדש אם לא.
 * try
 */
function normalizeSubCategories(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter(Boolean)
    .map((s) => {
      if (typeof s === "string") {
        return { _id: new mongoose.Types.ObjectId(), name: s };
      }
      const name = (s?.name || "").trim();
      if (!name) return null;
      // אם הגיע id מהלקוח – נשמר אותו כ-_id; אחרת נייצר חדש
      if (s?.id && mongoose.Types.ObjectId.isValid(s.id)) {
        return { _id: new mongoose.Types.ObjectId(s.id), name };
      }
      if (s?._id && mongoose.Types.ObjectId.isValid(s._id)) {
        return { _id: new mongoose.Types.ObjectId(s._id), name };
      }
      return { _id: new mongoose.Types.ObjectId(), name };
    })
    .filter(Boolean);
}

const CategoriesController = {
  // שימוש פנימי
  fetchCategories: async () => {
    const categories = await CategoriesModel.find({}).lean();
    return categories;
  },

  // GET /categories
  getList: async (req, res) => {
    try {
      const categories = await CategoriesController.fetchCategories();
      return res.status(200).send({ categories });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /categories/:subcategoryName
  getCategoryBySubcategory: async (req, res) => {
    try {
      const subcategoryName = String(req.params.subcategoryName || "").trim();
      if (!subcategoryName) {
        return res.status(400).json({ error: "subcategoryName is required" });
      }

      // חיפוש ישיר במסד לפי שם תת־קטגוריה
      const category = await CategoriesModel.findOne({
        "subCategories.name": subcategoryName,
      }).lean();

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.status(200).json(category);
    } catch (e) {
      console.error("getCategoryBySubcategory error:", e);
      return res.status(500).json({ error: e.message });
    }
  },

  // POST /categories/add
  add: async (req, res) => {
    try {
      const name = String(req.body?.name || "").trim();
      if (!name) throw new Error("Invalid category name");

      // בדיקת כפילות אופציונלית
      const exists = await CategoriesModel.findOne({ name }).lean();
      if (exists) throw new Error(`Category "${name}" already exists`);

      const subCategories = normalizeSubCategories(req.body?.subCategories);
      const created = await CategoriesModel.create({ name, subCategories });

      return res
        .status(201)
        .json({ ok: true, category: created.toObject ? created.toObject() : created });
    } catch (e) {
      console.error("add category error:", e);
      return res.status(400).json({ message: e.message });
    }
  },

  // PUT /categories/update/:id
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const name = String(req.body?.name || "").trim();
      if (!name) throw new Error("Invalid category name");

      // ממפים מערך תתי־קטגוריות למסמכים עם _id + name
      const subCategories = normalizeSubCategories(req.body?.subCategories);

      const updated = await CategoriesModel.findByIdAndUpdate(
        id,
        { name, subCategories },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) return res.status(404).json({ message: "Category not found" });
      return res.status(200).json({ ok: true, category: updated });
    } catch (e) {
      console.error("updateCategory error:", e);
      return res.status(400).json({ message: e.message });
    }
  },

  // PUT /categories/delete/:id   (שומרים תאימות לצד הלקוח שלך)
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const deleted = await CategoriesModel.findByIdAndDelete(id).lean();
      if (!deleted) return res.status(404).json({ message: "Category not found" });

      // אין שום טיפול בתיקיות/קבצים – MongoDB בלבד
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("deleteCategory error:", e);
      return res.status(400).json({ message: e.message });
    }
  },
};

export default CategoriesController;

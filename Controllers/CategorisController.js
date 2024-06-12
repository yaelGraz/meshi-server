import fs from 'fs';
import path from 'path';
import CategoriesModel from "../Models/CategoriesModel.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import SubCategoryModel from "../Models/SubCategoryModel.js";
import mongoose from 'mongoose';
import { Console } from 'console';

//try
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CategoriesController = {
  fetchCategories: async () => {
    try {
      const categories = await CategoriesModel.find({});
      return categories;
    } catch (e) {
      throw new Error(`Error fetching categories: ${e.message}`);
    }
  },

  getList: async (req, res) => {
    try {
      const categories = await CategoriesController.fetchCategories();
      res.send({ categories });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

    getCategoryByName: async (categoryName) => {
      try {
    
        const category = await CategoriesModel.findOne({ name: categoryName });
        return category ? category._id : null;
      } catch (error) {
        console.error('Error fetching category by name:', error);
        throw error;
      }
    },
  
    getSubcategoryByName: async (categoryName, subcategoryName) => {
      try {
        // Fetch the category first 
        // console.log("categoryName in  getSubcategoryByName",categoryName) 
        // console.log("subcategoryName in  getSubcategoryByName",subcategoryName) 
        const category = await CategoriesModel.findOne({ name: categoryName })
        if (!category) {
          throw new Error(`Category "${categoryName}" not found`);
        }
      
        const findSubcategory = (subcategories, name) => {
          if (!Array.isArray(subcategories)) {   
            return null;
          }
// console.log("subcategories",subcategories)
          for (const sub of subcategories) {   
            if (sub.name === subcategoryName) {
// console.log("subcategoryName in findSubcategory",subcategoryName)
              return sub._id;
            }
            if (sub.subcategories && sub.subcategories.length > 0) {
              const result = findSubcategory(sub.subcategories, name);
              if (result) {
                return result;
              }
            }
          }
          return null;
        };
    
        // Start searching for the subcategory from the category's subcategories array
        const subcategoryId = findSubcategory(category.subCategories, subcategoryName);
        return subcategoryId;
      } catch (error) {
        console.error('Error fetching subcategory by name:', error);
        throw error;
      }
    },
    
 
    updateCategory: async (req, res) => {
      try {
          const categoryId = req.params.id;
          const { name, subCategories } = req.body;

          if (!name || typeof name !== 'string') {
              throw new Error('Invalid category name: must be a string');
          }
  
          const category = await CategoriesModel.findById(categoryId);
          if (!category) {
              throw new Error(`Category with ID ${categoryId} not found`);
          }
  
          // Update category name
          category.name = name;
        
          // Transform subCategories to only contain names
          const subCategoryObjects = subCategories.map((subCat,i) => {

              if (typeof subCat === 'object' && subCat.id) {
              

                  return { name: subCat.name || '', _id: subCat.id };
              } else if (typeof subCat === 'object' && !subCat.id) {
           
                  const newId = new mongoose.Types.ObjectId();
                  return { name: subCat.name, _id: newId.toString() };
              }
              return null;
          }).filter(Boolean); // filter out any null values from the array
  
          // Save transformed subCategories to the category
          category.subCategories = subCategoryObjects;
  
          await category.save();
  
          // Create new subcategory folders if they do not exist
          const newCategoryPath = path.join(__dirname, '..', 'files', categoryId.toString());
          if (subCategoryObjects && subCategoryObjects.length > 0) {
              const oldSubCategoryNames = fs.readdirSync(newCategoryPath);
              for (const newSubCat of subCategoryObjects) {
                  const newSubCategoryPath = path.join(newCategoryPath, newSubCat._id.toString());
                  if (!oldSubCategoryNames.includes(newSubCat._id.toString())) {
                      fs.mkdirSync(newSubCategoryPath, { recursive: true });
                  }
              }
          }
  
          res.status(200).json({ message: `Category with ID ${categoryId} updated successfully` });
      } catch (error) {
          console.error('Error updating category:', error);
          res.status(400).json({ message: error.message });
      }
  },

  
  add: async (req, res) => {
    try {
       console.log("i am in add category")
      const { name, subCategories } = req.body;
    
      // Validate input data (optional but recommended)
      if (!name || typeof name !== 'string') {
        throw new Error('Invalid category name: must be a string');
      }
  
      // Check for existing category (optional, depending on requirements)
      const existingCategory = await CategoriesModel.findOne({ name });
      if (existingCategory) {
        throw new Error(`Category "${name}" already exists`);
      }
  
      // Save subcategories if provided
      const savedSubCategories = [];
      if (Array.isArray(subCategories)) {
        for (const subCategoryData of subCategories) {

            // Create a new subcategory object
            const subCategory = new SubCategoryModel({ name: subCategoryData.name });
            // Save the subcategory
            const savedSubCategory = await subCategory.save();
            // Push the saved subcategory id to the array
            savedSubCategories.push(savedSubCategory );
          
        }
      }
  
      // Create a new category object with subcategory IDs
      const newCategory = new CategoriesModel({ name, subCategories: savedSubCategories });
  
      // Save the new category to the database
      await newCategory.save();

        // Create category folder
        const categoryPath = path.join(__dirname, '..', 'files', newCategory._id.toString());
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath, { recursive: true });
        }

        // Create folders for subcategories
        if (savedSubCategories && savedSubCategories.length > 0) {
            for (const subCat of savedSubCategories) {
                const subCategoryPath = path.join(categoryPath, subCat._id.toString());
                if (!fs.existsSync(subCategoryPath)) {
                    fs.mkdirSync(subCategoryPath, { recursive: true });
                }
            }
        }

        res.status(201).json({ message: `Category "${name}" added successfully` });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(400).json({ message: error.message });
    }
},
getCategoryBySubcategory: async (req, res) => {
  try {
    // console.log("req.params.subcategoryName", req.params); // Log req.params for debugging
    const subcategoryName = req.params.subcategoryName; // Access subcategoryName correctly
    
    if (!subcategoryName) {
      return res.status(400).json({ error: "subcategoryName is required" });
    }

    const categories = await CategoriesController.fetchCategories(); // Await the promise
// console.log("categories",categories)
    // Use find method to search the category
    const category = categories?.find(category =>
      category.subCategories.find(
        subcategory => subcategory?.name === subcategoryName)
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    return res.json(category); // Send the response with the found category
  } catch (e) {
    console.error(`Error finding category: ${e.message}`);
  
    return res.status(500).json({ error: `Error finding category: ${e.message}` });
  }
},


  deleteCategory: async (req, res) => {
    try {
 
      const categoryId = req.params.id;

      // Remove category from the database
      const category = await CategoriesModel.findByIdAndDelete(categoryId);
      if (!category) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      // Remove associated folder
      const categoryPath = path.join(__dirname, '..', 'files', categoryId.toString());
      if (fs.existsSync(categoryPath)) {
        fs.rmSync(categoryPath, { recursive: true, force: true });
      }

      res.status(200).json({ message: `Category with ID ${categoryId} deleted successfully` });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(400).json({ message: error.message });
    }
  }
}




export default CategoriesController;

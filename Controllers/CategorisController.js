import fs from 'fs';
import path from 'path';
import CategoriesModel from "../Models/CategoriesModel.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import SubCategoryModel from "../Models/SubCategoryModel.js";
import mongoose from 'mongoose';
import { Console } from 'console';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CategoriesController = {
    getList: async (req, res) => {
        try {
            const categories = await CategoriesModel.find({});
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
        const category = await CategoriesModel.findOne({ name: categoryName });
        if (!category) {
          throw new Error(`Category "${categoryName}" not found`);
        }
 
        // Function to recursively search for a subcategory by name
        const findSubcategory = (subcategories, name) => {
          if (!Array.isArray(subcategories)) {   
            return null;
          }
    
          for (const sub of subcategories) {   
            if (sub.name === subcategoryName) {
              console.log("sub._id",sub._id)
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
  console.log("req.body in update category",req.body)
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
console.log("index",i)
console.log("typeof(subCat)",typeof(subCat))
              if (typeof subCat === 'object' && subCat.id) {
                console.log("typeof subCat === 'object' && subCat.id'")

                  return { name: subCat.name || '', _id: subCat.id };
              } else if (typeof subCat === 'object' && !subCat.id) {
                console.log("typeof subCat === 'object' && !subCat.id")
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
      console.log("subCategoryData",subCategoryData)
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
}

export default CategoriesController;

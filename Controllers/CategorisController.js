import CategoriesModel from "../Models/CategoriesModel.js";

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
        console.log("categories", categories);
        res.send({ categories });
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    },
  
    getCategoryBySubcategory: async (req, res) => {
      console.log("req.params", req.params);
      try {
        const subcategoryName = req.params.subcategoryName; // Access subcategoryName correctly
        
        if (!subcategoryName) {
          return res.status(400).json({ error: "subcategoryName is required" });
        }
  
        const categories = await CategoriesController.fetchCategories(); // Await the promise
        console.log("categories", categories);
        
        const category = categories.find(category =>
          category.subCategories.some(subcategory => subcategory.name === subcategoryName)
        );
        console.log("category", category);
  
        if (!category) {
          return res.status(404).json({ error: "Category not found" });
        }
        
        return res.json(category); // Send the response with the found category
      } catch (e) {
        console.error(`Error finding category: ${e.message}`);
        return res.status(500).json({ error: `Error finding category: ${e.message}` });
      }
    }
  };
  

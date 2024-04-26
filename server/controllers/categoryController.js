// Create Category
import { categoryModel } from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const existCategory = await categoryModel.findOne({ name });
    if (existCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const newCategory = await new categoryModel({ name }).save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Category

export const getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

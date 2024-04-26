import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { upload } from "../helper/multer.js";

// User Registration
export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "Please fill all the fields" });
    }
    const existUser = await userModel.findOne({ email, username });
    if (existUser) {
      res.status(400).json({ message: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await new userModel({
      username,
      email,
      password: hashedPassword,
      role: "user",
      posts: [],
    }).save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "25d",
    });

    // Exclude password field from user object
    const { password: userPassword, ...userDataWithoutPassword } =
      user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: userDataWithoutPassword,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get user
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Found", user });
  } catch (error) {
    console.log(error);
  }
};

// Upload Avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    // Retrieve the user ID from the request (assuming it's stored in req.user.id)
    const userId = req.user.id;

    // Use 'upload' middleware to handle file upload
    upload.single("avatar")(req, res, async (err) => {
      if (err) {
        // Handle multer errors, such as file size exceeded or invalid file type
        return res
          .status(400)
          .json({ message: "Error uploading file", error: err.message });
      }

      try {
        // Assuming you have a User model and you're using Mongoose
        const user = await userModel.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Update the user's avatar field with the filename or file URL
        user.avatar = req.file.filename; // or req.file.path if using diskStorage
        await user.save();

        const { filename, mimetype, size } = req.file;
        res.status(200).json({
          message: "File uploaded successfully",
          filename,
          mimetype,
          size,
        });
      } catch (error) {
        console.error("Error updating user avatar:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;
    if (
      !username ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
    }
    const existEmail = await userModel.findOne({ email, _id: { $ne: id } });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await userModel.findById(id);
    const validatePassword = bcrypt.compareSync(currentPassword, user.password);
    if (!validatePassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({ message: "Passwords do not match" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { username, email, password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ message: "User updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

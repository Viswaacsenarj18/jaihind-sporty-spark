import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzyilb43m',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateToken = (id, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'yourSuperSecretKey123';
  console.log('🔐 JWT_SECRET in use:', secret?.substring(0, 10) + '...');
  console.log('🔐 Generating token for ID:', id, 'Role:', role);
  const token = jwt.sign({ id, role }, secret, { expiresIn: '30d' });
  console.log('✅ Token generated, length:', token.length);
  return token;
};

// ✅ UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, email, phone, gender, profilePicture } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(profilePicture && { profilePicture }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ UPLOAD PROFILE PHOTO (Cloudinary)
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("📁 File received:", req.file.originalname, req.file.size, req.file.mimetype);

    // Upload to Cloudinary using buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "jaihind-sports/profiles",
        resource_type: "auto",
        public_id: `profile_${userId}`,
      },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return res.status(500).json({ 
            success: false, 
            message: "Upload failed", 
            error: error.message 
          });
        }

        console.log("✅ Cloudinary upload successful:", result.secure_url);

        try {
          // Update user profile with image URL
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: result.secure_url },
            { new: true }
          ).select("-password");

          console.log("✅ User profile updated with photo URL");

          res.json({
            success: true,
            message: "Photo uploaded successfully",
            photoUrl: result.secure_url,
            user: updatedUser,
          });
        } catch (err) {
          console.error("❌ Database update error:", err);
          res.status(500).json({ 
            success: false, 
            message: "Failed to update profile", 
            error: err.message 
          });
        }
      }
    );

    // Pipe buffer as stream to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("❌ Upload endpoint error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone, address });
    
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        profilePicture: user.profilePicture || "",
        role: 'user',
        token: generateToken(user._id, 'user')
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User login successful:', email);
    const token = generateToken(user._id, 'user');
    console.log('✅ Token generated, length:', token.length);

    res.json({
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        profilePicture: user.profilePicture || "",
        role: 'user',
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// ✅ DELETE USER (Admin function)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.json({ 
      success: true, 
      message: 'User deleted successfully',
      data: { deletedUserId: user._id }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting user', 
      error: err.message 
    });
  }
};

// ✅ GET ALL USERS (Admin function)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      totalUsers: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users', 
      error: err.message 
    });
  }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords don't match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password changed successfully for user:", userId);

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Password required to delete account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Delete user profile picture from Cloudinary if exists
    if (user.profilePicture) {
      try {
        const publicId = `jaihind-sports/profiles/profile_${userId}`;
        await cloudinary.uploader.destroy(publicId);
        console.log("✅ Profile picture deleted from Cloudinary");
      } catch (err) {
        console.error("Warning: Could not delete from Cloudinary:", err);
      }
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);
    console.log("✅ User account deleted:", userId);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ SAVE CART TO DATABASE
export const saveCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "Invalid cart items" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    ).select("-password");

    console.log("✅ Cart saved to database for user:", userId);

    res.json({
      success: true,
      message: "Cart saved successfully",
      user
    });
  } catch (err) {
    console.error("Save Cart Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ GET CART FROM DATABASE
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("cartItems");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cartItems: user.cartItems || []
    });
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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

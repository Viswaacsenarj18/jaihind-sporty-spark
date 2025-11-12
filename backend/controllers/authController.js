import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
        token: generateToken(user._id)
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

    res.json({
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
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

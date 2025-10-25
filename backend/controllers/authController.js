import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone, address });
    res.status(201).json({
      message: 'User registered',
      data: { id: user._id, email: user.email, token: generateToken(user._id) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      data: { id: user._id, name: user.name, email: user.email, token: generateToken(user._id) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password, role });
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res
      .status(201)
      .json({
        success: true,
        message: "User registered",
        data: {
          user: { id: user._id, name, email, role },
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: { id: user._id, name: user.name, email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login, refresh, logout };

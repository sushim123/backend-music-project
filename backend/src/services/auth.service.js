import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/mysql/index.js';
import { badRequest, conflict, unauthorized } from '../utils/apiError.js';

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_replace_in_production_123456';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw conflict('Email is already registered. Please login instead.');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user in MySQL
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword
  });

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user in MySQL
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    throw unauthorized('Invalid email or password credentials.');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw unauthorized('Invalid email or password credentials.');
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};

export const updateUserProfile = async (userId, { name, email, password }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw unauthorized('User not found.');
  }

  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== user.email) {
      const emailTaken = await User.findOne({ where: { email: normalizedEmail } });
      if (emailTaken) {
        throw conflict('The specified email is already in use by another account.');
      }
      user.email = normalizedEmail;
    }
  }

  if (name) {
    user.name = name.trim();
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    updatedAt: user.updatedAt
  };
};

import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser({ name, password }) {
  const existing = await User.findOne({ name });
  if (existing) throw new Error('El nombre de usuario ya está registrado');
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, password: hash });
  await user.save();
  return user;
}

export async function loginUser({ name, password }) {
  const user = await User.findOne({ name });
  if (!user) throw new Error('Usuario o contraseña incorrectos');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Usuario o contraseña incorrectos');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: '2h' });
  return { token, user };
}

export async function getAllUsers() {
  return await User.find({}, '-password');
}

export async function getUserById(id) {
  return await User.findById(id, '-password');
}

export async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// Crear admin por defecto si no existe
export async function ensureAdminExists() {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      password: hash,
      role: 'admin'
    });
  }
} 
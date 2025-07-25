import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser
} from '../services/userServices.js';

export async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function login(req, res) {
  try {
    const { token, user } = await loginUser(req.body);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function getAll(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getById(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
} 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const hash = await bcrypt.hash('admin123', 10);
  const admin = new User({
    name: 'Admin',
    password: hash,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin creado');
  process.exit();
}

createAdmin();
// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    deviceId: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  const User = mongoose.model('User', userSchema);

  app.post('/register', async (req, res) => {
    const { name, email, password, deviceId } = req.body;
    if (!name || !email || !password || !deviceId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });
  
      const newUser = new User({ name, email, password, deviceId });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

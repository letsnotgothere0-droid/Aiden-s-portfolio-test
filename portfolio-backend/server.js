require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  // This allows both your local testing and your deployed Vercel site
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- ROUTES ---

// Health check route
app.get('/', (req, res) => {
  res.send('Backend is running and healthy');
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
  console.log("Data received from frontend:", req.body);

  try {
    const { name, email, message } = req.body;

    // Basic validation to ensure data exists
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    console.log("Message saved to MongoDB!");
    res.json({ success: true });

  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch messages (for you to check later)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// --- SERVER & DATABASE START ---

// On Render, we start the server immediately so it doesn't time out
app.listen(PORT, () => {
  console.log(`Server is breathing on port ${PORT}`);
});

// Connect to MongoDB in the background
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/message');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: 'https://aiden-s-portfolio-test.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());
app.use(express.json());

// ROUTES FIRST
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/api/contact', async (req, res) => {

  console.log("REQUEST REACHED BACKEND");

  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.json({ success: true });

  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// CONNECT DB THEN START SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
require('dotenv').config();

const Message = require('./models/message');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      message
    });

    await newMessage.save();

    console.log("Saved message:", newMessage);

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
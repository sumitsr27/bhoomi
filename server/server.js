const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const agreementRoutes = require('./routes/agreementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
[uploadsDir, path.join(uploadsDir, 'lands'), path.join(uploadsDir, 'agreements')].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/uploads', express.static(uploadsDir));
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Bhoomi Rental API' }));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

start();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./src/routes/authRouters');
const userRoutes = require('./src/routes/userRouters');
const productRoutes = require('./src/routes/productRoutes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = 4001;

// CORS (faqat test uchun barcha originlarga ruxsat, productionda keraklisini yozing!)
app.use(cors({
  origin: "https://m-front-peach.vercel.app"
}));
// JSON body
app.use(express.json());



app.use(express.urlencoded({ extended: true }));

// Static uploads


app.use('/greenleaf/gg/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', productRoutes);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



// Error middleware
app.use(errorMiddleware.errorMiddleware);

// Mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error('MongoDB connection error:', err));

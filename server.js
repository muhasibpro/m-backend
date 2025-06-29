// Kerakli modullarni import qilish
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // .env faylidagi o'zgaruvchilarni yuklash
const path = require('path');

// Router va middleware'larni import qilish
const authRoutes = require('./src/routes/authRouters');
const userRoutes = require('./src/routes/userRouters');
const productRoutes = require('./src/routes/productRoutes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

// Express ilovasini yaratish
const app = express();
const PORT = process.env.PORT || 4001; // Render kabi platformalar uchun PORT'ni .env'dan olish

// --- CORS Sozlamalari (ENG MUHIM QISM) ---
// Turli muhitlardan (local, ngrok, production) keladigan so'rovlarga ruxsat berish uchun
// ruxsat etilgan manzillar (origin) ro'yxatini yaratamiz.
const allowedOrigins = [
  'http://localhost:3000', // Mahalliy (local) development uchun (masalan, Create React App)
  'http://localhost:5173', // Mahalliy (local) development uchun (masalan, Vite)
  'https://m-front-peach.vercel.app', // Production frontend (Vercel)
  'https://9cf4-82-215-126-102.ngrok-free.app' // Siz ishlatgan oxirgi ngrok manzili
  // Bu yerga kelajakda boshqa kerakli manzillarni qo'shishingiz mumkin
];

const corsOptions = {
  origin: function (origin, callback) {
    // Agar so'rov yuborayotgan manzil (origin) bizning ro'yxatimizda bo'lsa
    // yoki so'rovda origin bo'lmasa (masalan, Postman orqali), ruxsat beramiz.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Aks holda, CORS xatoligini qaytaramiz.
      callback(new Error('Bu manzil uchun CORS siyosati tomonidan ruxsat etilmagan.'));
    }
  },
  credentials: true, // Frontend'dan cookie'lar yoki Authorization sarlavhalarini qabul qilishga ruxsat
  optionsSuccessStatus: 200 // Ba'zi eski brauzerlar uchun kerak
};

// CORS sozlamalarini ilovaga qo'llash
app.use(cors(corsOptions));


// --- Boshqa Middleware'lar ---

// Kiruvchi so'rovlarni JSON formatida qabul qilish
app.use(express.json());

// URL-encoded ma'lumotlarni qabul qilish (formalar uchun)
app.use(express.urlencoded({ extended: true }));

// 'uploads' papkasini "static" qilish, ya'ni fayllarga to'g'ridan-to'g'ri murojaat qilish imkonini berish
// Masalan: https://your-backend.com/greenleaf/gg/uploads/image.jpg
app.use('/greenleaf/gg/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Marshrutlar (Routes) ---

// Mahsulotlar bilan bog'liq marshrutlar
app.use('/api', productRoutes);

// Autentifikatsiya bilan bog'liq marshrutlar
app.use('/api/auth', authRoutes);

// Foydalanuvchilar bilan bog'liq marshrutlar
app.use('/api/users', userRoutes);


// --- Xatoliklarni ushlab oluvchi Middleware ---
// Barcha marshrutlardan keyin eng oxirida turishi shart!
app.use(errorMiddleware.errorMiddleware);


// --- MongoDB'ga ulanish va Serverni ishga tushirish ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB ga muvaffaqiyatli ulanildi.');
    app.listen(PORT, () => console.log(`Server ${PORT}-portda ishga tushdi.`));
  })
  .catch(err => {
    console.error('MongoDB ga ulanishda xatolik yuz berdi:', err);
  });

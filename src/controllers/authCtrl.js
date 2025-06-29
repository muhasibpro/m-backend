const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const User = require('../model/userModel');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const authCtrl = {
  // 1. Ro'yxatdan o'tish: emailga kod yuboradi
  signup: async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) return res.status(400).json({ message: "Ism va email majburiy!" });

      let user = await User.findOne({ email });
      if (user && user.isVerified) {
        return res.status(400).json({ message: 'Bu email allaqachon ro‘yxatdan o‘tgan!' });
      }

      const code = generateCode();

      await sendEmail(
        email,
        "Tasdiqlash kodingiz",
        `Ro'yxatdan o'tish uchun tasdiqlash kodingiz: ${code}`
      );

      user = await User.findOneAndUpdate(
        { email },
        { name, email, verificationCode: code, isVerified: false },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ message: "Tasdiqlash kodi emailingizga yuborildi!" });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },

  // 2. Emailga kelgan kod va password tekshiradi
  verifyCode: async (req, res) => {
    try {
      const { email, code, password } = req.body;
      if (!email || !code || !password) return res.status(400).json({ message: "Hamma maydonlar to‘ldirilishi kerak!" });

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ message: "Noto'g'ri tasdiqlash kodi!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.isVerified = true;
      user.verificationCode = null;

      await user.save();

      const token = JWT.sign(
        { userId: user._id, role: 1 },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(201).json({ message: "Signup success", token, role: 1 });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },


  // 3. Login faqat email va password
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email va parol majburiy!" });

      const user = await User.findOne({ email });
      if (!user || !user.isVerified) {
        return res.status(400).json({ message: "Foydalanuvchi topilmadi yoki tasdiqlanmagan!" });
      }

      const verifyPassword = await bcrypt.compare(password, user.password);

      if (!verifyPassword) {
        return res.status(400).json({ message: "Parol noto'g'ri" });
      }

      const token = JWT.sign(
        { userId: user._id, role: 1 },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: "Login success", token, role: 1 });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  }
};

module.exports = authCtrl;







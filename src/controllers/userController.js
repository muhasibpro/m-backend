const User = require('../model/userModel');

const userController ={
    getAllUsers : async (req, res, next) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (err) {
            next(err);
        }
    },
     getOneUserById : async (req, res) => {
        try {
          const { id } = req.params;
          const user = await User.findById(id).select('-password -verificationCode');
          if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
}

// Qo'shimcha funksiyalar kerak bo'lsa shu yerga yozasiz

module.exports = userController
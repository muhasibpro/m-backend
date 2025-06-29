const Product = require('../model/productModel');
const path = require('path');
const fs = require('fs');

// CONTROLLER OBJEKTI KO‘RINISHIDA
const productController = {
    // ADD PRODUCT
    addProd: async (req, res) => {
        try {
          const { name, price, color, limit, description } = req.body;
          let imgUrls = [];
    
          // Rasm(lar) keldi (bir yoki ko‘p bo‘lishi mumkin)
          let files = req.files;
          if (!files) files = req.file ? [req.file] : [];
    
          // Rasm(lar)ni muhasib.pro ga proxy qilib yuboramiz
          for (const file of files) {
            const formData = new FormData();
            formData.append("file", file.buffer, file.originalname);
    
            const remoteResp = await fetch("https://muhasib.pro/uploads/", {
              method: "POST",
              body: formData,
              headers: formData.getHeaders(),
            });
            const result = await remoteResp.json();
    
            // Rasm nomi remote serverdan qaytadi (masalan: {filename: 'abc.jpg'})
            const remoteFileName = result.filename || result.url || file.originalname;
            // To‘liq URL yasaymiz
            imgUrls.push(`https://muhasib.pro/uploads/${remoteFileName}`);
          }
    
          const product = new Product({
            name,
            price,
            color,
            limit,
            description,
            imgUrl: imgUrls,
          });
          await product.save();
          res.json({ message: "Mahsulot qo‘shildi", product });
        } catch (err) {
          res.status(500).json({ message: err.message || "Server xatosi" });
        }
      },

    // EDIT PRODUCT
    editProd: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, color, limit, description } = req.body;
            let updateData = { name, price, color, limit, description };

            if (req.files && req.files.length > 0) {
                // Eski rasmlarni o‘chirish (xohlasangiz)
                const product = await Product.findById(id);
                if (product && product.imgUrl && product.imgUrl.length > 0) {
                    for (const url of product.imgUrl) {
                        const filename = url.split('/uploads/')[1];
                        if (filename) {
                            const filepath = path.join(__dirname, 'uploads', filename);
                            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                        }
                    }
                }
                updateData.imgUrl = req.files.map(file =>
                    `https://muhasib.pro/uploads/${file.filename}`
                );
            }

            const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
            if (!updated) return res.status(404).json({ message: 'Mahsulot topilmadi' });
            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: 'Server xatosi', error: err.message });
        }
    },

    // DELETE PRODUCT
    deleteProd: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByIdAndDelete(id);
            if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });

            // Rasmlarni o‘chirish (xohlasangiz)
            if (product.imgUrl && product.imgUrl.length > 0) {
                for (const url of product.imgUrl) {
                    const filename = url.split('/uploads/')[1];
                    if (filename) {
                        const filepath = path.join(__dirname, 'uploads', filename);
                        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                    }
                }
            }
            res.json({ message: 'Mahsulot o‘chirildi' });
        } catch (err) {
            res.status(500).json({ message: 'Server xatosi', error: err.message });
        }
    },

    // GET ALL PRODUCTS
    getAll: async (req, res) => {
        try {
            const products = await Product.find().sort('-createdAt');
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: 'Server xatosi', error: err.message });
        }
    },

    // GET ONE PRODUCT
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
            res.json(product);
        } catch (err) {
            res.status(500).json({ message: 'Server xatosi', error: err.message });
        }
    }
};

module.exports = productController;
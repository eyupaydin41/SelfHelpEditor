const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', (req, res) => {
    res.render('auth');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Şifre yanlış' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_TOKEN, { expiresIn: '1h' });

        res.cookie('token', token, { secure: true, maxAge: 3600000 });

        res.status(200).json({
            message: 'Giriş başarılı',
            role: user.role
        });
    } catch (err) {
        console.error('Hata:', err);
        res.status(500).json({ message: 'Bir hata oluştu' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış' });
        }

        const newUser = new User({ username, password, role });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'Kayıt başarılı' });
    } catch (err) {
        console.error('Register Hatası:', err);
        res.status(500).json({ message: 'Bir hata oluştu. Kayıt yapılamadı.' });
    }
});

router.get('/role', authenticateToken, async (req, res) => {
    res.status(200).json({ role: req.user.role });
});

module.exports = router;

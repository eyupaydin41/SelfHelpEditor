const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (token == null) return res.redirect('/auth');

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) return res.redirect('/auth');
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

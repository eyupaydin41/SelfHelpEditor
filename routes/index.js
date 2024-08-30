var express = require('express');
var router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/',authenticateToken, function(req, res, next) {
  res.render('index');
});

module.exports = router;

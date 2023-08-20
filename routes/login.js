var express = require('express');
var router = express.Router();

router.get('/kuy', function (req, res, next) {
    res.render('./user/food');
});

module.exports = router;
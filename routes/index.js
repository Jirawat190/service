var express = require('express');
var router = express.Router();

/* หน้าแรกที่ต้อง login */
router.get('/', function (req, res, next) {
  fall = ''
  res.render('./login/login', { loginfall: fall });
});

/*เช็ครหัสเข้า*/
router.post('/admin', function (req, res) {
  fall = ''
  let sum = req.body.username
  let pass = req.body.password
  admin = {
    user: 'admin',
    password: '123'
  }
  cashier = {
    user: 'cashier',
    password: '456'
  }
  middle = {
    user: 'middle',
    password: '789'
  }
  console.log(sum)
  console.log(pass)

  /*เช็คadmin*/
  if (sum == admin.user) {
    if (pass == admin.password) {
      res.redirect('/admin')
    }
    else (
      fall = "Password Incorrect!!!",
      res.render('./login/login', { loginfall: fall })
    )
  }

  /*เช็คcashier*/
  if (sum == cashier.user) {
    if (pass == cashier.password) {
      res.redirect('/cashier')

    }
    else (
      fall = "Password Incorrect!!!",
      res.render('./login/login', { loginfall: fall })

    )
  }

  /*เช็คmiddle account*/
  if (sum == middle.user) {
    if (pass == middle.password) {
      res.redirect('/middleaccount')
    }
    else (
      fall = "Password Incorrect!!!",
      res.render('./login/login', { loginfall: fall })
    )
  }
  else
    fall = 'User & Password Incorrect!!!',
      res.render('./login/login', { loginfall: fall })


});

/*ทางเข้าadmin*/
router.get('/admin', function (req, res, next) {
  res.render('./admin/index');
});

/*ทางเข้าcashier*/
router.get('/cashier', function (req, res, next) {
  res.render('./cashier/index');
});

/*ทางเข้าmiddle account*/
router.get('/middleaccount', function (req, res, next) {
  res.render('./middleaccount/index');
});

//ทางเข้าeditmanu
router.get('/editmanu', function (req, res){
  res.render('./admin/editmanu');
});

//ทางเข้าeditfood
router.get('/editfood', function (req, res){
  res.render('./admin/editfood');
});

//ทางเข้าfoodgroup
router.get('/foodgroup', function (req, res){
  res.render('./admin/foodgroup');
});

//ทางเข้าPromotion
router.get('/Promotion', function (req, res){
  res.render('./admin/promotion');
});

//ทางเข้าหน้าแรก
router.get('/index', function (req, res){
  res.render('./admin/index');
});

//ทางเข้าmanage
router.get('/manage', function (req, res){
  res.render('./admin/manage');
});

//ทางเข้าeditmanu
router.get('/total', function (req, res){
  res.render('./admin/total');
});

module.exports = router;

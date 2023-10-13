var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { connect, checkout } = require('../app');
const connection = require('../dbconnes');
const { name } = require('ejs');
router.use(express.json());
const Promotion = require('../models/Promotion');
const Menu = require('../models/Menu');
const Table = require('../models/Table');
const Typefood = require('../models/Typefood');
const { ReturnDocument } = require('mongodb');
const Option = require('../models/Option');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Random = require('../models/Random');



/* หน้าแรกโปรโมชั่นลูกค้า */
router.get('/promotion/:table/:random', async (req, res, next) => {
  let table = req.params.table;
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let menu = await Promotion.find().exec();
      console.log(menu);
      res.render('./user/promotion', { promotion: menu, table: table, ran: ran });
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }

});

/* หน้าของอาหาร */
router.get('/allmenu/:type/:table/:random', async (req, res, next) => {
  try {
    let type = req.params.type;
    let table = req.params.table;
    console.log(type, table);


    let random = req.params.random;
    let ran = await Random.find({ random: random }).exec();
    try {
      let dom = ran[0];
      console.log(dom.random);
      if (random == dom.random) {
        const menus = await Menu.find({ typefood: type }).exec();

        // Check the status property of each menu item
        const filteredMenus = menus.filter(menu => menu.status === true);

        if (filteredMenus.length > 0) {
          console.log(filteredMenus);
          res.render('./user/allmenu', { menus: filteredMenus, table: table, type: type , ran:ran });
        }
      } else {
        res.render('./user/thank');
      }
    }
    catch (error) {
      console.error(error);
      // Redirect or send an error response as needed
      res.render('./user/thank');
    }

  } catch (error) {
    // Handle any errors that occur during database query or rendering
    console.error(error);
    // Redirect or send an error response as needed
    res.status(500).send('Internal Server Error');
  }
});


//รายละเอียด
router.get('/detail/:id/:table/:random', async (req, res, next) => {
  let menu = req.params.id
  let table = req.params.table
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let options = '';
      let detail = await Menu.findOne({ _id: menu }).exec();
      let option = await Menu.findOne({ _id: menu }).distinct('option').exec();
      console.log(detail);
      console.log(option);
      if (option == '') {

      } else {
        options = await Option.find({ _id: { $in: option } }).exec()
        console.log(options);
      }
      res.render('./user/detail', { detail: detail, option: options, table: table , ran:ran });
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }
});

//รายละเอียดโปรโมชั่น
router.get('/detailpro/:id/:table/:random', async (req, res, next) => {
  let promotion = req.params.id
  let table = req.params.table
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let pro = await Promotion.findOne({ _id: promotion }).exec();
      res.render('./user/detailpro', { pro: pro, table: table, ran:ran });
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }
});

//ส่งผลการค้นหา
router.post('/gettextsearch/:table/:random', async (req, res) => {
  let keysearch = await req.body.keysearch
  let table = req.params.table
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let saerch_result = await Menu.find({ name: { $regex: new RegExp('^' + keysearch + ',*', 'i') } }).exec();
  console.log(keysearch)
  res.render('./user/search', { menus: saerch_result, table: table ,ran:ran })
  console.log(saerch_result)
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }
  
})

//แสดงรายการที่ตรงกัน
router.post('/getResult', async (req, res) => {
  let payload = req.body.payload.trim()
  if (payload == '') {
    payload = '---'
  }
  if (payload == '[') {
    payload = '---'
  }
  if (payload == '[]') {
    payload = '---'
  }
  let search = await Menu.find({ name: { $regex: new RegExp('^' + payload + ',*', 'i') } }).exec()
  //let search = await Scholarship.find({sname: {$regex: new RegExp('^'+payload+',*','i')}}).exec()
  search = search.slice(0, 10);
  res.send({ payload: search });
  // console.log(payload)
})

//access 
// 'u' = ลูกค้า
// 't' = โต๊ะ
// 'a' = แอดมิน


//เอาข้อมูลเข้าDBcart
router.post('/addmenutocart', async (req, res) => {
  let orders = req.body;
  console.log(orders);
  try {
    const newCart = new Cart(orders);
    console.log(newCart);
    Cart.saveCart(newCart); // Save the cart to the database
    res.status(200).json({ message: 'Menu added to cart and saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* หน้าของตะกร้า */
router.get('/cart/:table/:random', async (req, res, next) => {
  let table = req.params.table;
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let cart = await Cart.find({ tableid: table }).exec()
      res.render('./user/cart', { table: table, cart: cart, ran:ran });
      console.log(cart);
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }
});

/* หน้าของประวัติ */
router.get('/history/:table/:random', async (req, res, next) => {
  let table = req.params.table;
  let random = req.params.random;
  let ran = await Random.find({ random: random }).exec();
  try {
    let dom = ran[0];
    console.log(dom.random);

    if (random == dom.random) {
      let history = await Table.find({ tableid: table }).exec()
      res.render('./user/history', { table: table, history: history,ran:ran });
    } else {
      res.render('./user/thank');
    }
  }
  catch (error) {
    console.error(error);
    // Redirect or send an error response as needed
    res.render('./user/thank');
  }
});

//ลบอาหารในตะกร้า
router.get('/deletemenucart/:id/:table', (req, res) => {
  let table = req.params.table;
  Cart.findByIdAndDelete(req.params.id).exec();
  res.status(200).json({ msg: "Success" });
});

//กดสั่ง
router.post('/addtotable/:table', async (req, res) => {
  let table = req.params.table;
  let orders = req.body;
  console.log(table);
  
      try {
        let cart = await Cart.find({ tableid: table }).exec();
        console.log(cart);
        await Table.updateOne({ tableid: table }, { $push: { order: cart } }).exec();
        await Cart.deleteMany({ tableid: table }).exec();
        res.status(200).json({ message: 'Menu added to cart and saved successfully' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});


router.get('/optiondata/:id', async (req, res) => {
  let id = req.params.id
  let option = await Option.findOne({ _id: id }).exec();
  console.log(option);
  res.send(option)
})

module.exports = router;
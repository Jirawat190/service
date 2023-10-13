var express = require('express');
var router = express.Router();
const { connect, checkout, path } = require('../app');
const { name } = require('ejs');
router.use(express.json());
const bcrypt = require("bcrypt")
const saltRounds = 10
const Admin = require('../models/Admin');
const Cashier = require('../models/Cashier');
const Middle = require('../models/Middle');
const Menu = require('../models/Menu');
const Typefood = require('../models/Typefood');
const multer = require('multer');
const Option = require('../models/Option');
const Table = require('../models/Table');
const Order = require('../models/Order');
const GenQR = require('../public/javascripts/genqrcode')

/* หน้าแรกพนักงาน */
router.get('/index', async(req, res, next) => {
    const tableid = await Table.find().exec();
    res.render('./employee/index', {tables: tableid});
});

router.get('/employeedetail/:tableid', async(req, res, next) =>{
    let id = req.params.tableid
    let table = await Table.find({ tableid: id }).exec();
    res.render('./employee/employeedetail', { tabledetail: table });
});

//ลบโต๊ะอาหาร
router.get('/deletemenu/:id/:tableid', async (req, res) => {
    let id = req.params.id
    let table = req.params.tableid
    console.log(id);
    console.log(table);
    await Table.findOneAndUpdate(
        { tableid: table }, // Match the document with the specific tableid
        { $pull: { order: { _id: id } } }, // Remove the item with matching _id from the order array
        { new: true } // To get the updated document as the result
      );
    const url = "/employee/employeedetail/"+table;
    res.redirect(url);
});
module.exports = router;
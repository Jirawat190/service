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
const Order = require('../models/Order');
const Table = require('../models/Table');
const GenQR = require('../public/javascripts/genqrcode');

/* หน้าแรกบัญชีกลาง */
router.get('/index', async (req, res, next) => {
    const tableid = await Table.find().exec();
    res.render('./middleaccount/index', { tables: tableid });
});

router.get('/showtable', async (req, res, next) => {
    const tableid = await Table.find({ statustable: true }).exec();
    res.render('./middleaccount/showtable', { tables: tableid });
});

router.get('/middletdetail/:tableid', async (req, res, next) => {
    let id = req.params.tableid
    let table = await Table.find({ tableid: id }).exec();
    res.render('./middleaccount/middledetail', { tabledetail: table });
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
    const url = "/middle/middletdetail/" + table;
    res.redirect(url);
});

router.get('/receipt/:tableid', async (req, res) => {
    let table = req.params.tableid
    console.log(table);
    let menu = await Table.find({ tableid: table }).exec();
    res.render('./middleaccount/receipt', { menu: menu }); // Check this path
});


router.get('/gen/:tableid', async (req, res) => {
    let table = req.params.tableid
    let qr = await Table.findOne({ tableid: table }).exec();
    console.log(qr);
    
    res.render('./middleaccount/qrreceipt', { qr: qr }); // Check this path
});

router.post('/status/:table', async (req, res) => {
    let table = req.params.table
    console.log(table);
    let sta = req.body.value
    console.log(sta);
    let status = sta;
    await Table.updateOne({ tableid: table }, { $set: { statustable: status } }).exec();
    res.status(200).json({ message: 'status successfully' });
});



module.exports = router;
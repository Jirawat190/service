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
const Order = require('../models/Order');
const Typefood = require('../models/Typefood');
const multer = require('multer');
const Option = require('../models/Option');
const Table = require('../models/Table');
const Random = require('../models/Random');

/* หน้าแรกบัญชีกลาง */
router.get('/index', async (req, res, next) => {
    const tableid = await Table.find().exec();
    res.render('./cashier/index', { tables: tableid });
});

router.get('/cashierdetail/:tableid', async (req, res, next) => {
    let id = req.params.tableid
    let table = await Table.find({ tableid: id }).exec();
    res.render('./cashier/cashierdetail', { table: table });
});

//กดชำระเงิน
router.post('/addtoorder/:tableid', async (req, res, next) => {
    let table = req.params.tableid;
    let data = req.body;
    let menu = await Table.findOne({ tableid: table }).exec();

    try {
        Random.deleteMany({tableid:table}).exec();
        let qrcode = '';
        let status = false;
        await Table.updateOne({ tableid: table }, { $set: { statustable: status, qrcode: qrcode } }).exec();
        console.log(table);
        console.log('อาหาร >', menu);
        console.log('ราคารวม >', data.sum);
        console.log('รับเงิน >', data.getmoney);
        console.log('เงินทอน >', data.changemoney);
        console.log('week > ', data.week)
        console.log('day >', data.day);
        console.log('month >', data.month);
        console.log('year >', data.year);
        console.log('hours >', data.hours);
        console.log('minutes >', data.minutes);
        console.log('seconds >', data.seconds);

        const menusum = [menu.order]; // Assuming 'data.menu' is an array
        console.log('แยกแล้ว >', menusum);
        let datasum = new Order({
            tableid: table,
            order: menusum, // Assign 'menusum' to the 'order' field
            orderamount: data.sum,
            getmoney: data.getmoney,
            changemoney: data.changemoney,
            week: data.week,
            day: data.day,
            month: data.month,
            year: data.year,
            hours: data.hours,
            minutes: data.minutes,
            seconds: data.seconds,
        });
        console.log('data >', datasum);

        // Save the 'Order' instance to the database
        await datasum.save();
        await Table.updateMany({ tableid: table }, { $pull: { order: {} } }).exec();

        res.status(200).json({ message: 'Menu added to cart and saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/receipt/:tableid', async (req, res) => {
    let table = req.params.tableid
    console.log(table);
    let menu = await Table.find({ tableid: table }).exec();
    res.render('./cashier/receipt', { menu: menu }); // Check this path
});


module.exports = router;
var express = require('express');
const Swal = require('sweetalert2');
var router = express.Router();
const { connect, checkout, path } = require('../app');
const { name } = require('ejs');
router.use(express.json());
const bcrypt = require("bcrypt")
const saltRounds = 10
const Admin = require('../models/Admin');
const Cashier = require('../models/Cashier');
const Middle = require('../models/Middle');
const Employee = require('../models/Employee')
const Menu = require('../models/Menu');
const Typefood = require('../models/Typefood');
const multer = require('multer');
const Order = require('../models/Order');
const Option = require('../models/Option');
const Table = require('../models/Table');
const Promotion = require('../models/Promotion');
const GenQR = require('../public/javascripts/genqrcode');
const Cart = require('../models/Cart');
const generateQRCode = require('../public/javascripts/genqrcode');

//อัพโหลดรูปภาพ
var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: Storage
}).single('file');


/* หน้าแรกที่ต้อง login */
router.get('/', function (req, res, next) {
  fall = '' //สถานะการล็อคอิน รหัสผิด ไม่พบบัญชี
  res.render('./login/login', { status: fall });
});

/*เช็ครหัสเข้า*/
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let fall = '';
  console.log(username);
  console.log(password);

  // Check for Admin login
  let admin = await Admin.findOne({ username: username }).exec();
  if (admin) {
    if (admin.prassword === password) {
      console.log(username);
      console.log(password);
      return res.render('./admin/index');
    } else {
      // Incorrect Admin password
      fall = "รหัสผ่านไม่ถูกต้อง";
      return res.render('./login/login', { status: fall });
    }
  }

  // Check for Cashier login
  let cashier = await Cashier.findOne({ username: username }).exec();
  if (cashier) {
    if (cashier.prassword === password) {
      console.log(username);
      console.log(password);
      // Correct Cashier password, redirect to Cashier dashboard
      return res.redirect('./cashier/index');
    } else {
      // Incorrect Cashier password
      fall = "รหัสผ่านไม่ถูกต้อง";
      return res.render('./login/login', { status: fall });
    }
  }

  // Check for middle login
  let middle = await Middle.findOne({ username: username }).exec();
  let employee = await Employee.findOne({ username: username }).exec();
  console.log(middle);
  if (middle) {
    if (middle.prassword === password ) {
      console.log(username);
      console.log(password);
      // Correct middle password, redirect to middle dashboard
      return res.redirect('./middle/index');
    } else {
      // Incorrect middle password
      fall = "รหัสผ่านไม่ถูกต้อง";
      return res.render('./login/login', { status: fall });
    }
  }

  // Check for employee login
  console.log(employee);
  if (employee) {
    if (employee.prassword === password) {
      console.log(username);
      console.log(password);
      // Correct middle password, redirect to middle dashboard
      return res.redirect('./employee/index');
    } else {
      // Incorrect middle password
      fall = "รหัสผ่านไม่ถูกต้อง";
      return res.render('./login/login', { status: fall });
    }
  }

  // If no matching user found
  fall = "ไม่พบบัญชี";
  return res.render('./login/login', { status: fall });
});


//ทางเข้าmanage
router.get('/manage', async (req, res) => {
  try {
    const cashiersPromise = Cashier.find().exec();
    const middlesPromise = Middle.find().exec();
    const employeesPromise = Employee.find().exec();

    const [cashiers, middles, employees] = await Promise.all([
      cashiersPromise,
      middlesPromise,
      employeesPromise,
    ]);

    const allManagers = [...cashiers, ...middles, ...employees];

    console.log(allManagers);

    res.render('./admin/manage', { allManagers: allManagers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching data');
  }
});



//เพิ่มข้อมูลพนักงาน
router.post('/addmanager', upload, async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const img = req.file.filename;
  const work = req.body.work;
  const username = req.body.username;
  const prassword = req.body.prassword;

  let managerType;

  if (work === 'cashier') {
    managerType = 'cashier';
  } else if (work === 'middle') {
    managerType = 'middle';
  } else {
    managerType = 'employee';
  }

  let managerData;

  if (managerType === 'cashier') {
    console.log('pass cashier');
    managerData = new Cashier({
      firstname,
      lastname,
      img,
      username,
      prassword,
      work,
      // Add other specific fields for Cashier here
    });
    Cashier.saveCashier(managerData);
    res.redirect('/manage');

  } else if (managerType === 'middle') {
    console.log('pass Middle');
    managerData = new Middle({
      firstname,
      lastname,
      img,
      username,
      prassword,
      work,
      // Add other specific fields for Middle here
    });
    Middle.saveMiddle(managerData);
    res.redirect('/manage');

  } else {
    console.log('pass employee');
    managerData = new Employee({
      firstname,
      lastname,
      img,
      username,
      prassword,
      work,
      // Add other specific fields for Employee here
    });
    Employee.saveEmployee(managerData);
    res.redirect('/manage');
  }

  try {
  } catch (error) {
    // Handle any errors here
    console.error(error);
    res.status(500).send('Error occurred while adding the manager');
  }
});

//ลบเมนู
router.get('/deletemanage/:work/:id', async (req, res) => {
  try {
    const work = req.params.work;
    const id = req.params.id;


    // Determine the schema based on the provided schemaName
    if (work === 'cashier') {
      await Cashier.findByIdAndDelete(id).exec();
      res.redirect('/manage');
    } else if (work === 'middle') {
      await Middle.findByIdAndDelete(id).exec();
      res.redirect('/manage');
    } else if (work === 'employee') {
      await Employee.findByIdAndDelete(id).exec();
      res.redirect('/manage');
    } else {
      return res.status(404).send('Schema not found');
    }


  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while deleting data');
  }
});


//ทางเข้าeditmanu
router.get('/editmanu', async (req, res) => {
  let menu = await Menu.find().exec()
  let type = await Typefood.distinct('typefood').exec()
  let option = await Option.find().exec()
  //console.log(menu)
  res.render('./admin/editmanu', { menus: menu, type: type, option: option });
});

//เพิ่มเมนู
router.post('/insertmenu', upload, async (req, res) => {
  let data = new Menu({
    name: req.body.menuname,
    price: req.body.menuprice,
    typefood: req.body.typemenu,
    img: req.file.filename,
    option: req.body.option
  })
  Menu.saveMenu(data);
  res.redirect('/editmanu');
});

//ลบเมนู
router.get('/deletemenu/:id', (req, res) => {
  Menu.findByIdAndDelete(req.params.id).exec();
  res.redirect('/editmanu');
});

//สถานะอาหาร
router.post('/updatestatus', async (req, res) => {
  let status = req.body
  console.log(status.isChecked);
  console.log(status.id);
  try {
    // ค้นหาข้อมูลเมนูด้วย _id
    let menu = await Menu.findOne({ _id: status.id }).exec();
    
    if (!menu) {
      return res.status(404).json({ message: 'ไม่พบเมนูที่ต้องการอัปเดต' });
    }

    console.log(menu);
    // อัปเดตสถานะของเมนู
    menu.status = status.isChecked;

    // บันทึกการอัปเดต
    await menu.save();

    res.status(200).json({ message: 'อัปเดตสถานะเรียบร้อย' });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
});

router.get('/getstatus',async (req, res) => {
  let menu = await Menu.find().exec()
  res.json(menu);
});

//หน้าแก้ไขอาหาร
router.get('/foodedit/:id', async (req, res) => {
  let Foodmanu = req.params.id
  let edit = await Menu.findOne({ _id: Foodmanu }).exec()
  let typefood = await Typefood.distinct('typefood').exec()
  let option = await Option.find().exec()
  console.log(edit.img);
  res.render('./admin/foodedit', { edit: edit, typefood: typefood, option: option });
});

// แก้ไขเมนู
router.post('/editmenu', upload, async (req, res) => {
  const id = req.body.editid
  const menu = req.body.editname
  const type = req.body.typefood
  const price = req.body.editprice
  const opt = req.body.option
  const image = req.body.image

  let imge;  // Declare the imge variable

  if (req.file && req.file.filename) {
    imge = req.file.filename; // Assign the filename if it exists
  } else {
    imge = image; // Assign a default value if req.file or filename is undefined
  }

  let data = {
    name: menu,
    price: price,
    typefood: type,
    img: imge,
    option: opt
  }
  console.log(data);
  console.log(id);
  Menu.findByIdAndUpdate(id, data).exec();
  res.redirect('/editmanu');
})

//ทางเข้าPromotion
router.get('/Promotion', async (req, res) => {
  let pro = await Promotion.find().exec();
  res.render('./admin/promotion', { promotion: pro });
});

//ทางเข้าหน้าเพิ่มโปรโมชั่น
router.get('/addpromotion', async (req, res, next) => {
  let menu = await Menu.distinct('name').exec();
  let type = await Typefood.distinct('typefood').exec()
  res.render('./admin/addpromotion', { type: type, menu: menu });
});

//เพิ่มPromotion
router.post('/addmenupro', upload, async (req, res) => {
  let data = new Promotion({
    name: req.body.proname,
    price: req.body.proprice,
    typefood: req.body.typepro,
    img: req.file.filename,
    menu: {
      category1: req.body.categorymenu1,
      category2: req.body.categorymenu2,
      category3: req.body.categorymenu3,
      category4: req.body.categorymenu4,
    },
  })
  Promotion.savePromotion(data);
  res.redirect('/Promotion');
});

// แก้ไขโปรโมชั่น
router.post('/editmenu', upload, async (req, res) => {
  const id = req.body.editid
  const menu = req.body.editname
  const type = req.body.typefood
  const price = req.body.editprice
  const opt = req.body.option
  const image = req.body.image

  let imge;  // Declare the imge variable

  if (req.file && req.file.filename) {
    imge = req.file.filename; // Assign the filename if it exists
  } else {
    imge = image; // Assign a default value if req.file or filename is undefined
  }

  let data = {
    name: menu,
    price: price,
    typefood: type,
    img: imge,
    option: opt
  }
  console.log(data);
  console.log(id);
  Menu.findByIdAndUpdate(id, data).exec();
  res.redirect('/editmanu');
})

//ลบPromotion
router.get('/deletepromotion/:id', (req, res) => {
  Promotion.findByIdAndDelete(req.params.id).exec();
  res.redirect('/Promotion');
});

//ทางเข้าedittable
router.get('/edittable', async (req, res) => {
  const table = await Table.find().exec();
  res.render('./admin/edittable', { table: table });
});

//เพิ่มโต๊ะอาหาร
router.post('/inserttable', upload, async (req, res) => {
  let newtable = await req.body.Tableid
  let seat = await req.body.seat
  //qrcode = GenQR('https://88a9-2403-6200-88a4-d2-1f5-349d-62f0-ddec.ngrok-free.app/customer/promotion/' + newtable,'public/uploads/table'+newtable+'.png', newtable);
  let data = new Table({
    tableid: newtable,
    seat:seat,
    qrcode: generateQRCode('https://85f9-2403-6200-88a2-aa85-5cb1-d321-58ac-d2a0.ngrok-free.app /customer/promotion/' + newtable,'public/uploads/table'+newtable+'.jpg', newtable)
  })
  Table.saveTable(data);
  res.redirect('/edittable');
});


//ลบโต๊ะอาหาร
router.get('/deletetable/:id', async (req, res) => {
  Table.findByIdAndDelete(req.params.id).exec();
  res.redirect('/edittable');
});

// ดุรายละเอียดโต๊ะ
router.get('/gettable/:id', async (req, res) => {
  const table = req.params.id
  const tabledata = await Table.find({ _id: table }).exec()
  res.render('./admin/tabledata', { tabledata: tabledata , table:table})
})

//ทางเข้าfoodgroup หมวดหมู่
router.get('/foodgroup', async (req, res) => {
  let type = await Typefood.find().exec()
  res.render('./admin/foodgroup', { typefoods: type });
});

//ลบหมวดหมู่
router.get('/deletetype/:id', (req, res) => {
  Typefood.findByIdAndDelete(req.params.id).exec();
  res.redirect('/foodgroup');
});

//เพิ่มหมวดหมู่
router.post('/edittypefood', async (req, res) => {
  const type = await req.body.Typefood
  console.log(type);
  let data = new Typefood({
    typefood: type,
  })
  console.log(data);
  Typefood.saveTypefood(data);
  res.redirect('/foodgroup');
})


//ทางเข้าหน้าแรก
router.get('/index', function (req, res) {
  res.render('./admin/index');
});

//หน้ารายละเอียดอาหาร
router.get('/detailmenu/:id', async (req, res) => {
  let menud = req.params.id
  let detail = await Menu.findOne({ _id: menud }).exec()
  res.render('./admin/detailmenu', { detail: detail });
})

//หน้าเมนูเสริม
router.get('/option', async (req, res) => {
  let option = await Option.find().exec()
  res.render('./admin/option', { option: option });
})

//ลบเมนูเสริม
router.get('/deleteoption/:id', (req, res) => {
  Option.findByIdAndDelete(req.params.id).exec();
  res.redirect('/option');
})

//เพิ่มเมนูเสริม
router.post('/editoption', async (req, res) => {
  let optionname = await req.body.name
  let optionprice = await req.body.price
  console.log(optionname, optionprice);
  let data = new Option({
    name: optionname,
    price: optionprice
  })
  console.log(data);
  Option.saveOption(data);
  res.redirect('/option');
})

//ทางเข้ายอดขาย
router.get('/total', async (req, res) => {
  let order = await Order.find().exec()
  // สร้างอ็อบเจ็กต์ Date ปัจจุบัน
  var currentDate = new Date();

  // แสดงวันที่และเวลาปัจจุบัน
  console.log(currentDate);

  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayOfWeek = daysOfWeek[currentDate.getDay()];

  // แสดงวันที่แยกออกมา
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1; // เดือนจะเริ่มที่ 0 เพราะฉะนั้นต้องบวก 1
  var year = currentDate.getFullYear();

  console.log(`week: ${dayOfWeek},วันที่: ${day}, เดือน: ${month}, ปี: ${year}`);

  // แสดงเวลาแยกออกมา
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();

  console.log(`เวลา: ${hours}:${minutes}:${seconds}`);

  var datetimeString = `${dayOfWeek} : ${day}/${month}/${year}`;
  
  res.render('./admin/total',{ day:day , order:order});
});

//ดึงข้อมูลไปแสดงกราฟ
router.get('/sales', async (req, res) => {
  try {
    let order = await Order.find({},'week day month year orderamount' ).exec();
    const data = order.map(order => {
      const { week, day, month, year, orderamount } = order;
      return { week, day, month, year, orderamount };
    });

    console.log(data);
    res.status(200).json({ data});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

var createError = require('http-errors');
var path = require('path');
var http  = require('http');
var express = require('express');
var socketio = require('socket.io');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require("bcrypt")
const saltRounds = 10
const mongoose = require('mongoose');

var loginRouter = require('./routes/login');
var cashierRouter = require('./routes/cashier');
var customerRouter = require('./routes/customer');
var middleRouter = require('./routes/middle');
var employeeRouter = require('./routes/employee');

const { Console } = require('console');

// เชื่อมต่อ DB
const mongoUrl = "mongodb+srv://Admin1:987654321@cluster0.qnzuncc.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoFood connection successfuly'))
  .catch((err) => console.error(err))

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/', express.static('./public'));

app.use('/', loginRouter);
app.use('/customer', customerRouter);
app.use('/middle', middleRouter);
app.use('/cashier', cashierRouter);
app.use('/employee', employeeRouter);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user notifications
  socket.on('user-notification', (message) => {
    // Send the notification to the specified user
    io.to(message.userId).emit('user-notification', message);
  });

  // Handle admin notifications
  socket.on('admin-notification', (message) => {
    console.log(message);
    // Broadcast the notification to all connected admin clients
    socket.broadcast.emit('admin-notification', message);
  });
  
  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

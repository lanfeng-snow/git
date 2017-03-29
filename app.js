//加载 各种模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//加载users路由
var users = require('./routes/users');
var app = express();
//创建数据库链接
mongoose.connect('mongodb://localhost/star');
//数据库开启
mongoose.connection.on('open', function () {
    console.log('-----------数据库连接成功！------------');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set( 'view engine', 'html');
app.engine( '.html', require( 'ejs').__express );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session设置
app.use(session({
    secret: "what do you want to do?", //secret的值建议使用128个随机字符串
    cookie: {maxAge: 60 * 1000 * 60 * 24 * 14}, //过期时间
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection //使用已有的数据库连接
    })
}));
//启动users传入app
users(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

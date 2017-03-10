/* COMP308 - Emerging Technology Assignment One
 * File: app.js
 * Student: Ali Saim (300759480)
 * Date Created: Feb 5th 2017
 * Date Last Modified: Feb 10th 2017
 * Description: app.js is a class used to connect to the server
 * Revision History:
 *  Feb 05, 2017:
 * 					Created app.js
 * Feb 10, 2017
 *          Added internal documentation
 */

let express = require('express');
let path = require('path'); // part of node.js core
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

//adding the mongoose module
let mongoose = require('mongoose');
//connect to mongoDB and use the contacts database

//import the config module
let config = require('./config/db');


//connect to the Mongo db using the URI above
mongoose.connect(process.env.URI || config.URI);

//create a db object and make a reference the connection
let db = mongoose.connection;

//listen for a successful connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB...");
});


let index = require('./routes/index');
let contacts = require('./routes/contacts');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

//route redirects
app.use('/', index);
app.use('/contacts', contacts);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

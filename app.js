var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

var app = express();

// library for handling file uploads
var multer = require('multer');
var uploader = multer({dest: './uploads/'});

// csv parsing
var fs = require("fs");
var d3 = require("d3-dsv");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Actions

/* GET main page */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'CSV File Handler' });
});

/**
 * file upload handler
 */
app.post('/', uploader.single('csv_upload'), function(req, res){
  // upload was successful. time for some file wrangling
  var file = req.file;

  fs.readFile(file.path, "utf8", function(err, raw){
    // if we cant parse the file, for the short deadline lets just jankily show it to the user
    if (err) {
      throw new Error(err);
    }

    // grab each row and column, delimated by , and carriage return
    var rows = d3.csv.parseRows(raw);

    // render the parsed csv on the front end for now
    res.render('csv', {rows: rows});
  });

  //res.status(200).render(file.path).end();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// lets listen on port 8000 so there are no conflicts
app.listen(8000);

module.exports = app;

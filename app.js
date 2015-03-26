var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/weddingdb');
var dbModels={};
dbModels.dbModelMusicRequests = mongoose.model('MusicRequest',{
    artistName: String,
    songName: String,
    requestDate: String,
    requestIp:String
});

dbModels.dbModelDateRequests = mongoose.model('DateRequest',{
    requesterName: String,
    requesterMsg: String,
    requestDate: String,
    requestIp:String
});

dbModels.dbModelSeatingArrangement = mongoose.model('SeatingArrangement',{
    SANumber: String,
    SAName: String
});


dbModels.dbModelPollQuestions = mongoose.model('PollQuestions',{
    imgSrc: String,
    Q: String,
    A1: String,
    A2: String,
    A3: String,
    A4: String,
    A5: String
});

dbModels.dbModelPollResults = mongoose.model('PollResults',{
    QID: mongoose.Schema.ObjectId,
    A: String,
    resultDate: String,
    requestIp:String
});


var routes = require('./routes/index');
var users = require('./routes/users');
var weddingAPI = require('./routes/weddingAPI'); //returns functions that returns route

var app = express();
//enable for production
//app.set('env', 'prod');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/assets/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/', weddingAPI(mongoose,dbModels));

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


module.exports = app;

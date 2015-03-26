var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.sendfile('./public/index.html')
});


/* GET home page. */
router.get('/findmyseat', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.sendfile('./public/findmyseat.html')
});

module.exports = router;

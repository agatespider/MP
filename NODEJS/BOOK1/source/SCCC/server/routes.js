/**
 * Created by Administrator on 2017/04/15.
 */

var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    bbsSimple = require('../controllers/bbs/simple');

module.exports = function(app) {
    router.get('/', home.index);
    router.get('/bbs/simple', bbsSimple.index);

    app.use(router);
}
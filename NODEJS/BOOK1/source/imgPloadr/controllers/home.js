/**
 * Created by Administrator on 2017/04/15.
 */

config = require('./server/configure'),

module.exports = {
    index: function(req, res) {
        res.render('index');
    }
};
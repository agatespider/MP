/**
 * Created by Administrator on 2017/04/15.
 */
var movie = require('../data/movie.json');

module.exports = {
    index: function(req, res, next) {
        res.render('index', {
            data: {
                movies: movie
            },
            vue: {
                head: {
                    title: 'vue + mongo + node example',
                    head: [
                        { property:'og:title', content: 'vue + mongo + node example'},
                        { name:'twitter:title', content: 'vue + mongo + node example'}
                    ]
                }
            }
        });
    }
};
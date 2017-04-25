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
                    title: 'Page Title',
                    head: [
                        { property:'og:title', content: 'Page Title'},
                        { name:'twitter:title', content: 'Page Title'},
                    ]
                }
            }
        });
        //res.send(movie);
    }
};
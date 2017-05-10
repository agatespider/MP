/**
 * Created by Administrator on 2017/04/15.
 */
var movie = require('../../data/movie.json');

module.exports = {
    index: function(req, res, next) {
        res.render('bbs/simple', {
            data: {
                movies: movie
            },
            vue: {
                head: {
                    title: 'bbs simple example',
                    head: [
                        { property:'og:title', content: 'bbs simple example'},
                        { name:'twitter:title', content: 'bbs simple example'}
                    ]
                }
            }
        });
    }
};
/**
 * Created by Administrator on 2017/04/15.
 */

module.exports = {
    index: function(req, res, next) {
        /*res.render('index', {
            data: {
                otherData: 'Something Else'
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
        });*/
        res.render('index');
    }
};
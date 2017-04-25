/**
 * Created by hycho on 2017/04/24.
 */

var express = require('express'),
    config = require('./server/configure'),
    app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('components', __dirname + '/components');
app.set('data', __dirname + '/data');

app = config(app);

app.listen(app.get('port'), function() {
   console.log('Server up: http://localhost:' + app.get('port'));
});

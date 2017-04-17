/**
 * Created by Administrator on 2017/04/13.
 * morgan : 로깅을 담당하는 모듈
 * bodyParser : 요청데이터를 Parsing해주는 역할인거 같은데..
 * methodOverride : UPDATE나 PUT같은 HTTP 메소드를 지원하지 않는 구형 브라우저들을 위해 숨겨진 input 필드를 사용해서 그런 요청을 흉내내도록 도와준다.
 * cookieParser : 쿠키를 보내고 받을 수 있게 해준다.
 * errorHandler : 미들웨어 프로세스중에 발생하는 에러를 처리 할 수 있게 해준다. ErrorHandler를 작성해서 404HTML 페이지를 반환하거나 데이터 저장소에 에러는 남기는 작업들을 할 수 있다.
 * Handlebars : 뷰를 위해 사용할 템플릿 엔진
 * routes(app) : 서버에서 router를 사용가능하게 하며 GET, POST, PUT, UPDATE 같은 요청에 대해 응답하게 해준다.
 * express.static : 정적자원을 제공할때 제공 (정적자원은 app.router() 다음에 정의해야 한다. 그래야 정적자원들이 부주의로 인해 사용자 정의 경로보다 우선순위가 높아지는 상황을 방지 할 수 있다.)
 */

var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler')
    moment = require('moment');

module.exports = function(app) {
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));

    // 핸들바 등록, layout과 view관리
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layout',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function(timestamp) {
                console.log(timestamp);
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);

    app.set('view engine', 'handlebars');

    routes(app);
    app.use('/public/', express.static(path.join(__dirname, '../public')));

    if('development' === app.get('env')) {
        app.use(errorHandler());
    }

    return app;
}
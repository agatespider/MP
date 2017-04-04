/**
 * Created by Administrator on 2017/04/03.
 * 엽기적인 KJTT(Korean Javascript Test Tool) 시작합니다.
 *
 * 만든이 HYCHO
 */

//kjtt

var getKjttModule = (function(kjttGlobal){
    var kjttRequireModule,
        kjttGlobal = window;

    kjttRequireModule = kjttGlobal.kjttRequiredModule = {};

    function getKjttRequireModule(){
        return kjttRequireModule;
    }

    getKjttRequireModule().core = function(requiredModule){
        var kjtt$ = {};
        kjtt$.renderHtml = requiredModule.renderHtml();
        kjtt$.env = requiredModule.env(kjtt$);

        return kjtt$;
    }

    return getKjttRequireModule;
})(this);

getKjttModule().renderHtml = function(){
    function render() {

    }

    return render;
};

// 환경
getKjttModule().env = function(kjtt$){
    function Env() {
        var self = this;

        self.testObj = [];
        self.resultObj = [];
        self.currentTestObj = {};

        self.테스트 = function(description, func) {
            var test = {
                desc: description,
                func: func
            }

            self.testObj.push(test);

        };

        self.같아 = function(source, target) {
            if(source !== target) {
                throw new Error('같아');

            }
        };

        self.틀려 = function(source, target ){

        };



        self.execute = function() {
            for(var i = 0; i < self.testObj.length; i++) {
                var testEC = {
                    good: "Test"
                };
                try{
                    testObj[i].func();
                    resultObj.push({desc: testObj[i], result: true});
                } catch(e){
                    resultObj.push({desc: testObj[i], result: false});
                    console.log(e);
                }
            }

            console.log(resultObj);
        }

    }

    return Env;
};


/////////////////////////////// 실행영역

(function() {
    console.log(kjttRequiredModule);
    window.kjtt = kjttRequiredModule.core(kjttRequiredModule);
    kjtt.renderHtml();
    extend(window, new kjtt.env());

    function sum(a, b){
        return a + b;
    }

    // 실행 코드 - start
    테스트('sum 함수를 테스트 할꺼야', function(){
        var v1 = 1,
            v2 = 2,
            v3 = sum(v1, v2);

        같아(v3, 3);
        같아(1,1);
        같아(2,2);
    })
    // 실행 코드 - end

    execute();

    function extend(destination, source){
        for (var property in source) destination[property] = source[property];
        return destination;
    }
}());

function extend(destination, source){
    for (var property in source) destination[property] = source[property];
    return destination;
}
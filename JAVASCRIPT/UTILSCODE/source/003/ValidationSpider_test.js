/**
 * Created by hycho on 2017-04-28.
 * 특정 인자를 받아서 정규식이나 특정 필터나 조건에 따라서 원하는 이벤트가 발생을 할 수 있도록 하는 모듈
 */


var ValidationSpider = ValidationSpider || {};

// element를 받아서... 무언가 처리 하려 한다.
ValidationSpider.spider = function(element, type) {
    var element = spider,
        type = type;

    return {
        d
    }
};

// jquery 형태의 Element를 처리하는 핸들러
ValidationSpider.jqueryBehivior = function(element) {

};


function validate(e) {
    e = e || window.event;
    var bad = /[^\sa-z\d]/i,
        key = String.fromCharCode( e.keyCode || e.which );

    if ( e.which !== 0 && e.charCode !== 0 && bad.test(key) ) {
        e.returnValue = false;
        if ( e.preventDefault ) {
            e.preventDefault();
        }
    }
}

<input type="text" onkeypress="validate(event)" />
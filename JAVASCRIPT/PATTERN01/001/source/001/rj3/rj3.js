/**
 * line의 역할은 인자로 받은 array값을 아래와 같은 svg path의 형태로 만들어주는 역할을 한다.
 * M10,130L100,60L190,160L280,10
 *
 * -- HINT --
 * javascript의 클로저와 javascript는 함수를 인자로 주고 받을 수 있다는 것을 알아야 한다.
 */

// 1. 다른 전역 변수와 충돌을 피하기 위해서 별도 namespace를 생성
var rj3 = {};

// 2. svg 기능을 담당하는 모듈을 뜻하기 위해서 rj3안에 svg라는 namespace를 생성한다.
rj3.svg = {};

// 3. svg의 라인을 위한 뜻으로써 rj3.svg안에 line이라는 namespace를 생성한다.
rj3.svg.line = function() {

    // 6. getX와 getY, interpolate는 반환될 line에서 참조할 함수 객체이며 외부로 빼놓은 이유는 나중에 line객체에서 이것을 유동적으로 변경하기 위해서 이다.
    var getX = function(point) {
            return point[0];
        },
        getY = function(point) {
            return point[1];
        },
        interpolate = function(points) {
            return points.join("L");    // array사이사이에 구분값 "L"을 넣어준다. 근데 왜? 값이 돼는 array는 자동으로 ","를 넣어줄까?
        }

    // 7. 리턴할 line함수 data라는 parameter를 받으며 아래에서 data.length라는 문구를 통해 array를 대충 예상 할 수 있다.
    function line(data) {
        var segments = [],
            points = [],
            i = -1,
            n = data.length,    // data는 array임을 예상할 수 있다.
            d;

        // 11. segment는 interpolate를 호출하고 그 값앞에 M을 붙이는 배열을 반환한다.
        function segment() {
            segments.push("M", interpolate(points));
        }

        // 8. 인자로 받은 data를 외부 함수 getX, getY를 사용해서 points배열에 push한다.
        // 9. call(this)한 이유는 차후 getX, getY를 변경할텐데 사용대상의 객체의 execute context를 유지하기 위해서이다. 만약 call이나 apply를 통해서 호출 하지 않을 경우 getX, getY를 바꾸더라도 외부에 잇는 getX,getY를 본다.
        // getX,Y에 +가 앞에 붙은 것은 숫자처럼 생긴 문자열을 걸러내기 위해서 추가 했다.
        // 예> console.log(typeof +"1234" === "number"); === true
        while(++i < n) {
            d = data[i];
            points.push([+getX.call(this, d, i), +getY.call(this, d, i)]);
        }

        // 10. points배열에 값이 존재 할경우 segment를 호출한다.
        if(points.length) {
            segment();
        }

        // 12. 만약 segments가 존재한다면 join을 통해서 문자열로 만든다. 만약 join의 인자가 undefined라면 spec에 의해 자동적으로 각배열사이에 구분자로 ","가 들어간다.
        return segments.length ? segments.join("") : null;
    }

    // 13. 리턴될 line에 x함수를 만든다. 이 함수는 파라메터가 존재시 외부함수 getX을 변경하고 line 자신을 리턴한다. 참고로 line은 현재 사용하는 line객체를 뜻한다.
    // 14. 만약 인자가 없다면 외부함수 getX를 반환한다.
    line.x = function(functionToGetX) {
        if(!arguments.length) return getX;
        getX = functionToGetX;
        return line; // return this랑 동일 역할을 한다.
    }

    // 15. 리턴될 line에 y함수를 만든다. 이 함수는 파라메터가 존재시 외부함수 gety을 변경하고 line 자신을 리턴한다. 참고로 line은 현재 사용하는 line객체를 뜻한다.
    // 16. 만약 인자가 없다면 외부함수 getY를 반환한다.
    line.y = function(functionToGetY) {
        if(!arguments.length) return getY;
        getY = functionToGetY;
        return line;    // return this랑 동일 역할을 한다.
    }

    // 4. 함수에서 함수를 리턴하는 형태
    // 5. 리턴되는 값이 외부의 변수나 함수를 참조할 경우 클로저이며 함수가 종료 되더라도 참조값으로 계속 외부의 변수 함수를 참조 할 수 있다.
    return line;
}

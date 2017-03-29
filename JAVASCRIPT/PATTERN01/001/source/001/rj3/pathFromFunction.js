/**
 *
 *
 * -- HINT --
 *
 */

// 1. rj3.svg안에 samples라는 namespace생성
rj3.svg.samples = {};

// 2. functionBasedLine이라는 함수를 생성
rj3.svg.samples.functionBasedLine = function() {
    var firstXCoord = 10,               // 최초 x 좌표 위치
        xDistanceBetweenPoints = 50,    // 배열의 갯수의 x좌표의 값을 증가시킬 기본값
        lineGenerator,
        svgHeight = 200;                // svg 최대 높이

    // 3. 이번에 라인을 그릴때는 line에 넘겨주는 값이 x,y좌표값이 아닌 임의의 값을 x랑 y좌표로 만들기 위한 로직의 구현체를 만들었다.
    lineGenerator = rj3.svg.line()
        .x(function(d, i) {
            return firstXCoord + (i * xDistanceBetweenPoints);  // 배열의 갯수만큼 50씩 x좌표는 증가하도록 한다.
        })
        .y(function(d) {
            return svgHeight - this.getValue(d);    // y좌표는 최대 높이에서 객체를 구현하는 인스턴스의 getValue함수를 호출해서 나온 값을 뺀 값을 높이로 잡는다.
        });

    // 4. 함수에서 함수를 리턴한다.
    return lineGenerator;
};

// 5. IIFE 전역 변수를 오염시키지 않기 위해 사용. 따른곳에서 yearlyPriceGrapher라는 전역변수가 있을경우 이렇게 하지 않으면 꼬인다.
(function() {
    var yearlyPriceGrapher = {
        lineGenerator: rj3.svg.samples.functionBasedLine(), // linegenerator에 위에 선언한 functionBaseLine을 선언한다.
        getValue: function(year) {
            return 10 * Math.pow(1.8, year-2010);   //Math.pow는 제곱근을 구하는 함수 입니다.
        }
    },
        years = [2010, 2011, 2012, 2013, 2014, 2015],
        path = yearlyPriceGrapher.lineGenerator(years); // 6. yearlyPriceGrapher의 linegenerator를 사용해 d속성 값을 구한다.
    console.log("path = ");
    console.log(path);
}());


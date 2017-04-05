
// 해당 어플리케이션에서만 사용할 수 있는 모든 객체(모듈)을 담아 놓은 전역 객체를 선언하여 namespace처럼 활용한다.
var FishApp = FishApp || {};

// FishApp namespace에 속한 모듈
// 이 함수는 FishMaker라는 다른 함수에 의존하며 fishMaker는 주입이 가능하다.
FishApp.wildFishSimulator = function(fishMaker) {
    // private 변수
    var fishes = [];

    // api를 반환
    return {
        addFish: function(name, species) {
            fishes.push(fishMaker.make(name, species));
        },
        getFishesCount: function() {
            return fishes.length;
        }
    };
};

// 모듈을 아래처럼 사용이 된다.
var preserve = FishApp.wildFishSimulator(realFishMaker);
preserve.addFish('붕어', '붕어계');
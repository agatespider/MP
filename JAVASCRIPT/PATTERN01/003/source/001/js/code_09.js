// 멍키패칭이란 새로운 프로퍼티를 객체에 붙이는 것을 의미한다. 예를들면 다른 객체의 함수를 나의 객체에 마구마구 붙이는 것을 뜻한다.

var MyApp = MyApp || {};

// HAND
MyApp.Hand = function() {
    this.dataAboutHand = {};
};

MyApp.Hand.prototype.motion = function(sign, message) {
    this.dataAboutHand = sign;
    console.log(message);
};

// HUMAN
MyApp.Human = function(handFactory) {
    this.hands = [handFactory(), handFactory()];
};

MyApp.Human.prototype.useSignLanguage = function(message) {
    var sign = {};
    this.hands.forEach(function(hand) {
       hand.motion(sign, message);
    });
};
// 프로퍼티를 빌려주는 객체는 프로퍼티를 받는 객체가 이 프로퍼티를 받아서 쓸수 있을지 조건이나 요건을 체크해야한다.
MyApp.Human.prototype.endowSigning = function(monkey) {
    if(typeof monkey.getHandCount === 'function'
    && monkey.getHandCount() >= 2) {
        monkey.useSignLanguage = this.useSignLanguage;
    } else {
        throw new Error("손이 2개가 아니라서 수화를 가르쳐줄 수 없어");
    }
};

// MONKEY
MyApp.Monkey = function(handFactory) {
    this.hands = [handFactory(), handFactory()];
};

MyApp.Monkey.prototype.getHandCount = function() {
    return this.hands.length;
};


MyApp.TeachSignLanguage = (function(){
    // handFactory 생성 Hand 객체를 생성하고 반환합니다.
    var handFactory = function() {
        return new MyApp.Hand();
    };

    // 트레이너를 생성합니다. 트레이너는 2개의 손을 가지고 있고 손으로 사인을 보낼수 있습죠.
    var trainer = new MyApp.Human(handFactory);
    // 보노보를 생성합니다. 보노보는 멍키이며 2개의 손을 가지고 있습니다.
    var bonobo = new MyApp.Monkey(handFactory);
    // 보노보에게 트레이너가 손으로 사인을 보내는 방법을 알려줍니다.
    //bonobo.useSignLanguage = trainer.useSignLanguage;

    trainer.endowSigning(bonobo);

    // 보노보가 useSignLanguage를 실행합니다. 보노보는 트레이너의 useSignLanguage를 가지게 됩니다.
    bonobo.useSignLanguage('헤이');

}());
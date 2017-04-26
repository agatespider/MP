// 간단한 공유 프로토타입

var monkey = {
    hasTail: true,
    swing: function() {
        return '매달리기';
    }
};

var chimp = Object.create(monkey);
var bonobo = Object.create(monkey);

bonobo.habitat = '아프리카';

console.log(chimp.hasTail);
console.log(bonobo.hasTail);

ape.hasTail = false;

console.log(chimp.hasTail);
console.log(bonobo.hasTail);
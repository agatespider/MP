// 다중 프로토타입 체인

var primate = {
    stereoscopicVision: "true"
};

var monkey = Object.create(primate, {
    hasTail: {value : false},
    swing: function() {
        return '매달리기';
    }
});

var chimp = Object.create(monkey);

console.log(chimp);
console.log(chimp.hasTail); // false (monkey prototype)
console.log(chimp.stereoscopicVision) // true (primate prototype)

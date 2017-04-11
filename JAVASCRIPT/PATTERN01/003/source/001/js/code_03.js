// 단순객체리터널은 object의 prototype을 상속을 받습니다.
var chimp = {
    hasThumbs: true,
    swing: function() {
        return '나무에 대롱대롱';
    }/*,
    toString: function() {
        return '난 침프입니다';
    }*/
}

// chimp는 toString()이라는 함수를 가지고 있지 않습니다. 하지만 프로토타입 체인을 통해서 toString이 있는 부모를 찾아 갑니다. 만약 toString() 존재시 호출을 하지만 존재 하지 않을 경우 undefined를 반환합니다.
// 참고로 Object에는 toString()라는 함수가 존재합니다. 그렇기 때문에 toString에서는 toString의 역할에 따라 [Object, Object]를 표시해줍니다.
console.log(chimp.toString());
console.log(chimp);

// 만약 chimp안에 toString이 존재할 경우 난 침프입니다라는 문자열을 반환 합니다.
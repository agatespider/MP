// Marsupial : 유대류 동물 (캥거루 같은 주머니 있는 것)
// nocturnal : 야행성

function Marsupial(name, nocturnal) {
    this.name = name;
    this.isNocturnal = nocturnal;
}

// prototype에 introduce함수를 선언해서 사용하는게 Marsupial의 함수에 introduce를 각각 생성하는 것보다 메모리나 성능에 더 좋은 영향을 끼친다.
Marsupial.prototype.introduce = function() {
    console.log("My name is " + this.name);
}

var maverick = new Marsupial('메버릭', true);  // My name is 메버릭
var slider = new Marsupial('슬라이더', false);  // My name is 슬라이더

console.log(maverick);

maverick.introduce();
slider.introduce();

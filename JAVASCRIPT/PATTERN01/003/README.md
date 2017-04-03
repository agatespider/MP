# 객체를 바르게 만들기

## 1. 원시형
Javascript의 원시형은 5개 이며 String, Number, Boolean, null, undefined가 전부이다. ECMAScript6에서는 새로 Symbol이 추가 되었다.

원시형 변수는 값은 있되 프로퍼티가 없어서 아래와 같은 코드는 에러가 날 것 같지만 문제없이 실행된다.

    var str = "testStr";
    console.log(str.length);    //결과: 7
    
원시형 데이터에는 프로퍼티를 추가 할 수 없다. 하지만 Javascript암묵적으로 원시형데이터를 원시형데이터에 어울리는 wrapper객체로 감싼다.
    
사실 이런 wrapper클래스는 꽤나 엉뚱하게 동작하는지라 별로 유용하진 않지만 제공되는 length나 toUpperCase등 유용한 유틸성 함수때문에 사용을 하는 것뿐이다.
    
즉 Javascript엔진은 str.length를 해석할때 객체로 먼가 하려나 보다 하고 str로 String객체를 생성하고 실제 이 객체의 length를 실행하게 된다.

암묵적 Wrapper의 시기는 원시
    
물론 곧바로 String객체는 가비지 컬렉션 대상이 되어서 사라진다.

문자열, 불린, 숫자 타입은 모두 그들만의 Wrapper 객체가 존재한다.
    

# 객체를 바르게 만들기

* 개요
* 원시형
* 객체리터널
* 모듈패턴
* 모듈패턴 원칙
* Object 프로토타입과 프로토타입 상속
* 정리

## <a name='toc'><a name='toc'>목차</a>

  1. [객체 프로토타입과 프로토타입 상속](#prototype)
  1. [new 객체 생성](#new_object)
  

## 개요

## 원시형과 원시형객체
Javascript의 원시형은 String, Number, Boolean, null, undefined, Object 총 6가지 종류가 있습니다. 그리고 최근에 ECMAScript6에서 새로운 Symbol이 추가가 되었습니다.

원시형 변수는 값은 있고 프로퍼티가 없습니다. 그래서 아래와 같은 코드는 에러가 날 것 같지만 이상하게도 문제없이 실행이 됩니다.

    var str = "testStr";
    console.log(str.length);    //결과: 7 
    // str은 원시형 문자형 데이터 변수인데? 왜 length프로퍼티를 가질수 있는거지?
    
실제로 원시형 데이터에는 프로퍼티를 추가할 수가 없습니다. 하지만 재미있게도 Javascript는 암묵적으로 원시형 데이터를 원시형 데이터에 어울리는 wrapper객체로 감싸서 해석을 합니다.    
    
위 코드를 예로 들면 Javascript엔진은 str.length 코드를 해석할때 객체로 먼가 하려나 보다 하고 예상을 합니다. 그리고 str로 String 객체를 생성하고 실제 이 객체의 length 프로퍼티를 참조하게 되는 것입니다.

물론 이렇게 만들어진 String객체는 곧바로 가비지 컬렉션 대상이 되어서 사라지게 됩니다.
    
여태까지 원시형 데이터에 대해 간단히 설명했습니다.

실제로 원시형 데이터는 상수 변수에 담아놓고 그 변수를 사용하는 형태로 많이 사용을 합니다. 원시형 데이터는 객체가 아니므로 프로퍼티를 심을 수가 없습니다.

만약에 프로퍼티를 담고 싶다면 원시형이 아닌 객체를 만들어서 사용을 해야합니다.

## 객체리터널

아래 코드처럼 선언한 객체를 객체리터널(object literal)이라고 말합니다. 리터널이란 더이상 분해할 수 없는 값을 뜻합니다.
    
    { name: 'Love', genus: 'Do you feel', genius: Do you need' }
        
객체리터널 생성 방법은 단순객체리터널(bare object liternal)과 함수반환값을 통한 생성 방법 이렇게 2가지 방법이 존재합니다.
        
    // 단순객체리터널
    var love = { name: 'Love', genus: 'Do you feel', genius: Do you need' }
    
    // 함수반환값을 통한 객체리터널             
    var mav = function() {
        ...생략
        return { name: 'mav', genus: 'picture', genius: 'type' }
    }
    
둘중 하나가 다른 하나보다 더 DRY합니다. 예를 들면 같은 프로퍼티를 가진 객체리터널을 단순객체리터널방식으로 여러개 생성할때 실수를 할 수 있습니다. 프로퍼티를 빼먹거나 오타도 칠 수 있겠죠.

이런 실수를 방지하고자 함수에서 객체리터널을 반환한다는 가정하에서 TDD방식으로 함수가 원하는 프로퍼티를 지닌 객체를 반환하는지 확인을 할 수 있습니다.

안탑갑지만 단순객체리터널은 전혀 테스트를 할 수 없습니다.

또한 함수를 사용할 경우 의존성주입을 사용해서 원하는 객체리터널을 생성하거나 반환할 수 있습니다. 단순객체리터널은 불가능합니다.

이런 단점들이 있기 때문에 단순객체리터널은 확실히 테스트를 마친 코드에서 생성된게 아니라면 중요한 어플리케이션에선 권장하지 않습니다.

이러한 객체리터널은 데이터를 뭉치로 사용할때 쓰기 편합니다. 예를 들면 함수의 파라메터가 워낙 많을 경우 객체리터널을 사용할 수 있습니다. 만약 객체리터널을 인자로 받는 함수에서 인자로 받은 객체리터널에 프로퍼티가 하나도 없으면 기본값을 사용하라는 신호로 받아 들일 수도 있습니다.

이런 객체리터널을 받는 함수는 어떤 프로퍼티 조합도 대비할 수 있도록 테스트가 많이 필요합니다. 예를 들면 isValid 같은 메서드로 검증 가능한 객체를 사용하는 방안을 고민을 해야합니다.

## 모듈패턴
모듈 패턴은 Javascript에서 가장 많이 쓰이는 패턴중 하나입니다. 모듈 패턴은 데이터 숨김이 목적인 함수가 이런 데이터를 접근하고 제어할 수 있는 API를 제공하는 객체를 반환하는 패턴입니다.

이 패턴은 두가지 유형이 있는데 하나는 임의로 함수를 호출하여 생성하는 패턴 또 하나는 선언과 동시에 실행하는 함수에 기반을 둔 패턴입니다.

임의모듈 생성패턴 - code_01.js

    // 해당 어플리케이션에서만 사용할 수 있는 모든 객체(모듈)을 담아 놓은 전역 객체를 선언하여 namespace처럼 활용합니다.
    var FishApp = FishApp || {};
    
    // FishApp namespace에 속한 모듈
    // 이 함수는 FishMaker라는 다른 함수에 의존하며 fishMaker는 주입이 가능합니다.
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
    
    // 모듈을 아래처럼 사용을 할 수 있습니다.
    var preserve = FishApp.wildFishSimulator(realFishMaker);
    preserve.addFish('붕어', '붕어계');

이 모듈은 객체리터널을 반환하나 fishMaker같은 의존성을 외부함수에 주입해서 리터널에서 참조하게 만들 수도 있습니다. 또한 다른 모듈에도 이 모듈을 주입을 할 수 있어서 확장성에도 유리합니다.

즉시모듈 생성패턴 - code_02.js

    FishApp.wildFishSimulator = (function(fishMaker) {
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
    }(fishMaker));   //<-- 임의실행 모듈패턴과 다르게 즉시실행 모듈패턴은 이렇게 선언과 동시에 실행이됩니다.

즉시모듈 실행패턴은 임의모듈 실행패턴과 다르게 함수를 해석시에 바로 실행이 되며 특정 변수에 할당이 된 후 해당 모듈의 singleton instance가 됩니다.

## 모듈패턴 원칙
임의모듈 생성패턴을 사용하던, 즉시모듈 생성패턴을 사용하던 아래 원칙을 꼭 잊지를 말기를 바랍니다.

1. 단일 책임 원칙을 준수하며 최대한 모듈은 한가지의 기능만을 위해 생성해야 합니다.

2. 모듈자신이 사용할 객체가 필요하다면 의존성 주입형태로 사용할 객체를 제공을 하도록 해야 합니다. 또는 팩토리 주입 형태로 주입받아서 제공을 하도록 해야 합니다.

## Object 프로토타입과 프로토타입 상속
앞에서 작성한 객체리터널은 코드를 해석시에 자동으로 내장객체 Object.prototype에 연결이 됩니다. code_03.js를 보면 실제 chimp객체에 toString이 존재 하지 않지만 오류없이 Object.prototype.toString()메소드를 실행합니다.

오류가 발생하지 않고 실행이 된 이유는 javascript엔진은 chimp.toString() 코드를 실행시에 chimp객체에 toString()이 구현이 되어 있는지 확인하고 존재할경우 해당 toString함수를 호출을 합니다.
 
하지만 존재하지 않는다면 chimp의 prototype(__proto__)안에 toString이 존재하는지 찾아보고 toString을 찾고 이것을 실행합니다. 계속 prototype을 찾아 올라가다 더이상 없으면 undefined를 반환합니다. 

## <a name='prototype'>객체 프로토타입과 프로토타입 상속</a>

Javascript의 객체들은 어떻게 생성하는지 상관없이 프로토타입객체라는 것을 자동으로 연결하고 프로토타입객체의 정보를 상속받아서 사용하게 됩니다.

다음 코드를 보면 chimp는 toString()을 구현하지 않았지만 오류가 발생하지 않고 '[Object object]'값을 반환합니다.

    var chimp = {
        hasThumbs: true,
        swing: function() {
            return '나무에 대롱대롱';
        }
    }

    console.log(chimp.toString());
    
chimp.toString()을 호출하면 javascript engine은 chimp에 직접 구현된 toString() 찾아 봅니다. 
그리고 없다는 것을 알게 되죠, 이어서 엔진은 chimp의 prototype인 Object.prototype을 찾아보고 거기서 toString() 함수 프로퍼티를 발견합니다. 이렇게 발견된 함수를 실행하고 결과값을 반환하는 일을 합니다.

당연하게도 chimp에서 toString()을 구현을 해주면 object.prototype까지 살펴볼 필요가 없으니 구현한 toString()실행을 할거라고 예상을 할 수 있습니다.

#### 프로토타입 상속
상속을 어떻게 사용할지 생각을 해봅시다. 원숭이계 동물 침프와 보노보는 둘다 원숭이 이며 나무에 매달릴 수 있고 꼬리가 있습니다. 여기서 공통적인 속성은 원숭이, 꼬리가 있고 나무에 매달릴 수 있다는 것을 알 수 있습니다.

이런 공통적인 속성을 별도 객체에 담아두고 공유해서 사용하면 각각 구현을 할 필요가 없겟죠. 이런 것을 공유 프로토타입(shared prototype)이라 합니다. 이런 공유 프로토타입의 값을 변경하게 되면 관련된 객체에 영향이 갑니다.

    var monkey = {
        hasTail: true,
        swing: function() {
            return '매달리기';
        }
    };
    
    var chimp = Object.create(ape);
    var bonobo = Object.create(ape);
    
    console.log(chimp.hasTail); // true
    console.log(bonobo.hasTail); // true
    
    ape.hasTail = false; // 공유 프로토타입의 hasTail속성을 변경했으므로 chimp, bonobo모두 영향이 미칩니다.
    
    console.log(chimp.hasTail); // false
    console.log(bonobo.hasTail); // false

Object.create(proto, <propertiesObject>)는 인자로 넘긴 proto나 propertiesObject를 갖는 새로운 객체를 만드는 역할을 합니다. 자세한것은 spec을 찾아보세요.
  
#### 프로토타입 체인
프로토타입 체인이란 JavaScript에서 속성이나 메서드를 참조하게 되면 먼저 자신 안에 정의되어 있는지 찾아 본 다음 발견하지 못하면 그 프로토타입으로 이동하여 해당 프로토타입 객체 내에서 멤버를 찾습니다.
이런 행동은 멤버를 찾거나 멤버를 찾지 못하고 null을 반환하고서야 비로소 끝나는데 이러한 객체들의 연쇄를 가리켜 프로토타입 체인(prototype chain)이라고 합니다.
  
이러한 프로토타입체인을 이용해서 여러 계층으로 체인을 구성할 수 있습니다.
  
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

하지만 당연하게도 이런 프로토타입 체인이 깊숙히 진행이되면 당연히 성능에는 좋지 않기 때문에 너무 연속적인 프로토타입 체인을 만들지 않도록 설계를 잘해야 합니다.

## <a name='new_object'>new 객체 생성</a>
Javascript에서 new를 사용해서 객체를 생성하는것은 c나 java와 거의 유사하다. 다음 예제는 Marsupial함수와 new를 이용해서 객체를 생성하는 예제입니다.

    function Marsupial(name, nocturnal) {
        this.name = name;
        this.isNocturnal = nocturnal;
    }
    
    var maverick = new Marsupial('메버릭', true);
    var slider = new Marsupial('슬라이더', false);
    
    console.log(maverick.isNocturnal); // true
    console.log(slider.isNocturnal); // false
    
     
    
## 정리




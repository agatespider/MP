# 좋은 소프트웨어 만들기

* 개요
* rj3.js
* 정리

## 개요
간략한 예제와 함께 중복되지 않은 코드를 만드는 방법과 왜 중복되지 않은 코드를 만드려는지 알아보려고 생각합니다. 

## rj3.js
rj3.js는 [SVG](https://www.w3.org/TR/SVG/)의 Path Element의 d속성 값을 만들기 위한 기능입니다.
 
이 예제는 간단하지만 여러 중요한 패턴들이 들어가 있습니다. 이러한 패턴의 명칭이 중요하진 않습니다. 정말 중요한 것은 왜? 이렇게 코드를 작성했는지 아는 것이 중요합니다.

rj3.js를 간략히 살펴보면 배열 객체를 파라메터로 받아서 반복하고 Path의 d 형태의 값을 반환하는 간단한 기능을 하고 있습니다. 이 rj3.js에는 여러 함수가 존재합니다. 각각의 함수가 왜 존재하는지? 왜 이렇게 만들어 놓았는지?를 생각해 보겠습니다.

source폴더의 rj3.js가 어떻게 동작하는지 먼자 파악해보고 아래를 읽어보시기 바랍니다.

## 1.2 getX, getY, interpolate그리고 line.x, line.y
예제에서는 line()함수에 넘겨줄 파라메터의 값의 형태가 언제든지 바뀔 수 있고 계산된 값이 최종적으로 또 변할 수 있다는 로직을 인지하고 코드를 작성을 해놓았습니다. 그 대표적인게 getX/Y, interpolate, line.x, line.y함수입니다.

    // line함수 내부에서 외부 함수인 getX와 getY를 사용해서 배열로 받은 값을 path의 d속성에 맞게 변경하고 points배열에 넣고 있습니다.
    while(++i < n) {
        d = data[i];
        points.push([+getX.call(this, d, i), +getY.call(this, d, i)]);
    }
     
    그리고 이후에 interpolate에서 points값을 문자열로 변경하고(point값을 특정 원하는형태로 보간하는 역할을 합니다.) 
    interpolate = function(points) {
        return points.join("L");    // array사이사이에 구분값 "L"을 넣어준다. 근데 왜? 값이 돼는 array는 자동으로 ","를 넣어줄까? (스팩문서 참고)
    }
     
    segment함수는 interpolate를 사용해서 d속성에 들어갈 값을 완성시켜 나가는 로직이다.
    function segment() {
        segments.push("M", interpolate(points));
    }

getX와 getY를 보면 아래와 같이 getX는 배열의 1번 getY는 배열의 2번째를 가져오도록 작성 되어잇는데 line.x와 line.y를 통해 내가 원하는 라인을 그리고 싶을때 구현로직을 변경할 수 있습니다.

    var getX = function(point) {
            return point[0];
        },
        getY = function(point) {
            return point[1];
        }
    ... 생략
    line.x = function(functionToGetX) {
        if(!arguments.length) return getX;
        getX = functionToGetX;
        return line; // return this랑 동일 역할을 한다.
    }
    line.y ...
    
## 1.3 pathFromFunction.js
이 js에서 살펴볼 로직은 아래 로직입니다.
        
    .y(function(d) {
        return svgHeight - this.getValue(d);    // y좌표는 최대 높이에서 객체를 구현하는 인스턴스의 getValue함수를 호출해서 나온 값을 뺀 값을 높이로 잡는다.
    });        
        
x값을 구하는 로직은 내부의 값을 사용해서 구하는데 y는 현재 this의 getValue값을 구해서 y의 좌표를 구현하고 있습니다. 이렇게 작성한 이유는 x좌표는 변하는 로직이 없지만 y좌표값은 그림을 그리는 대상 객체가 언제든지 내가 원하는 형태의 y좌표를 대상 객체 안의 getValue()를 통해 제공하고 그것을 통해서 그려야 하기 때문입니다. 
        
위 로직은 rj3.js의 getX,Y와 line.x/y와 거의 비슷합니다. 단지 틀린점이라면 rj3.js에서는 getX,Y의 구현체를 내가 그리고 싶은 line을 만들때 구현해서 사용했다고 한다면, pathFromFunction의 getValue는 functionBaseLine에서는 y좌표를 구하기 위한 변하지 않을 로직을 만들고 getValue를 사용하겟다고 선언을 했고 이것을 사용하려는 yearlyPriceGrapher에서는 getValue를 구현해준 것이 틀린점 입니다.
         
여기서 중요하게 생각해봐야 할것은 rj3, pathFormFuntion이나 결국 변하는 로직을 미리 파악하고 변화에 맞는 코드를 작성을 하기 위해 노력한 점입니다. 

# 2. SOLID와 DRY원칙
우리는 위의 예제 처럼 변하는 로직을 미리 파악하고 변화에 대처할수 있는 코드를 짜야 합니다. 또한 최대한 반복적인 코드를 작성하지 않도록 노력해야 합니다.

1990년대 Robert Martin이 아래와 같은 5가지의 객체지향 설계 원칙을 만들었는데, 여기서 중요한건 중복되는 코드 금지와 변화에 대처하는 코드를 만드는 방법에 대해서 설명을 해놓은 것이였습니다.

    Single Responsibility Principle(단일 책임 원칙)
    Open/Close Principle(개방 폐쇄 원칙)
    Liskov Substitution Principle(리스코프 치환 원칙)
    Interface Segregation Principle(인터페이스 분리 원칙)
    Dependency Inversion Principle(의존성 역전 원칙)
    
## 2.1 Single Responsibility Principle
다소 과장해서 말하면 모든 클래스나 Javascript 함수는 반드시 한가지 변경 사유만 있어야 한다라는 뜻인데 이런 의미보다는 하나의 중요 로직을 수행하며 변화에 있어서 별도 구현체를 분리 해야한다라고 생각하면 됩니다.

예를 들면 rj3.js를 사용할 경우 라인을 그리고 싶거나 파라메터 데이터 형이 변경되거나 햇을때 line()함수 내부 로직을 수정하는 것이 아닌 getX,y를 수정할 line.x나 y를 통해서 외부에서 기능을 구현을 해서 쓰는 것을 예로 들 수 있습니다.   
    
생각해보면 line은 line을 그리기 위해 x를 어떻게 만들어야 할지 y를 어떻게 만들어야 할지 알필요가 없습니다. line은 SVG의 path의 경로만 만드는 일만 하면 됩니다.
     
이렇게 하나의 관심사만 바라보도록 하는 것을 말한다.
     
## 2.2 Open/Close Principal
"모든 소프트웨어 개체는 확장 가능성은 열어 두되 수정 가능성은 닫아야 한다"라고 하는 원칙입니다.

즉 어떠한 경우라도 실행되는 코드를 변경하지 말고, 어떻게든 재사용하고 확장하라는 뜻입니다.

rj3.js의 line을 설계할때 데이터에서 좌표값을 만드는 방법과 점을 연결하는 방법에 변경사항이 있을 것이라 생각하고 추상화 해서 함수 밖에서 로직을 구현하도록 만들었습니다. (getX, getY, line.x, line.y) 

line에서 변경이 되지 않을 기능으로는 M으로 시작해서 ","으로 이어지는 문자열을 반환한다는 점이라고 파악을 했던겁니다.

즉 getX, line.X, getY, line.Y는 확장을 염두하고 만든것이며 M과 ","형태의 문자열 반환로직은 변할일이 없어서 하드코딩을 해놓았습니다.

하지만 이 변경될 것을 예측하고 확장하는 것은 업무의 경험에서 우러나오던가 아니면 개발하면서 찾게 되는게 일반적입니다. 그렇기 때문에 업무에 대한 이해도가 굉장히 코드를 분리하는데 있어서 중요한 작용을 합니다.

## 2.3 Liskov Substritution Principle
이 원칙을 Javascript에 어울리게 변경한다면 "어떤 타입에서 파생된 타입의 객체가 있다면 이 타입을 사용하는 코드는 변경하지 말아야 한다."라는 이야기인데 Javascript에선...(?) 찾아보는 중입니다.

## 2.4 Interface Segregation Principal
인터페이스 분리 원칙은 C++ 이나 java 기반 언어 환경에서 비롯된 원칙입니다. 이들 언어에서는 interface란 클래스에서 구현체를 갖지 않고 함수의 명칭, 파라메터 같은 시그너처만 작성하도록 되어 있습니다.

인터페이스 분리 운칙은 이러한 인터페이스를 최소한으로 작게 작게 나누어서 최대한 재사용을 극대화 하려는 취지입니다. 이 최소한은 마구잡이로 나누는게 아니라 최소한의 기능을 위한 형태로 나누어야 합니다.  

Javascript는 interface가 없습니다. 하지만 인터페이스가 하는 역할과 동일한 기능을 만들어서 비슷하게 구현할 수 있습니다. 

차후 예제를 통해서 인터페이스를 구현하면서 설명하도록 하겠습니다.

## 2.5 Dependency Inversion Principle
의존성 역전 원칙은 의존관계에 있는 모듈들의 사용하는 로직들이 실제 구현체가 아닌 추상화된 것을 사용해서 구현한다는 뜻이라고 할 수 있습니다. java로 본다면 interface를 통해서 비지니스 로직을 구현하는 것을 예로 들수 있습니다.

즉 "함수의 로직안에서 사용되는 기능들은 최대한 추상화된 객체를 사용해서 구현을 해야한다." 라는 의미입니다.

javascript는 interface같은 것이 없기 때문에 원칙을 준수 할 수 없다고 하지만 원칙에서 말하는 원론적인 원칙은 준수 할 수 있습니다.

차후 예제를 통해서 자세히 설명을 하도록 하겠습니다. 

## 2.6 DRY
DRY는 Do to others as you want them to do to you라는 뜻으로 결국 반복하지 말라는 뜻입니다. 반대는 WET이라고 합니다.

아마 실제 개발하면서 중복되는 코드들을 많이 만들어 보았을 것입니다. 발견될때가 가장 빠르게 고칠수 있는 시기긴한데, 보통 귀찮으니 넘어가곤 합니다.

하지만 이것들이 쌓이고 쌓이면 먼 훗날 고치기 매우 힘든 상태가 됩니다. 그러니 발견했을때 고치시길 바랍니다.
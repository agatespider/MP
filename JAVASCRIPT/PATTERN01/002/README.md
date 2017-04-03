# Javascript 테스트 도구 - Jasmine

## 1. Jasmine 예제
Jasmine은 공식 홈페이지에 가서 보면 Javascript를 테스트 하기 위한 Behaivor-driven develoment Framework라고 설명이 되어 있다.

간단히 말하면 Javascript로직을 테스트 하기 위한 도구라고 볼 수 있다.

TestFrameworks_01.js안의 createReservation는 passenger와 flight를 인자로 받아서 그 2개의 인자를 속성으로 갖는 객체를 리턴하며 TestFrameworks_01_tests.js는 createReservation함수를 테스트 하기 위한 코드이다.
  
Jasmine을 사용해서 테스트 하기 위해선 문자열과 함수를 인자로 갖는 전역 describe라는 함수를 호출하면서 시작한다.

    //describe는 일반적으로 테스트 하기 위한 대상을 뜻한다.
    describe('createReservation(passenger, flight)', function() {
    ... 생략
    }
    
첫번째 인자는 문자열이며 테스트를 대상 주석이며 두번째 파라메터 함수안은 실제 로직을 테스트하기 위한 구역이다. 전역 함수 it을 통해서 테스트 코드를 작성 할 수 있다.

describe와 it은 함수며 당연히 테스트를 위한 코드를 가질 수 있다.    
    
테스트는 값을 인자로 갖는 expect함수로 만들어진다. 각각의 expect는 인자의 값과 예상되는 값의 bool비교를 한다. 내가 생각햇던 코드가 맞거나 틀릴 경우 표시를 해준다.

실제 bool비교를 하는 것은 matcher가 담당한다 matcher는 tobe함수이며 비교를 하고 true, false를 반환 하는 역할을 한다.

예제는 tobe matcher를 사용해서 실제 값과 가상 값의 같은지 테스트를 했다. 하지만 같지 않을 경우도 테스트 할 수 있어야 하기 때문에 not을 통해서 부정에 대한 테스트도 할 수 있다.

     it('인자 passenger를 passengerInfo Property에 할당한다', function() {
        var testPassenger = {
            firstName: '길동',
            lastName: '홍'
        }

        var testFlight = {}

        var reservation = createReservation(testPassenger, testFlight);
        //expect의 결과값과 인자의 값이 동일하면 성공 아니면 실패이다.
        expect(reservation.passengerInfo).toBe(testPassenger);
     });
     
     // 이렇게 짤일은 없겟지만...
     it('flightInfo Property는 passenger값과 틀려야 한다.', function() {
         var testPassenger = {
             firstName: '길동',
             lastName: '홍'
             },
             testFlight = {
                 number: 3443,
                 carrier: '아시아나',
                 destenation: '달나라'
             };
 
         var reservation = createReservation(testPassenger, testFlight);
         expect(reservation.flightInfo).not.toBe(testPassenger);
     })

### 1.1 Jasmine의 spy기능 간략 예제     
기존 예제에서 예약저장을 위해 서버에 데이터를 저장하는 기능을 담당하는 ReservationSaver라는 서비스가 새로 생겻고 createReservation은 이것을 이용해서 서버에 예약정보를 저장해야 한다고 생각하자.

자 그럼 createReservation입장에서의 테스트 코드는 ReserationSaver를 인자로 받고 ReservationSaver의 saveReservation함수를 호출하는 것을 테스트 해야한다.

jasmine의 spy는 위같은 상황을 테스트 할 수 있도록 지원한다.

    testSaver = new ReservationSaver();
    // spyOn은 내부적으로 testSaver객체의 2번째 인자의 함수로 spy를 위한 새로운 기능을 하는 함수를 덮어 씌울 것이다.
    spyOn(testSaver, 'saveReservation');
    testReservation = createReservation(testPassenger, testFlight, testSaver);
    
    .. 생략
    
    it('ReservationSaver의 saveReservation을 호출해서 예약정보를 저장한다. saveReservation을 호출 한다.', function(){
        // toHaveBeenCalled는 호출이 되면 성공 아니면 실패
        expect(testSaver.saveReservation).toHaveBeenCalled();
    });

spy는 위처럼 사용 할 수 있으며 호출을 한 시점 정보 및 여러가지 History성 정보를 갖는다.
 
     
## 2. 왜 테스트를 하는가?
테스트 코드를 작성시 테스트 대상 코드를 먼저 개발하고 테스트 코드를 만드는 것이 아니다.
     
실제 구현 코드를 먼저 구현하기 전 테스트 코드를 작성해야한다. 그 이유는 코드 개발함에 있어서 생각을 하게 해준다. 생각을 하게 해준다는 것은 내가 지금 개발할 기능에 대해서 주요 관심사로서 설계를 하게 된다는 뜻이다.
     
또한 코드의 테스트 용이성과 그 테스트가 얼마나 잘 이루어졌는지에 대해서 코드가 유지보수성이나 확장성이 우수한지 우수하지 않은지 알 수 있다.
    
예를들어 createReservation는 예약을 생성하는 기능을 추가하는데 추기된 기능에서 예약을 등록하기 위해 ajax로 서버에 통신을 해야한다.

그냥 jQuery.ajax() 호출 코드를 createReservation에 추가해서 동작시키면 간단하게 처리 할 수 있다. 하지만 createReservation안에서 여러 기능이 추가 되면서 createReservation의 역할이 늘었고 단위 테스트 하기가 어렵게 되었다.

귀찮으니까 테스트 코드보다 그냥 동작하니 위 처럼 코드를 추가하고 진행 하고 싶을 것이다. 하지만 그러지 말자. 우선 새로 추가된 기능을 테스트 하는 만들어보자.

우리 예약데이터가 서버에 보내졌는지 확인을 해야 한다. 그런데 생각해보자 굳이 ajax코드가 createReservation에 있어야 할까?

정답은 '아니다'이다. 이런 통신 기능 테스트는 별도로 만들어서 테스트를 해야한다. 이렇게 계속 생각하면서 개발을 해나가는 것이다.

### 2.1 꼭 필요한 코드만 작성
테스트 코드를 작성하면 실패하는 테스트를 먼저 작성하고, 테스트를 성공할 수 있는 최소한의 기능만을 코딩한다. 그후 구현 세부를 변경하는 리펙토링 과정을 거쳐 개발 중인 코드에서 중복 코드를 걷어낸다.

이런 작업을 반복하면서 꼭 필요한 코드만 살아 남게 되며 결함이 없는 코드를 만들 수 있게 된다.

### 2.2 안전한 코드
개발해오면서 예전에 잘돌아가던 코드가 갑자기 동작하지 않는 회귀 결함현상이 나타난적이 있지 않은가? 이것은 코드 품질과 내코드에 대한 믿음성을 떨어 뜨리는 요인이 된다.

문제는 그 결함을 고쳣더니 따른 결함이 나온다는 것이다. 이런 것을 방지하기 위해서 테스트 코드를 작성을 한다.

단위테스트를 위한 테스트코드를 다 작성하고 내가 실수로 코드를 고쳣더라도 이 테스트를 통해 금방 찾아 낼수 잇을 뿐만 아니라 단위 테스트 결과물로도 사용할 수 있게 된다.

### 2.3 명세
탄탄히 구축된 단위 테스트들은 테스트 대상 코드의 실행 가능한 스팩 역할도 한다. 테스트 코드와 검증할 로직을 일장 문장으로 표시를 해놓는데 이것을 보고 따른 개발자나 내가 이게 어떤 기능을 담당하는지 알 수 잇는 중요 지표가 된다.
 
위의 예제를 통해서 나온 결과 메시지를 보고 이 함수가 어떤 역할을 하는지 그림을 그려볼 수 있다. 두세번 이야기 하지만 이런 명세는 개발자에게도, 미래의 내가 이전에 작성한 코드를 다시 볼때에도 도움이 많이 된다.

 
## 3. 의존성 주입
002 폴더의 Attendee_01.js를 보면 Attendee의 reserve함수는 ConferenceWebSvc와 Messenger를 new를 통해 생성하고 사용해서 예약을 하고 있다.

로직의 각각의 기능들은 자신의 업무만을 담당하며 연계도 매끄럽게 하고 있다. 자 Attendee의 테스트 코드를 만들어야 하는데 ConferenceWebSvc내부에는 Http 호출이 있다 이것을 어떻게 테스트 해야할까?, 또한 Messenger의 기능이나 이런것을 어떻게 테스트 해야할까? 과연 이것들의 테스트 코드를 Ateendee에서 만들어야 할까?
 
각각의 모듈은 자신의 기능을 담당해야 한다고 했었었다. 테스트도 마찬가지다 reserve함수는 ConferenceWebSvc와 Messenger의 세부 적인 기능에 대한 테스트 로직을 만들 필요가 없다. 단지 reserve입장에서는 ConferenceWebSvc와 Messenger의 메소드를 사용하는지 테스트를 하면 된다.

    기존에 new로 생성했던 로직을 변경 해야 한다.
    var Attendee = function(attendeeId) {
    
        // 'new'로 생성하도록 강제 한다.
        if(!(this instanceof Attendee)) {
            return new Attendee(attendeeId);
        }
    
        this.attendeeId = attendeeId;
    
        this.service = new ConferenceWebSvc();  <-- 변경해야 할 항목 (new로 선언한것을 하드코딩 햇다고 표현한다.)
        this.messenger = new Messenger();       <-- 변경해야 할 항목
    }; 
     
    파라메터로 받아서 할당했다. 
    var Attendee = function(attendeeId, service, messenger) {
        ... 생략
        
        this.service = service;
        this.messender = messenger;
    }
    
    // 테스트 코드에서는 fakeService나 fakeMessenger를 넘겨서 처리하도록 한다.
    // 이것들은 spy나 아님 메소드는 같지만 처리로직은 가짜인 객체들이다.
    // spy를 통해서 attendee에서 reserve에서 서비스나 메신저에 특정 함수를 호출 햇는지 테스트 코드를 작성 할 수 있다.
    var attendee = new Attendee(id, fakeService, fakeMessenger);
 
위 처럼 DI프레임워크를 사용하지 않고 파라메터로 주입하는 것을 poor man's dependence injection이라 한다.

의존성 주입은 코드의 재사용을 유도한다. new를 통해 생성했던 처음 로직은 service나 messenger의 기능이 변경이 자주 일어났을때 재사용하지 못하고 계속 코드를 추가 할 수 밖에 없다.

하지만 파라메터로 주입받아서 사용하게 된다면 사용하는 시점에서 내가 원하는 service나 messenger를 인자로 주어서 여러 방면으로 코드를 재활용 할 수 있다.
 
### 3.1 의존성 주입 대상들
객체를 생성하든지 주입받던지 아래와 같은 질문에 대해서 예라면 직접 인스턴스를 생성하지 말고 주입받아서 사용하기를 바란다.

    객체 또는 의존성 중 어느 하나라도 DB, 설정 파일, HTTP, 기타 인프라 등의 외부자원에 의존하는가?
    객체 내부에서 발생할지 모르는 오류를 테스트에서 고려해야하나?
    특정한 방향으로 객체를 작동시켜야 할 테스트가 존재하는가?
    서드파티 제공 객체가 아니라 온전히 내가 소유한 객체인가?
 
### 3.2 간단한 의존성 주입 프레임워크 개발
지금까지의 코드는 파라메터로 넘겨서 의존성 주입을 했다. 하드코딩한 코드보다는 좋지만 최선은 아니다. 간단한 DI프레임워크를 통해서 의존성을 주입해보자. 또한 이 의존성 프레임워크를 개발해보자.

DI 프레임워크는 아래처럼 동작한다.
    
    1. application이 시작되자마자 각각의 주입가능한 의존성 객체들의 이름을 확인하고 해당 객체를 DI컨테이너에 등록한다.
    2. 객체가 필요하면 컨테이너에 요청한다.
    3. 컨테이너는 요청받은 객체와 객체가 의존하는 객체들을 모두 재귀적으로 호출하면서 각각의 객체에 의존성을 주입힌다.
  

003의 예제를 보면 DiContainer는 간단한 Di의 원리를 설명하는 코드이며 이 DiContainer를 통해서 002소스의 Attendee가 동작하도록 수정했다.

## 4. AOP
AOP는 많이 들어보았고 어떤 기능을 하는지 알고 있을 것이다. 간단히 말하면 하나 이상의 객체나 함수에 여러 코드를 눈에 띄지 않에 앞,뒤나 여러 조건에 따라 배포하는 방법이다.

AOP 용어로 배포할 코드 조각을 어드바이스(advice), 어드바이스가 처리할 문제를 애스팩트(aspect) 또는 횡단관심사(cross-cutting concern)라고 한다.

AOP의 핵심은 함수실행시(타겟) 가로채어 다른 함수(어드바이스)를 함수가 실행하기 직전이나 직후, 또는 전후에 실행 시키는 것이다.
   
예제는 004에 존재한다.

    
    
    

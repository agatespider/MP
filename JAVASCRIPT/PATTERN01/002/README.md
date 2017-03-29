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
     
## 2. 왜 테스트를 하는가?
테스트 코드를 작성시 테스트 대상 코드를 먼저 개발하고 테스트 코드를 만드는 것이 아니다.
     
실제 구현 코드를 먼저 구현하기 전 테스트 코드를 작성해야한다. 그 이유는 코드 개발함에 있어서 생각을 하게 해준다. 생각을 하게 해준다는 것은 내가 지금 개발할 기능에 대해서 주요 관심사로서 설계를 하게 된다는 뜻이다.
     
또한 코드의 테스트 용이성과 그 테스트가 얼마나 잘 이루어졌는지에 대해서 코드가 유지보수성이나 확장성이 우수한지 우수하지 않은지 알 수 있다.
    
예를들어 createReservation는 예약을 생성하는 기능을 추가하는데 추기된 기능에서 예약을 등록하기 위해 ajax로 서버에 통신을 해야한다.

그냥 jQuery.ajax() 호출 코드를 createReservation에 추가해서 동작시키면 간단하게 처리 할 수 있다. 하지만 createReservation안에서 여러 기능이 추가 되면서 createReservation의 역할이 늘었고 단위 테스트 하기가 어렵게 되었다.

귀찮으니까 테스트 코드보다 그냥 동작하니 위 처럼 코드를 추가하고 진행 하고 싶을 것이다. 하지만 그러지 말자. 우선 새로 추가된 기능을 테스트 하는 만들어보자.

우리 예약데이터가 서버에 보내졌는지 확인을 해야 한다. 그런데 생각해보자 굳이 ajax코드가 createReservation에 있어야 할까?

정답은 '아니다'이다. 이런 통신 기능 테스트는 별도로 만들어서 테스트를 해야한다. 이렇게 계속 생각하면서 개발을 해나가는 것이다.

## 2.1 꼭 필요한 코드만 작성
테스트 코드를 작성하면 실패하는 테스트를 먼저 작성하고, 테스트를 성공할 수 있는 최소한의 기능만을 코딩한다. 그후 구현 세부를 변경하는 리펙토링 과정을 거쳐 개발 중인 코드에서 중복 코드를 걷어낸다.

이런 작업을 반복하면서 꼭 필요한 코드만 살아 남게 되며 결함이 없는 코드를 만들 수 있게 된다.

## 2.2 안전한 코드
개발해오면서 예전에 잘돌아가던 코드가 갑자기 동작하지 않는 회귀 결함현상이 나타난적이 있지 않은가? 이것은 코드 품질과 내코드에 대한 믿음성을 떨어 뜨리는 요인이 된다.

문제는 그 결함을 고쳣더니 따른 결함이 나온다는 것이다. 이런 것을 방지하기 위해서 테스트 코드를 작성을 한다.

단위테스트를 위한 테스트코드를 다 작성하고 내가 실수로 코드를 고쳣더라도 이 테스트를 통해 금방 찾아 낼수 잇을 뿐만 아니라 단위 테스트 결과물로도 사용할 수 있게 된다.

## 2.3 명세
탄탄히 구축된 단위 테스트들은 테스트 대상 코드의 실행 가능한 스팩 역할도 한다. 테스트 코드와 검증할 로직을 일장 문장으로 표시를 해놓는데 이것을 보고 따른 개발자나 내가 이게 어떤 기능을 담당하는지 알 수 잇는 중요 지표가 된다.
 
위의 예제를 통해서 나온 결과 메시지를 보고 이 함수가 어떤 역할을 하는지 그림을 그려볼 수 있다. 두세번 이야기 하지만 이런 명세는 개발자에게도, 미래의 내가 이전에 작성한 코드를 다시 볼때에도 도움이 많이 된다.
 
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Attendee 구역
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var Attendee = function(attendeeId, service, messenger) {
    this.attendeeId = attendeeId;
    this.service = service;
    this.messenger = messenger;
};

// service를 사용해서 좌석 예약을 시도하고 성공/실패 여부를 messenger를 통해서 알려준다.
Attendee.prototype.reserve = function(sessionId) {
    if(this.service.reserve(this.attendeeId, sessionId)) {  // 예약 성공시
        this.messenger.success('좌석 예약이 완료 되었습니다. 고객님은 ' + this.service.getRemainingReservations() + '좌석을 추가로 예약이 가능합니다.');
    } else {    // 예약 실패시
        this.messenger.failure('죄송합니다, 해당 좌석은 예약을 할 수 없습니다.');
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// ConferenceWebSvc 구역
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ConferenceWebSvc() {}

// 우선 무조건 false리턴
ConferenceWebSvc.prototype.reserve = function(attendeeId, sessionId) {
    return false;
}

ConferenceWebSvc.prototype.getRemainingReservations = function() {
    return '5';
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Messenger 구역
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Messenger() {}

Messenger.prototype.success = function(msg) {
    console.log("추카추카" + msg);
};

Messenger.prototype.failure = function(msg) {
    console.log("실패실패" + msg);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// myApp 구역
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. myApp nameSpace 생성
var myApp = {};

// 2. 만들었던 myApp 아래에 DiContainer를 할당한다.
myApp.diContainer = new DiContainer();

// 3. service 인젝터블을 등록
myApp.diContainer.register('service', [], function() {
    return new ConferenceWebSvc();
});

// 4. message 인젝터블을 등록
myApp.diContainer.register('messenger', [], function() {
    return new Messenger();
});

// 5. AttendeeFactory 인젝터블을 등록한다. Attendee는 attendeeFactory가 생성을 담당한다. Attendee는 인자로 id를 받는데 다른 객체의 의존으로는 id를 가져올수 없다.
// 그래서 반환하는 값을 객체 자체가 아닌 객체생성을 담당하는 함수를 넘기고 그것을 Factory라고 지칭햇다.
myApp.diContainer.register('attendeeFactory', ['service', 'messenger'], function(service, messenger) {
    return function(attendeeId) {
        return new Attendee(attendeeId, service, messenger);
    }
});

//6. Factory를 통해서 Attendee를 생성하고 테스트 해본다.
var attendee1 = myApp.diContainer.get('attendeeFactory')('attendId001');
attendee1.reserve('sessionId001');


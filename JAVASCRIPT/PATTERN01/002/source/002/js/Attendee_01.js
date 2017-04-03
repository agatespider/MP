/**
 * Attendee는 예약을 하거나 예약남은 좌석을 알려주는 ConferenceWebSvc서비스와 고객에게 정보를 알려줄 Messenger를 사용한다.
 * 이 두개의 기능은 reserve함수에서 사용이 되며 reserve는 예약을 하고 성공하면 성공메세지, 실패시 실패 메세지를 보여준다.
 * @param attendeeId
 * @constructor
 */
var Attendee = function(attendeeId) {

    // 'new'로 생성하도록 강제 한다.
    if(!(this instanceof Attendee)) {
        return new Attendee(attendeeId);
    }

    this.attendeeId = attendeeId;

    this.service = new ConferenceWebSvc();
    this.messenger = new Messenger();
};

// ConferenceWebSvc를 사용해서 좌석 예약을 시도하고 성공/실패 여부를 messenger를 통해서 알려준다.
Attendee.prototype.reserve = function(sessionId) {
    if(this.service.reserve(this.attendeeId, sessionId)) {  // 예약 성공시
        this.messenger.success('좌석 예약이 완료 되었습니다. 고객님은 ' + this.service.getRemainingReservations() + '좌석을 추가로 예약이 가능합니다.');
    } else {    // 예약 실패시
        this.messenger.failure('죄송합니다, 해당 좌석은 예약을 할 수 없습니다.');
    }
};
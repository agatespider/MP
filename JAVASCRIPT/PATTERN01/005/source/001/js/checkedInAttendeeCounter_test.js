describe('Conference.checkInService', function() {
    var checkInService,
        checkInRecorder,
        attendee;

    beforeEach(function() {
        checkInRecoder = Conference.checkInRecorder();
        //난 checkInRecoder 인스턴스의 recordCheckIn메소드를 체크할꺼야 꼭!
        spyOn(checkInRecoder, 'recordCheckIn');
        checkInService = Conference.checkInService(checkInRecoder);

        attendee = Conference.attendee('보스톤', '워크스');
    });

    describe('checkInService.checkIn(attendee)', function() {
        it('참가자를 체크인 처리한 것으로 표시한다.', function() {
            checkInService.checkIn(attendee);
            expect(attendee.isCheckedIn()).toBe(true);
        });

        it('체크인을 등록한다.', function() {
            checkInService.checkIn(attendee);
            expect(checkInRecoder.recordCheckIn).toHaveBeenCalledWith(attendee);
        });
    });
});
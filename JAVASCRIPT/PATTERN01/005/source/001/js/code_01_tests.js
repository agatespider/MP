describe('Conference.attendeeCollection', function() {
    describe('contains(attendee)', function() {
        //
    });

    describe('add(attendee)', function() {
        //
    });

    describe('remove(attendee)', function() {
        //
    });

    describe('iterate(callback)', function() {
        var collection, callbackSpy;

        // attendees 값을 순환하면서 collection에 add로 추가합니다.
        function addAttendeesToCollection(attendees) {
            attendees.forEach(function(attendee) {
                collection.add(attendee);
            });
        };

        // attendees를 순환하면서 callback을 실행했는지 체크합니다.
        function verifyCallBackWasExecutedForEachAttendee(attendees){
            // attendees 갯수 만큼 spy가 실행이 되어 있는지 체크
            expect(callbackSpy.calls.count()).tobe(attendees.length);

            var allCalls = callbackSpy.calls.all();
            for(var i = 0; i < allCalls.length; i++) {
                expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
            }
        };

       beforeEach(function() {
           collection = Conference.attendeeCollection();
           callbackSpy = jasmine.createSpy();
       });
    });
});
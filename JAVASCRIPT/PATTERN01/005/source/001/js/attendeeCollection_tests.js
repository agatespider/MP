/**
 * 여기서는 콜백의 실행횟수가 정확한지에 대해서 살피고
 * 콜백이 실행될때 올바른 인자가 넘어가는 것을 확인 합니다.
 */

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
            expect(callbackSpy.calls.count()).toBe(attendees.length);

            var allCalls = callbackSpy.calls.all();
            for(var i = 0; i < allCalls.length; i++) {
                expect(allCalls[i].args[0]).toBe(attendees[i]);
            }
        };

        beforeEach(function() {
            collection = Conference.attendeeCollection();
            callbackSpy = jasmine.createSpy();
        });

        it('빈 컬렉션에는 callback을 실행하지 않는다.', function() {
            collection.iterator(callbackSpy);
            expect(callbackSpy).not.toHaveBeenCalled();
        });

        it('원소가 하나뿐인 컬렉션은 콜백을 한 번만 실행한다.', function() {
            var attendees = [
                Conference.attendee('씽프', '김')
            ];

            addAttendeesToCollection(attendees);
            collection.iterator(callbackSpy);

            verifyCallBackWasExecutedForEachAttendee(attendees);
        });

        it('컬렉션 원소마다 한 번씩 콜백을 호출한다.', function() {
            var attendees = [
                Conference.attendee('씽프', '김'),
                Conference.attendee('제리', '이'),
                Conference.attendee('톰', '굿')
            ];

            addAttendeesToCollection(attendees);
            collection.iterator(callbackSpy);

            verifyCallBackWasExecutedForEachAttendee(attendees);
        });

    });
});



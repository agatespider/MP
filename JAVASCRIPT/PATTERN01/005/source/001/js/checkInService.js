var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
    // recorder를 주입
    var recorder = checkInRecorder;

    return {
        checkIn: function(attendee) {
            attendee.checkIn();
            recorder.recordCheckIn(attendee);
        }
    }
};
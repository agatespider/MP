var Conference = Conference || {};

Conference.checkInRecorder = function() {
    return {
        recordCheckIn: function(attendee) {
            console.log("난 등록을 할꺼야 " + attendee + "를 ㅋㅋㅋ");
        }
    }
};
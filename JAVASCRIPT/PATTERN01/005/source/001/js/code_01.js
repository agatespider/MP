var Conference = Conference || {};

Conference.attendee = function(firstName, lastName) {
    var checkedIn = false,
        first = firstName || 'None',
        last = lastName || 'None';

    return {
        getFullName: function() {
            return first + ' ' + last;
        },
        isCheckedIn: function() {
            return checkedIn;
        },
        checkIn: function() {
            checkedIn = true;
        }
    };
};

// 배열로 atteendee를 처리하기 위해 attendeeCollection을 생성
Conference.attendeeCollection = function() {
    var attendees = [];

    return {
        contains: function(attendee) {  // attendee 존재 여부
            return attendees.indexOf(attendee) > -1;
        },
        add: function(attendee) {
            if(!this.contains(attendee)) {
                attendees.push(attendee);
            }
        },
        remove: function(attendee) {
            var idx = attendees.indexOf(attendee);
            if(idx > -1) {
                attendees.splice(idx, 1);
            }
        },
        iterator: function(callback) {
            //
        }
    }
};
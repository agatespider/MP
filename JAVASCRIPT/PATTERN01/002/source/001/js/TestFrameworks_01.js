/**
 * step1. createReseration은 passenger, flight 두개의 인자를 받아서 passengerInfo와 flightInfo를 갖는 객체를 리턴한다.
 * 
 * step2. reservationSaver기능이 새로 추가 되엇으며 saveReservation이라는 함수를 갖는다.
 * 이것은 createReservation안에서 생성하며 saveReservation함수를 호출해서 서버에 예약을 등록한다.
 *
 * @param passenger: 승객정보
 * @param flight: 비행기 정보
 * @param reservationSaver: 서버에 예약을 저장하는 기능을 담당하는 객체
 * @returns {{passengerInfo: *, flightInfo: *}}
 */
function createReservation(passenger, flight, reservationSaver) {

    var reservationInfo = {
        passengerInfo: passenger,
        flightInfo: flight
    };

    // 예약정보를 예약 서버에 저장한다.
    reservationSaver.saveReservation(reservationInfo);

    return reservationInfo;
}

/**
 * 서버에 예약 정보를 저장하는 기능을 담당한다.
 * @constructor
 */
function ReservationSaver() {
    return {
        saveReservation: function(reservationInfo) {
            console.log(reservationInfo);
            console.log("값을 이제부터 서버에 저장을 시작합나디...")
            console.log("저장완료");
        }
    }
}
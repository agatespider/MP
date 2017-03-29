
// createReservation은 passenger와 flight를 인자로 받아서 이 인자를 갖는 객체를 생성하는 역할을 하는 함수 이다.
function createReservation(passenger, flight) {
    return {
        passengerInfo: passenger,
        flightInfo: flight
    }
}
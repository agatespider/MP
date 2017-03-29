/**
 * createReservetion을 테스트 한다.
 *
 * createReseration은 passenger, flight 두개의 인자를 받아서 passengerInfo와 flightInfo를 갖는 객체를 리턴한다.
 * 이 기능을 테스트 하는 테스트 코드
 */


// createReservation기능중 it에 선언된 기능이 동작하는지 테스트 한다.
describe('createReservation(passenger, flight)', function() {
    it('인자 passenger를 passengerInfo Property에 할당한다', function() {
        var testPassenger = {
            firstName: '길동',
            lastName: '홍'
        }

        var testFlight = {}

        var reservation = createReservation(testPassenger, testFlight);
        //expect의 결과값과 인자의 값이 동일하면 성공 아니면 실패이다.
        expect(reservation.passengerInfo).toBe(testPassenger);
    });

    it('인자 testFlight를 flightInfo property에 할당한다.', function() {
        var testPassenger = {};
        var testFlight = {
            number: 3443,
            carrier: '아시아나',
            destenation: '달나라'
        }

        var reservation = createReservation(testPassenger, testFlight);
        expect(reservation.flightInfo).toBe(testFlight);
    })


    it('flightInfo Property는 passenger값과 틀려야 한다.', function() {
        var testPassenger = {
            firstName: '길동',
            lastName: '홍'
            },
            testFlight = {
                number: 3443,
                carrier: '아시아나',
                destenation: '달나라'
            };

        var reservation = createReservation(testPassenger, testFlight);
        expect(reservation.flightInfo).not.toBe(testPassenger);
    })
});
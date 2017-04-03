/**
 * createReservetion을 테스트 한다.
 *
 * step1. createReseration은 passenger, flight 두개의 인자를 받아서 passengerInfo와 flightInfo를 갖는 객체를 리턴한다.
 * 이 기능을 테스트 하는 테스트 코드
 *
 * step2. reservationSaver기능이 새로 추가 되엇으며 saveReservation이라는 함수를 갖는다.
 * 이것은 createReservation안에서 생성하며 saveReservation함수를 호출해서 서버에 예약을 등록한다.
 */


// createReservation기능중 it에 선언된 기능이 동작하는지 테스트 한다.
describe('createReservation(passenger, flight)', function() {
    var testFlight = null,
        testFlight = null,
        testReservation = null,
        testSaver = null;

    // step2
    beforeEach(function() {
        testPassenger = {
                firstName: '길동',
                lastName: '홍'
            },
            testFlight = {
                number: 3443,
                carrier: '아시아나',
                destenation: '달나라'
            };

        testSaver = new ReservationSaver();
        // spyOn은 내부적으로 testSaver객체의 2번째 인자의 함수로 spy를 위한 새로운 기능을 하는 함수를 덮어 씌울 것이다.
        spyOn(testSaver, 'saveReservation');

        testReservation = createReservation(testPassenger, testFlight, testSaver);
    });

    it('인자 passenger를 passengerInfo Property에 할당한다', function() {
        //expect의 결과값과 인자의 값이 동일하면 성공 아니면 실패이다.
        expect(testReservation.passengerInfo).toBe(testPassenger);
    });

    it('인자 testFlight를 flightInfo property에 할당한다.', function() {
        expect(testReservation.flightInfo).toBe(testFlight);
    });

    it('flightInfo Property는 passenger값과 틀려야 한다.', function() {
        expect(testReservation.flightInfo).not.toBe(testPassenger);
    });

    it('ReservationSaver의 saveReservation을 호출해서 예약정보를 저장한다. saveReservation을 호출 한다.', function(){
        // toHaveBeenCalled는 호출이 되면 성공 아니면 실패
        expect(testSaver.saveReservation).toHaveBeenCalled();
    });
});
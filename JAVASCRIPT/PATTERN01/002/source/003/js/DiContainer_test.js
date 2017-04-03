
// DiContainer 테스트
describe('DiContainer', function() {
    var container = null;

    beforeEach(function() {
       container = new DiContainer();
    });

    // DiContainer안의 register함수를 테스트
    describe('register(name, dependencies, func)', function() {
        // 첫번째 테스트
        it('인자가 하나라도 빠졋거나 인자 타입이 잘못되었을 경우 오류를 발생 시킨다.', function() {
            // 오류가 발생한 테스트 인자 배열
            var badArgs = [
                [], // 인자가 아예 없을경우
                ['Name'],   // 이름만 있는 경우
                ['Name', ['D1', 'D2']], // Name이랑 dependencies만 있을 경우
                ['Name', function() {}], // Name이랑 func은 존재하고 dependencies만 없을 경우, 보통 상용 FrameWork는 제공하는데 여기선 제공 안하도록 했다.
                [1, ['D1', 'D2'], function() {}],   // Name의 데이터 타입이 잘못 되었을 경우
                ['Name', [1, 2], function() {}],    // Dependencies 데이터 타입이 잘못 되었을 경우
                ['Name', ['D1', 'D2'], 'Error Punch'],  // func 데이터 타입이 잘못 되었을 경우
            ];

            // badArgs만큼 반복하면서 container.register함수를 실행 한다. 잘못된 인자를 넘겼기 때문에 오류가 발생해야지 통과 한다.
            badArgs.forEach(function(args){
                expect(function() {
                   container.register.apply(container, args);
                }).toThrowError(container.messages.registRequiresArgs);
                    //.toThrow();
            });
        });

        it('get은 이름이 등록되지 않은 인젝터블은 undefined를 반환한다.', function() {
            // toBeUndefined()는 undefined값이라면 성공한다.
            // get함수안에는 인자로 받은 name값이 특정 공간에 없을경우 undefined를 리턴 할 것이라는게 예상이 되는가?
            expect(container.get('notName')).toBeUndefined();
        });

        it('get은 등록된 인젝터블의 함수 실행 결과를 반환한다', function() {
            var name = 'nameService',
                returnFromRegisteredFunction = 'something';

            // register는 잘못된 인자 비교도 하지만 어딘가의 공간에 데이터를 저장할 것이라고 느껴지지 않은가?
            container.register(name, [], function() {
                return returnFromRegisteredFunction;
            });

            expect(container.get(name)).toBe(returnFromRegisteredFunction);
        });

        it('등록된 인젝터블의 의존되는 인젝터블이 제공이 된다.', function() {
            var main = 'main',
                mainFunc,
                oneDependency = 'one',
                twoDependency = 'two';

            // 의존관계에 있는 oneDependency와 twoDependency를 인자로 받아 더해서 반환하는 기능을 가진 함수를 가진 main인젝터블
            container.register(main, [oneDependency, twoDependency], function(one, two) {
                return function() {
                    return one() + two();
                }
            });
            
            container.register(oneDependency, [], function() {
                return function() {
                    return 1;
                }
            });

            container.register(twoDependency, [], function() {
                return function() {
                    return 2;
                }
            });

            mainFunc = container.get(main);
            expect(mainFunc()).toBe(3);
        });
    });
});
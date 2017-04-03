

describe('Aop', function() {

    var argPassingAdvice,   // 타겟에 인자를 전달할 advice
        argsToTarget;       // targetObj.targetFn에 넘기는 인자를 비교하기 위해 만든 변수
    
    // around는 targetObj의 fnName이 실행 될때 advice를 실행한다.
    describe('Aop.around(targetObj, fnName, advice)', function(){
        var targetObj,
            executionPoints,    // 실행 이벤트가 담길 배열
            targetFnReturn;     // 타겟의 임의 샘플 변수

        beforeEach(function() {
            targetObj = {
                targetFn: function() {
                    executionPoints.push('targetFn');
                    // 파라메터 인자를 담는다. 차후 테스트에서 파라메터가 동일한지 테스트 할때 사용 된다.
                    argsToTarget = Array.prototype.slice.call(arguments, 0);
                    return targetFnReturn;
                }
            };

            executionPoints = [];
            targetFnReturn = 'return codeZero';

            argPassingAdvice = function(targetInfo) {
                return targetInfo.fn.apply(this, targetInfo.args);
            };
        });

        it('around로 설정했을때 targetObj의 fnName함수를 호출하면 advice가 실행이 된다.', function() {
            var targetObj = {
                targetFn: function() {}
            };

            var executeAdvice = false;
            var advice = function() {   //advice함수가 호출되면 무조건 executeAdvice변수는 true가 된다.
                executeAdvice = true;
            }

            // 1. targetObj의 targetFn함수가 실행되면 advice를 실행한다.
            Aop.around(targetObj, 'targetFn', advice);

            // 2. targetObj.targetFn이 실행 되었다. advice도 동작해서 executeAdvice를 false에서 true로 변경했다.
            targetObj.targetFn();

            // 3. advice가 실행되었으니 executeAdvice는 true가 되어야 한다.
            expect(executeAdvice).toBe(true);
        });

        it('Advice가 target을 감싼다.', function() {
            // advice에서 target의 함수를 감싸서 호출 하기 위해서 타겟 함수를 인자로 받도록 advice를 작성했다.
            var wrappingAdvice = function(targetInfo) {
                executionPoints.push("wrappingAdvice - 처음");
                targetInfo.fn();
                executionPoints.push("wrappingAdvice - 끝")
            };

            Aop.around(targetObj, 'targetFn', wrappingAdvice);
            targetObj.targetFn();

            expect(executionPoints).toEqual(['wrappingAdvice - 처음','targetFn','wrappingAdvice - 끝']);
        });

        it('마지막 advice가 기존 advice을 감싸며 실행되는 방식으로 체이닝 된다.', function() {
            var adviceFactory = function(adviceId) {
                return function(targetInfo) {
                    executionPoints.push("wrappingAdvice - 처음" + adviceId);
                    targetInfo.fn();
                    executionPoints.push("wrappingAdvice - 끝" + adviceId)
                }
            };

            Aop.around(targetObj, 'targetFn', adviceFactory('안쪽'));
            Aop.around(targetObj, 'targetFn', adviceFactory('바깥쪽'));

            targetObj.targetFn();

            expect(executionPoints).toEqual([
                'wrappingAdvice - 처음바깥쪽',
                'wrappingAdvice - 처음안쪽',
                'targetFn',
                'wrappingAdvice - 끝안쪽',
                'wrappingAdvice - 끝바깥쪽'
            ]);
        });

        it('advice에서 target으로 파라메터를 넘길 수 있다.', function() {
            Aop.around(targetObj, 'targetFn', argPassingAdvice);
            targetObj.targetFn('a', 'b');
            expect(argsToTarget).toEqual(['a', 'b']);
        });

        it('타겟의 반환 값도 advice에서 참조할 수 있다', function() {
            Aop.around(targetObj, 'targetFn', argPassingAdvice);
            var result = targetObj.targetFn('a', 'b');
            expect(result).toBe(targetFnReturn);
        });
    });
});
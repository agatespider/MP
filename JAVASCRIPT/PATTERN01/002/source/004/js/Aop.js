

var Aop = {

    // around는
    around: function(fnObj, fnName, advice) {
        // 오리지널 타겟 함수
        var originalFn = fnObj[fnName];

        fnObj[fnName] = function() {
            return advice.call({}, {
                fn: originalFn,
                args:arguments
            });
        }
    }
}
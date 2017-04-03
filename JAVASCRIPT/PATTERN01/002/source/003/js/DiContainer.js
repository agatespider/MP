
var DiContainer = function() {
    this.registrations = [];
};

/**
 * register는 3개의 인자를 아래와 같이 받는다
 * @param name: 인젝터블명 (인젝터블 : 주입가능한 의존성 객체를 집합적으로 의미한다.)
 * @param dependencies: 주입받을 의존성의 이름을 담는 배열
 * @param func: 인젝터블 객체를 반환하는 함수, 인텍터블명으로 객체를 구할때 이 함수를 반환한다.
 */
DiContainer.prototype.register = function(name, dependencies, func) {
    var i;

    // 파라메터의 타입을 체크
    if(typeof name !== 'string' || !Array.isArray(dependencies) || typeof func !== 'function') {
        throw new Error(this.messages.registRequiresArgs);
    }

    // 2번째 인자 dependencies의 배열의 값이 문자열인지 체크
    for(i=0; i < dependencies.length; ++i) {
        if(typeof dependencies[i] != 'string') {
            throw new Error(this.messages.registRequiresArgs);
        }
    }

    this.registrations[name] = {
        dependencies: dependencies,
        func: func
    };
};

/**
 * DiContainer의 메세지를 담당하는 객체
 * @type {{registRequiresArgs: string}}
 */
DiContainer.prototype.messages = {
    registRequiresArgs: '생성자 함수는 인자가 3개 있어야 합니다. : 문자열, 문자열 배열, 함수'
}

/**
 * name의 인젝터블의 함수를 반환한다.
 * @param name
 */
DiContainer.prototype.get = function(name) {
    var registration = this.registrations[name],
        dependencies = [],
        self = this;

    if(registration === undefined) {
        return undefined;
    }

    // 인젝터블이 의존하는 모든 디펜던시들은 재귀 순회하고 디펜던시들의 값을 받아온다.
    registration.dependencies.forEach(function(dependencyName) {
        var dependency = self.get(dependencyName);
        dependencies.push(dependency);
    });

    return registration.func.apply(undefined, dependencies);
}


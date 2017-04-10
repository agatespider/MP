# babel

* 개요
* 주소
* webpack 연계
* 정리

## 개요
babel은 현재 ECMAScript6이후를 지원하기 위해서 만들어진 것으로 ECMAScript6문법을 5문법으로 변경해주는 역할을 합니다.

## 주소
https://babeljs.io/

## webpack 연계
webpack을 통해서 ECMA6코드를 5문법으로 변경한 build된 파일을 받을 수 있습니다. 사용하기 위해선 npm을 통해서 babel을 설치 합니다.

    npm install --save-dev babel-loader babel-core babel-preset-env

설치가 완료되면 wepack.config.js파일에 모듈로써 등록을 합니다.

    ... 생략
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
    ... 생략
    
## 정리    


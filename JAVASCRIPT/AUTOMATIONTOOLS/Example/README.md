# ESLINT를 사용한 환경 세팅 예제

* 개요
* 정리

## 개요
Webpack + EsLint(ES5전용 RULESET) + WebStorm을 연계해서 개발 환경 세팅.
    
## 설치 방법

    1. .eslintignore, .eslintrc, package.json, webpack.config.js와 rules폴더를 project Root에 복사합니다.
    
    2. NodeJs를 설치 합니다.
    
    3. Console에서 npm install 실행합니다.
    
    4. Console에서 npm install -g eslint 실행합니다
    
    5. Ctrl + Alt + s를 눌러서 설정 화면으로 이동합니다.
    
    6. Languege & frameworks에서 Javascript > code Quallity Tools > ESLint를 선택합니다.
    
    7. Enable을 클릭해주고 NodeInterpreter와 eslint를 설정해줍니다. Nodejs를 설치하고 위단계를 거치면 자동으로 체크하는순간 잡힙니다.
    
    8. Configuration file에서 복사햇던 .eslintrc를 선택해주세요. 그리고 Apply를 누르고 webstorm을 재기동합니다.
    
    9. webstrom에서 rule에 적용한 항목들에 맞지 않는 것들은 오류 표시가 나게 됩니다.
    
    10. rule을 따르지 않는 모든 것들은 패키징 할때도 오류가 발생하게 됩니다.
    
    11. 안되면 문의 주세요
    
    // es5
       npm install -g eslint-config-airbnb-es5
       
    // current
       npm install -g eslint-config-airbnb
   
## 정리




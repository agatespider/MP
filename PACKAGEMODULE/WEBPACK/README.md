# Webpack

* 개요
* webpack이란
* 주요특징
* 세부목차
* 정리

## 개요
webpack은 modern javascript application을 위한 모듈 번들러 입니다. 모듈 번들러란 의존관계에 있는 모듈들을 모두 엮어서 하나의 번들로 만드는 작업이라고 할 수 있습니다. HTML은 이렇게 만들어진 번들파일만 사용하면 됩니다.

오직 1개의 번들만 생성이 되는게 아닙니다. Entry마다 각각의 번들파일을 생성할 수 있으며 Entry란 번들할 대상을 뜻합니다.
 
## 설치
Nodejs를 설치 해서 npm을 설치 합니다. 과거엔 npm과 nodejs를 각각 설치를 했었어야 했습니다. 하지만 현재는 nodejs를 설치하면 npm이 자동 설치됩니다. 그만큼 npm이 없어선 안될 존재가 되었습니다.

npm을 이용해서 웹팩을 설치 합니다.

    npm install --save-dev webpack
    
## watch    
--watch 옵션은 해당 모듈이 변경될때 마다 체크해서 자동 빌드를 해주는 옵션입니다.

    webpack --watch

## 정리    


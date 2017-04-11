# FLOW (코드 체크 도구)

* 개요
* 사이트주소
* 정리

## 개요
Javascript코드 품질을 위해서 시간이 될때 flow를 테스트 해보기로 함.
     
FLOW는 코드의 버그를 쉽게 찾게 도와주고 부적절한 코드를 사용못하도록 막기 위해서 사용을 해보려고 합니다. 
    
근데 rule set을 정의할 수 없어서.. 우선 보류
    
## 사이트주소
https://flow.org

## Compiler 설치

    npm install --save-dev babel-cli babel-preset-flow
    
    package.json에 script 추가
    {
      ... 생략
      "scripts": {
        "build": "babel src/ -D lib/",
        "prepublish": "npm run build"
    }
        
## Flow 설정

    npm install --save-dev flow-bin
    
    package.json에 script 추가
        {
          ... 생략
          "scripts": {
            "flow": "flow"
        }
    

## 정리




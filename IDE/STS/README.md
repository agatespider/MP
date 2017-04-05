# STS (Spring Tool Suite)

* 개요
* STS란
* 유용한 단축키
* 정리

## 개요
Spring Framework를 통해 개발할 경우 많은 사람들이 STS를 사용을 합니다. 이 STS가 무엇인지 Eclipse와 STS의 다른점이 무엇인지 알아보도록 하겠습니다.

## STS란?
STS는 응용 프로그램 개발을 쉽게 해주는 맞춤식 Eclipse기반의 개발 도구 입니다.

STS는 Java와 Web 및 Java EE도구들을 지원해줍니다. 통합 대시보드를 사용해서 Pivotal Cloud Foundry, Gradle 또는 TCServer같은 기술들을 사용하기에 도움을 주는 플러그인들을 쉽게 설치 할 수 있습니다.

## 유용한 단축키
단축키는 이클립스의 단축키랑 거의 동일합니다. 몇몇의 추가된 단축키들이 있지만 많이 있지 않으며 아래 단축키는 많이 쓰는 단축키 위주로 정리를 했습니다.
    
    Ctrl + Shift + L : STS는 기본적으로 Quick Search가 설치 되어 있습니다.
    Ctrl + Alt + G : 해당 커서가 위치한 단어를 사용하는 곳을 모두 찾는다
    Ctrl + K : 블록으로 감싼 단어를 현재 탭의 소스에서 위에서 아래로 찾아갑니다.
    Ctrl + Shift + K : 블록으로 감싼 단어를 현재 탭의 소스에서 아래서 위로 찾아갑니다.
    Ctrl + J : 이동하면서 찾아 내려갈수 있습니다.
    Ctrl + Shift + J : 이동하면서 찾아 올라갈수 있습니다.
    Ctrl + Shift + F : 자동 코드 정렬, 구역잡고 구역만 정렬하는 것도 가능하다.
    Ctrl + Shift + R : 원하는 파일을 찾아주는 검색창을 표시한다.
    Ctrl + Shift + T : 원하는 class를 찾아주는 검색창을 표시한다.
    Ctrl + Alt + H : 클릭한 해당 method/변수가 쓰이는 class 찾기
    Ctrl + O : 커서가 있는 코드의 메소드 리스트를 확인 할 수 있습니다.
    Ctrl + Shift + O : 자동 import
    Ctrl + Shift + X : 대문자 변환
    Ctrl + Shift + Y : 소문자 변환
    Ctrl + / : 라인 주석/라인 주석 해제
    Ctrl + Shift + / : 범위 주석
    Ctrl + Shift + \ : 범위 주석 해제
    Ctrl + Shift + G : 해당 항목을 사용하는 위치 모두 검색
    Ctrl + Shfit + 이동키 : 블록 범위로 선택
    Ctrl + Space : 자동완성 기능
    Ctrl + D : 커서가 위치한 해당 행 삭제
    Ctrl + 1 : 해당 함수/변수에 자동 create 
    Ctrl + H : 전체 검색
    Ctrl + M : 현재 화면을 전체 화면으로 보여줍니다.
    Ctrl + L : 원하는 코드의 행으로 이동합니다.
    Ctrl + Alt + 위/아래 : 현재 행을 위/아래로 복사합니다
    Alt + 위/아래 이동키 : 커서가 위치한 영역의 코드를 위 아래로 이동합니다
    Alt + 좌/우 이동키 : Ctrl로 들어간 코드 전 위치로 이동하거나 다음 위치로 이동합니다
    Alt + Shift + A : 세로 편집 기능
    Alt + S + A : 생성자 자동 생성 (Lombok을 사용하자)
    Alt + S + R : getter/setter 자동 생성 (Lombok을 사용하자)
    Shift + tab : 밖으로 들여쓰기

## 정리
STS에 관해서 간략히 설명을 했습니다. 유용한 단축키는 외워서 많이 쓰다보면 속도가 많이 향상이 됩니다.
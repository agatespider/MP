# Window에 톰켓 서비스 등록하기

* 개요
* service.bat을 사용해 서비스 등록하기
* 정리

## 개요
윈도우 환경에서 톰켓을 서비스로 등록하는 방법은 여러가지 방법이 있습니다. 이번 장에선 대표적으로 많이 쓰는 몇몇의 서비스 등록 방식에 관해서 정리할 생각입니다.


## service.bat을 사용해 서비스 등록하기 
가장 쉬운 방식이며 tomcat을 다운받고 압축을 풀면 존재하는 TOMCAT_HOME/bin/service.bat을 통해 서비스를 등록 할 수 있습니다.

    <명령어>
    service.bat install/remove [service_name]  [/user username]
    <사용 예>
    service.bat install jenkins
    <서비스제거 예>
    service.bat remove jenkins
    <서비스실행 예>
    net start jenkins
    
service.bat안에서 환경변수 JAVA_HOME을 가져다 쓰니 service.bat에서 설정하거나 아니면 환경변수로 JAVA_HOME을 등록하셔야 합니다.     

## 정리    

# 몽고디비 설치

* 개요
* 간단설치
* 몽고디비 실행
* 환경설정
* 몽고디비 연결
* 윈도우환경을 위한 서비스 구성하기
* 정리

## 개요
전장에서는 몽고디비에 관해서 간략한 개요 및 특징에 대해서 알아 보았습니다.

이번장에서는 윈도우 관점에서 몽고디비 설치 방법에 관해서 정리를 하도록 하겠습니다.
 
## 간단설치
몽고디비는 커뮤니티버전과 엔터프라이즈 버전 2가지가 존재합니다. 커뮤니티 버전은 누구나나 사용이 가능하지만 엔터프라이즈 버전은 비지니스 회원에 가입된 사람만 쓸 수 있습니다.
 
커뮤니티 버전을 윈도우에 설치 하려면 Window Vista이상이 필요합니다.
 
[다운로드사이트](https://www.mongodb.com/download-center#community)에서 최신버전으로 다운로드 받으셔서 실행만 하면됩니다. 

## 몽고디비 실행
몽고디비를 설치 완료를 했으면 실행을 해보도록 하겠습니다. 콘솔에서 mongod.exe또는 mongod를 입력해서 실행합니다.

    mongod.exe or mongod

이것은 몽고디비 데이터베이스 프로세스를 실행시킵니다. 아래와 같은 라인이 가장 아래에 출력된다면 이상없이 기동이 완료되었음을 뜻합니다.

    2017-04-05T00:01:05.734+0900 I NETWORK  [thread1] waiting for connections on port 27017

## 환경설정
몽고디비는 모든 데이터를 저장할 데이터 디렉토리 경로를 설정해줘야 합니다. 데이터 디렉토리란 mongod stores data file을 저장하는 파일 시스템 경로입니다. 

디폴트로는 /data/dbMongoDB로 잡혀있습니다. 만약 경로를 D:\test\mongodb\data로 바꾸고 싶으면 아래 명령어를 입력합니다.

    mongod --dbpath D:\mongoDb\data

mongod는 몽고디비 시스템을 위한 굉장히 중요한 데몬 프로세스 입니다. 데이터 요청을 처리하고 데이터의 엑세스를 관리하며 백그라운드 관리 작업을 합니다.

mongod는 콘솔에서 "mongod 옵션"으로 설정을 할 수 있습니다. 자세한 설정은 [여기](https://docs.mongodb.com/manual/reference/program/mongod/)를 참고하시길 바랍니다.

그리고 mongod의 설정을 일일이 입력이 아닌 YAML형태의 설정파일을 사용해서 설정파일의 옵션을 설정한 상태로 몽고디비를 실행 할 수 있습니다. 구성파일에 대해 자세한 사항을 [여기](https://docs.mongodb.com/manual/reference/configuration-options/)를 참고하시길 바랍니다.

    /etc/mongo.conf
    systemLog:
       destination: file
       path: "/var/log/mongodb/mongod.log"
       logAppend: true
    storage:
       journal:
          enabled: true
    processManagement:
       fork: true
    net:
       bindIp: 127.0.0.1
       port: 27017
    setParameter:
       enableLocalhostAuthBypass: false
    ... 생략
     
    mongod --config /etc/mongo.conf <-- 설정 

## 몽고디비연결
몽고디비에 연결하는 방법은 콘솔에서 mongo.exe쉘을 통해서 연결하면 됩니다.

    mongo.exe 또는 mongo
    
## 윈도우환경을 위한 서비스 구성하기

    1. 데이터, 로그, 설정파일 디렉토리 생성.
    mkdir D:\mongoDb\data
    mkdir D:\mongoDb\log
    mkdir D:\mongoDb\config
     
    2. 설정파일 작성 (D:\mongoDb\config\mongo.cfg)
    systemLog:
        destination: file
        path: D:\mongoDb\log\mongodb.log
    storage:
        dbPath: D:\mongoDb\data
         
    3. 콘솔에서 --install 옵션을 통해서 서비스로 등록합니다.
    mongod --config D:\mongoDb\config\mongo.cfg --install
     
    4. 몽고디비 서비스를 실행 하세요
    net start MongoDB
     
    5. 몽고디비 서비스를 중지 하세요
    net stop MongoDB
     
    6. 몽고디비 서비스를 삭제 합니다.
    mongod --remove

## 정리    
윈도우 환경에서 몽고디비 커뮤니티 버전을 설치하고 설정하는 방법과 연결하는 방법 그리고 윈도우에 서비스로 등록하는 방법을 알아보았습니다.

다음장에서는 mongo쉘에 대해서 알아보도록 하겠습니다.

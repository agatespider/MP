# 몽고쉘 (Mongo Shell)

* 개요
* 몽고쉘이란?
* 정리

## 개요
이전장에선 몽고디비를 윈도우 환경에서 설치하고 서비스를 등록하고 mongo를 통해서 연결하는 것을 알게 되었습니다.

이번장에선 몽고쉘(Mongo Shell)이 무엇인지 이것을 통해서 무엇을 할 수 있는지 알수 있을거 같은 생각이 듭니다. 

## 몽고쉘(Mongo Shell)이란?
몽고쉘이란 몽고디비와 대화할수 있는 Javascript 인터페이스 입니다. mongo shell을 이용해서 질의하거나 업데이트하거나 관리작업을 진행 할 수 있습니다.

mongo명령어를 통해서 몽고디비와 연결을 했으면 쉘을 실행 할 수 있는 환경이 마련이 됩니다.
 
참고로 별도 포트를 설정하지 않고 몽고디비를 기동하면 포트는 27017포트를 사용하게 됩니다. 그래서 아무 인수 없이 mongo를 입력하면 localhost의 27017포트로 접속을 하게 됩니다.
 
만약 별도 user, password, port를 입력해야 한다면 아래와 같이 입력할 수 있으며 자세한 사항은 [여기](https://docs.mongodb.com/manual/reference/program/mongo/#mongo-usage-examples)에서 참고 하실 수 있습니다.  

    mongo --username <user> --password <pass> --host <host> --port 28015
    옵션을 줄이면 아래처럼 할 수 있습니다.
    mongo -u <user> -p <pass> --host <host> --port 28015
    
## .mongorc.js File
몽고디비는 기동할때 사용자의 홈 디렉토리에서 .mongorc.js파일을 체크합니다. 만약 이 파일이 존재할 경우 명령프롬프트로 이동전에 이 js파일을 분석합니다.

만약에 여러분이 콘솔에서 --eval명령어를 사용하거나 mongo file.js -u<username> -p<password> 형태로 쉘을 사용해서 javascript나 표현식을 평가할 경우 이 javascript의 처리가 완료되고나서 .mongorc.js파일을 분석합니다.
 
.mongorc.js파일이 필요없다면 --norc옵션을 사용할 수 있습니다.

근데 mongorc.js는 머에 쓰는건가요? 저도 잘모르겠습니다.

https://docs.mongodb.com/manual/mongo/ 이거 보면서 정리중
     
     

## 정리    


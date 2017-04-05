# 몽고쉘 (Mongo Shell)

* 개요
* 몽고쉘이란?
* .mongorc.js 파일
* 몽고쉘 사용
* 결과값 출력 포맷 설정
* 멀티라인입력 지원
* 자동완성기능
* 쉘종료
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
     
## 몽고쉘 사용
db라는 명령어를 통해서 db 리스트를 출력할 수 있습니다. 

    >db
    test

DB를 사용하시려면 use <DB명>을 입력하시면 됩니다.
    
    > use test
    switched to db test
    
use <db명>을 사용하지 않고 db.getSibling('<db명>')을 사용해서 db에 연결을 할 수 있습니다.

use <db명>은 db가 존재하지 않으면 새롭게 db를 생성합니다. 아래는 use <db명>을 사용해서 디비를 새로 생성하고 mycollection에 데이터를 하나 넣는 코드입니다.  
    
    > use mydatabase
    switched to db mydatabase
    > db
    mydatabase
    > db.mycollection.insertOne({x:1, y:2, z:3});
    {
            "acknowledged" : true,
            "insertedId" : ObjectId("58e47617a51446e58146606a")
    }
    
db는 db이름을 뜻합니다. 그리고 mycollection은 collection의 이름일 뿐입니다. 이것 또한 존재하지 않으면 사용하는 순간 새로 생성이 됩니다.

참고로 몽고쉘은 4095자 이상 넘어가면 잘라 버립니다.
        
## 결과값 출력 포맷 설정
db.collection.find()는 결과값으로 cursor를 리턴합니다. 이 cursor값을 할당받는 변수가 없을 경우 처음 20개의 문서를 출력해 줍니다.
    
    > db.mycollection.find()
    { "_id" : ObjectId("58e4be5d19486c46fa6ae825"), "x" : 1 }

문서의 출력시 서식을 지정을 해주려면 pretty()를 사용하면 됩니다. 데이터 형식에 마춰서 출력을 해주니 좀더 이쁘게 가독성 있게 출력이 됩니다.

## 멀티라인입력 지원     
몽고쉘은 '(', ')'와 '{', '}', '[', ']'를 사용해서 멀티라인의 입력을 받아서 처리 할 수 있습니다. 

'(','{','['으로 끝나는 해당 라인은 줄바꿈라인(...)으로 시작합니다. 당연하겟지만 해당 괄호로 연곳은 반대로 꼭 닫아주시기 바랍니다.

    if(x > 0) {
    ... count++;
    ... print();
    ... }

만약 줄바꿈라인으로 시작이 되었지만 아무것도 입력안하고 두개의 빈줄을 입력하면 멀티라인입력 모드를 빠져나오게 됩니다.

    > if (x > 0
    ...
    ...
    >
    
## 자동완성 기능
몽고 쉘은 이동키(위/아래)로 이전에 썻던 코드나 아니면 Tab키를 통해서 자동완성 기능을 제공합니다. 만약에 tab키를 연속으로 두번 타닥 누르면 관련된 모든 함수들이 표시가 됩니다.

    db.mycollection.f<tab키입력> = db.mycollection.find
    
    <tab키 두번 연속>
    > db.mycollection.find
    db.mycollection.find(               db.mycollection.findOne(            db.mycollection.findOneAndReplace(
    db.mycollection.findAndModify(      db.mycollection.findOneAndDelete(   db.mycollection.findOneAndUpdate(
    
## 쉘종료
quit()나 ctrl+c 단축키를 입력해서 몽고쉘을 종료 할 수 있습니다.
    
    > quit()
    C:\WINDOWS\system32>
        
## 정리
몽고쉘에 관해서 간략하게 알아 보았습니다. 이번장에선 몽고쉘이 갖는 특징에 관해서만 알아보았습니다.
 
다음 장에선 몽고DB에서 말하는 데이터 타입 Document에 관해서 알아보도록 하겠습니다.
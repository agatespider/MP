# Database와 Collection

* 개요
* Database
* Collection
* View
* View의 특징
* View와 collection
* 공개 뷰 정의
* 뷰삭제
* aggregation pipeline이란
* 정리

## 개요
이전장에선 몽고디비를 윈도우 환경에서 설치하고 서비스를 등록하고 mongo를 통해서 연결하는 것을 알게 되었습니다.

이번장에선 몽고디비에서 말하는 데이터베이스와 콜렉션에 관해서 알아보도록 하겠습니다.

## Database
몽고디비는 BSON Document, 즉 데이터레코드를 DataBase에 존재하는 Collection에 저장합니다.

몽고디비에서 Database는 Document를 가진 Collection들의 집합을 의미합니다. 데이터베이스는 아래와 같이 use 명령어를 통해서 사용 할 수 있습니다.

    use mydb
    
재미있는 것은 존재하지 않는 Database라도 Database를 사용하겠다고 하고 거기에 데이터를 최초 넣는 경우 자동으로 Database를 생성합니다.
    
따라서 아래와 같은 명령이 실행이 됩니다.

    > use mynewdb
    switched to db mynewdb
    > db.mycollection1.insertOne({x:1});
    {
        "acknowledged" : true,
        "insertedId" : ObjectId("58e4cb4ca5724ae2c7f5b04d")
    }

insertOne()은 mynewdb나 mycollection1이 존재하지 않는 경우에 자동으로 생성을 하고 Document를 삽입합니다.
    
참고로 데이터베이스 이름에 대한 제약 사항은 [여기](https://docs.mongodb.com/manual/reference/limits/#restrictions-on-db-names)에서 참고 하시길 바랍니다.
    
## View
View는 이번 3.4에서 새로 시작중인 기능입니다. View라는 기능은 Collection이나 다른 View에서 읽기전용 View를 생성하는 기능입니다.

뷰는 다음과 같은 명령어로 생성 하거나 정의할 수 있습니다.

    기존 create명령에 viewOn, pipeline인자를 추가해서 생성할 수 있습니다.
    db.runCommand( { create: <view>, viewOn: <source>, pipeline: <pipeline> } )
     
    또는 뷰의 기본 Collection을 지정해 줄 수 있습니다.
    db.runCommand( { create: <view>, viewOn: <source>, pipeline: <pipeline>, collation: <collation> } )
     
    아니면 몽고쉘에 새롭게 추가된 db.createView()를 사용하면 됩니다.
    db.createView(<view>, <source>, <pipeline>, <collation> )

## View의 특징
View는 오직 Read-Only입니다. View에 쓰는 행위는 모두 오류로 칩니다.

View는 근본이 되는 Collection의 Index를 사용합니다.

View는 [$natular](https://docs.mongodb.com/manual/reference/operator/meta/natural/#metaOp._S_natural) sort를 지정할 수 없습니다. (Natular이 먼지 알때 따로 정리)

view의 이름은 변경 할 수 없습니다.

View에 대한 find()작업은 다음 연산자를 지원하지 않습니다.

    $
    $elemMatch
    $slice
    $meta

View는 읽기 작업중에 필요에 따라 계산 되며 몽고디비는 읽기 작업 연산을 [aggregation pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/) 일부로 실행을 합니다.

View는 다음과 같은 작업을 지원하지 않습니다.

    db.collection.mapReduce()
    $text
    geoNear 명령어와 $geoNear pipeline

먄악 View를 만드는 aggregation pipeline이 _id필드를 표시하지 않으면 View의 Document에도 _id필드가 존재 하지 않습니다.

View는 기반이 Collection이 분할되면 view도 분할된것으로 간주합니다. 따라서 $lookup 및 $graphLookup명령어 안에서 from 필드에 대한 분할된 뷰를 지정할 수 없습니다. (?)

예를 들어 다음과 같은 명령은 유효하지 않습니다.

    db.view.find().sort({$natural: 1})
    
## View와 컬렉션
  
뷰를 생성하는 시점에 기본 collection을 지정할 수 있습니다. 만약 collection을 지정하지 않으면 뷰는 뷰의 기본적인 collection인 “simple” binary comparison collator를 지정합니다. 즉 뷰는 컬렉션의 기본데이터 Collection을 상속하지 않습니다.
   
뷰의 문자열 비교는 뷰의 기본 데이터 정렬을 사용합니다. 뷰의 기본 데이터 정렬을 변경하거나 무시하려고 하는 작업은 오류와 함께 실패합니다.

다른 뷰에서 뷰를 만드는 경우 소스뷰의 데이터 정렬과 다른 데이터 정렬을 지정할 수 없습니다.

$lookup 또는 $graphLookup과 같이 여러게가 포함 된 집계를 수행하는 경우 View의 데이터 정렬이 동일 해야합니다.
       
## 공개뷰 정의
db.getCollectionInfos() 및 db.getCollectionNames()과 같은 collection을 나열하는 명령에는 출력에 뷰가 포함됩니다.        
        
view는 public입니다. view의 db.getCollectrionInfos() 및 해석하는 명령은 뷰를 정의하는 pipeline이 포함됩니다. 따라서 View 정의에서 중요한 필드와 값은 직접 참조하지 마시길 바랍니다.

## 뷰 삭제
뷰에서 아래 명령어를 입력하면 뷰를 삭제 할 수 있습니다.

    db.collection.drop()
        
## 정리
이번장에서는 Database와 collection 그리고 뷰에 대해서 알아보았습니다. 

Database은 Collection의 모음이고 Collection은 Document의 모음이라고 할 수 있습니다.

하지만 View에 관련해서는 제가 아직 미숙하여 번역하는데 문제도 많이 있고 $lookup 같은 명령어가 하는 일에 관해서 어떤역할을 하는지 잘 몰라서 제데로 정리를 못햇습니다.

차후 버전업 할때는 제데로 정리를 하도록 하겠습니다.
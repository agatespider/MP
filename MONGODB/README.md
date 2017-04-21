# MongoDb

* 개요
* MongoDb란
* Document
* 주요특징
* 세부목차
* 정리

## 개요
NoSQL 몽고디비를 정리하고자 합니다. 몽고디비 Document사이트를 참고하고 읽어 나가면서 제가 이해하고 생각하는 것들을 정리하고자 합니다.
 
꼭 끝까지 제가 정리를 했으면 좋겠습니다. 궁금하신점이나 의문사항은 저에게 알려주시면 감사하겠습니다.
 
## MongoDb란? 
몽고디비는 고성능, 고가용성 및 자동확장 기능들을 제공 해주는 Document형태의 데이터베이스 오픈소스 입니다.

몽고디비는 MySQL의 테이블과 같은 스키마가 고정된 구조 대신, JSON형태의 동적 스키마형 문서를 사용하는데, 이를 몽고디비 에서는 BSON이라고 부릅니다.

몽고디비는 가장 기본적인 데이터를 Document 라고 부릅니다. 이는 MySQL같은 RDBMS에서는 row에 해당됩니다. 이 Document 의 집합을 Collection 이라고 하는데, RDBMS에서는 Table에 해당됩니다. Collection의 집합은 DB이고, 이는 RDBMS에서도 동일합니다.

즉 db < collection < Document 형태라고 볼 수 있습니다. 

똑같은 조건으로 설계되었을 시 기존 RDBMS 속도보다 굉장히 빠르다는 장점이 있습니다. 이런 속도는 [ACID](https://ko.wikipedia.org/wiki/ACID)를 포기한 댓가로 얻은 것입니다. 따라서 데이터 consistency가 거의 필요 없고 조인 연산을 embed로 대체할 수 있는 경우에는 몽고디비가 확실한 대안이 될 수 있습니다. 반대로 저장하는 데이터가 은행 데이터같이 consistency가 매우 중요한 작업에는 몽고디비를 쓰기 매우 힘듭니다.

## Document

몽고디비의 레코드는 "필드:값"으로 구성된 데이터를 가지는 Document입니다.

Document란 무엇이냐면 아래와 같은 형태의 데이터를 뜻합니다. Document란 어떻게 보면 JSON과 거의 유사합니다.
 
    {
        name: "홍길동",
        age: 20,
        status: "A",
        address: "대한민국"
    }
    
몽고디비가 Document 형태를 추구한 이유는 다음과 같습니다.

    * RDBMS의 Row이라는 개념보다 Document와 Array를 허용하는 형태는 복잡한 계층 관계를 하나의 레코드로 표현할 수 있습니다.
      이런 형태를 많은 프로그래밍 언어에서 객체라는 용어로 불리우며 많은 곳에서 사용하고 있습니다.
    * Document는 동적스키마를 사용하며 개발자가 마음대로 필드를 추가하거나 제거를 할 수 있으며 유연하게 데이터를 저장하고 읽을 수 있습니다.
      하지만 성능을 위해서라면 동적스키마를 사용하지 않는게 유리합니다.
     
## 주요특징

    인덱싱
     - 몽고디비는 다양한 쿼리의 속도를 빠르게 할 수 있는 보조 인덱스 뿐만 아니라 고유인덱싱, 복합인덱싱, 공간정보인덱싱, FullText 인덱싱 기능도 제공한다.
      
    풍부한 쿼리 언어를 제공하고 있습니다.
     - 데이터집계, 텍스트검색, 지형공간질의등을 지원하는 쿼리들을 제공합니다.
      
    고가용성입니다.
     - failover를 제공합니다.
     - 데이터 복제를 통해 데이터를 유지합니다.
      
    수평 확장성을 지원합니다.
     - 샤딩을 지원합니다.
     - 샤드키를 이용해서 데이터 영역을 생성하는 것을 지원합니다. 클러스터에서 몽고디비는 각각의 영역에만 읽고 쓰기를 하도록 지원합니다.
      
    여러 저장소 엔진을 지원합니다.
     - WiredTiger 저장소 엔진 및 MMAPv1 스토리지 엔진등을 지원합니다.
     
## 세부목차 - Document

001. [몽고디비설치](https://github.com/agatespider/MP/tree/master/MONGODB/001)
002. [Database와 Collection](https://github.com/agatespider/MP/tree/master/MONGODB/002)
003. [Capped Collection](https://github.com/agatespider/MP/tree/master/MONGODB/003)
004. [Document](https://github.com/agatespider/MP/tree/master/MONGODB/004)
005. [BSON Types](https://github.com/agatespider/MP/tree/master/MONGODB/005)
006. [비교, 정렬 순서](https://github.com/agatespider/MP/tree/master/MONGODB/006)
007. [MongoDB Extended JSON](https://github.com/agatespider/MP/tree/master/MONGODB/007)
008. [Insert Documents](https://github.com/agatespider/MP/tree/master/MONGODB/008)
009. [Query Documents](https://github.com/agatespider/MP/tree/master/MONGODB/009)
010. [New Query Document](https://github.com/agatespider/MP/tree/master/MONGODB/010)
099. [몽고쉘](https://github.com/agatespider/MP/tree/master/MONGODB/099)

    
##
실행계획을 보려면 아래와 같이 마지막 항목에 explain()을 실행 시켜주면 됩니다.
    
    > db.inventory.find({"item":"Jack"}).explain()

## 정리    
간략하게 몽고디비란 무엇인지 알아보았습니다. 다음은 세부적인 각단계를 세부단계 목록을 통해서 알아가
보도록 하겠습니다.

# MongoDb

* 개요
* MongoDb란
* 주요특징
* 세부목차
* 정리

## 개요
세계적으로 가장 많이 사용하는 NoSQL 몽고디비를 정리하고자 합니다. 몽고디비 Document사이트를 참고하고 읽어 나가면서 제가 이해하고 생각하는 것들을 정리하고자 합니다.
 
꼭 끝까지 제가 정리를 했으면 좋겠습니다. 궁금하신점이나 의문사항은 저에게 알려주시면 감사하겠습니다.
 
## MongoDb란? 
몽고디비는 고성능, 고가용성 및 자동 확장 기능들을 제공 해주는 Document 형태의 데이터베이스 오픈소스 입니다.

몽고디비의 레코드는 "필드:값"으로 구성된 데이터를 가지는 Document입니다.

Document란 무엇이냐면 아래와 같은 형태의 데이터를 뜻합니다. Document란 어떻게 보면 JSON과 거의 유사합니다.
 
    {
        name: "홍길동",
        age: 20,
        status: "A",
        address: "대한민국"
    }
    
몽고디비가 이런 형태를 추구한 이유는 다음과 같습니다.

    * Document형태는 많은 프로그래밍 언어에서 객체라는 용어로 사용이 되고 있습니다.
    * Document나 안에 포함된 Array들은 RDMS처럼 비용이 많이 드는 Join의 필요성을 줄였습니다.
    * Document는 동적스키마를 지향하며 능수능란한 다형성을 제공해 줍니다.
 
## 주요특징

    고성능입니다.
     - 임베디드 데이터 모델을 지원하는 것은 데이터베이스 시스템의 I/O를 줄여줍니다.
     - 인덱스는 보다 빠른 응답을 지원하며 Document 및 배열의 key를 포함할 수 있습니다.
      
    풍부한 쿼리 언어를 제공하고 있습니다.
     - 데이터집계, 텍스트검색, 지형공간질의등을 지원하는 쿼리들을 제공합니다.
      
    고가용성입니다.
     - failover를 제공합니다.
     - 데이터 복제를 통해 데이터를 유지합니다.
      
    수평 확장성을 지원합니다.
     - 샤딩을 지원합니다.
     - 샤드키를 이용해서 데이터 영역을 생성하는 것을 지원합니다. 클러스터에서 몽고디비는 각각의 영역에만 읽고 쓰기를 하도록 지원합니다.
      
    여러 저장소 엔진을 지원합니다.
     - WiredTiger 저장소 엔진 및 MMAPv1 스토리지 엔진을 지원합니다.
     
## 세부목차

1. 몽고디비설치
    
## 정리    
간략하게 몽고디비란 무엇인지 알아보았습니다. 다음은 세부적인 각단계를 세부단계 목록을 통해서 알아가
보도록 하겠습니다.
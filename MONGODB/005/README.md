# BSON Types

* 개요
* 데이터유형
* ObjectId
* 정리

## 개요
이번장에선 BSON에 대해서 알아보려고 합니다.

BSON이란 MongoDB에서 Document를 저장하고 원격 프로시저를 호출하는데 사용되는 바이너리 직렬화 형태의 데이터 타입을 말합니다.. BSON 사양은 bsonspec.org에서 확인 할 수 있습니다.

BSON은 다음 데이터 유형을 Document의 값으로 지원합니다. 각 데이터 유형에는 $type 연산자로 BSON type별로 Document를 조회하는데 사용할 수 있는 해당 번호와 문자열 alias가 있습니다.

## 데이터 유형
    
    Type	                Number	 Alias	                Notes
    ----------------------------------------------------------------------
    Double	                1	    “double”	 
    String	                2	    “string”	 
    Object	                3	    “object”	 
    Array	                4  	    “array”	 
    Binary data	            5	    “binData”	 
    Undefined	            6	    “undefined”	        Deprecated.
    ObjectId	            7	    “objectId”	 
    Boolean	                8	    “bool”	 
    Date	                9	    “date”	 
    Null	                10	    “null”	 
    Regular Expression	    11	    “regex”	 
    DBPointer	            12	    “dbPointer”	        Deprecated.
    JavaScript	            13	    “javascript”	 
    Symbol	                14	    “symbol”	            Deprecated.
    JavaScript (with scope)	15	    “javascriptWithScope”	 
    32-bit integer	        16	    “int”	 
    Timestamp	            17	    “timestamp”	 
    64-bit integer	        18	    “long”	 
    Decimal128	            19	    “decimal”	             New in version 3.4.
    Min key	                -1	    “minKey”	 
    Max key	                127	    “maxKey”	 
    
필드 type을 확인 하려면 [여기](https://docs.mongodb.com/manual/core/shell-types/#check-types-in-shell)를 참고하세요.

BSON을 JSON으로 변환하면 [여기](https://docs.mongodb.com/manual/reference/mongodb-extended-json/)를 참고하세요.

다음 항목부터는 특정 BSON type에 대한 특별한 고려사항을 설명합니다.

## ObjectId
ObjectId는 작고, 고유하고, 생성이 빠르고, 순서가 있습니다. ObjectId 값은 12 바이트로 구성됩니다. 여기서 처음 4바이트는 ObjectId의 작성을 반영하는 타임 스탬프입니다. 구체적으로 다음과 같습니다.

    4Byte : 유닉스 시대 이후의 초를 나타내는 4byte값
    3Byte : 기계의 식별자
    2Byte : 프로세스 ID
    3Byte : 랜덤 값으로 시작하는 카운터

MongoDB에서 collection에 저장된 각 Document는 기본키 역할을 하는 고유한 _id 필드가 필요합니다. 삽입된 Document가 _id 필드를 생략하면 MongoDB 드라이버는 _id 필드에 대한 ObjectId를 자동으로 생성합니다.

upset:true로 업데이트 작업을 한 문서에도 적용됩니다.

MongoDB 클라이언트는 고유한 ObjectId가 있는 _id 필드를 추가해야 합니다. _id 필드에 ObjectId를 사용하면 다음과 같은 추가적인 이점이 있습니다.

    mongo shell에서 ObjectId.getTimestamp() 메소드를 사용하여 ObjectId의 작성 시간을 알 수 있습니다.
    ObjectId 값을 저장하는 _id 필드에서 정렬하는 것은 생성시간순으로 정렬하는 것과 거의 같습니다.
        
ObjectId 값의 순서와 생성시간 간의 관계는 일초내로 정확하지 않습니다. 여러 시스템 또는 단일 시스템의 여러 프로세스 또는 여러 스레드가 단일 초 내에 값을 생성하는 경우 ObjectId 값은 삽입 순서가 완벽하다고 할 수 없습니다.. 

클라이언트 드라이버가 ObjectId 값을 생성하기 때문에 클라이언트 간의 클럭 왜곡은 ObjectId의 순서가 실제 생성 숫자라고 100% 판단 할 수 없습니다.        
        
[ObjectId()](https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId)에서 objectId에 대해서 더 자세히 알 수 있습니다.        
        
## String
String은 UTF-8입니다. 보통 각 프로그래밍 언어의 드라이버는 BSON을 직렬화 serializing을 하거나 deserializing을 할 경우 인코딩을 UTF-8로 변환합니다.
 
이렇게 하면 국제 문자들을 BSON 문자열에 쉽게 저장할 수 있습니다.

sort()는 내부적으로 C++ strcmp api를 사용하는데 UTF-8문자열을 sort시 정렬 순서에 따라 일부 문자가 잘못 처리 될 수 잇습니다.

## Timestamp
BSON은 내부 MongoDB를 위한 특별한 Timestamp 유형을 가지고 있습니다. 이것은 정규 Date유형과 관련이 전혀 없습니다. Timestamp는 64bit의 값을 가집니다.

    최초 32bit는 time_t값(Unix 시대 최초 초)
    두번째 32bit는 주어진 초 내의 연산에 대한 증가 순서입니다. 단일 몽고디비 인스턴스 내에선 Timestamp값은 항상 고유합니다.

복제시에 oplog에 ts라는 field가 있습니다. 이 필드의 값은 BSON 타임 스탬프 값을 사용하는 작업 시간을 반영합니다.

Timestamp는 내부 MongoDb사용을 위한 것입니다. 대부분의 경우 응용 프로그램에서 BSON date type을 사용하려 합니다. 날짜 사용에 관해선 [여기](https://docs.mongodb.com/manual/reference/bson-types/#document-bson-type-date)를 참고 하세요.

만약 비어있는 BSON Timestamp를 가진 Document를 최상위 필드에 삽입하면 몽고디비서버는 비어있는 Timestamp를 현재 Timestamp값으로 변경합니다. 아래는 Timestamp를 넣지 않고 find를 하는 예제입니다.

    var a = new Timestamp();
    db.test.insertOne( { ts: a } );
    // 자동으로 timestamp에 현재 최신 값이 들어갑니다.
    { "_id" : ObjectId("542c2b97bac0595474108b48"), "ts" : Timestamp(1412180887, 1) }    
        
2.6이전에는 서버가 Document의 비어있는 _id/timestamp field값을 알아서 변경해주었는데 이제는 top level의 field를 모두 바꾸어줍니다.
        
top level의 field종류는 확실하진 않지만 제가 이번장을 보면서 안건 _id와 timestamp값이라고 생각을 합니다.        

## Date        
BSON의 Data 필드는 유닉스시대(1970년 1월 1일)이후의 milisecond 수를 표현하는 64bit 정수입니다. 64비트라면 2^64이니 2억 9천 만년까지의 날짜범위를 가질 수 있습니다.

공식적인 BSON사양은 BSON 날짜 유형을 [UTC datetime](http://bsonspec.org/#/specification)으로 참조합니다.

음수값은 1970년데 이전의 날짜를 뜻합니다. version 2.0이하에서의 1970이전값은 정렬이나, 인덱스, 쿼리에 부호없는 정수로 잘못해석이 되어 있습니다.

아래처럼 여러 방식으로 date를 만들 수 있습니다.

    1. var mydate1 = new Date ();
    2. var mydate2 = ISODate ()
    
    mydate1.toString();
    mydate1.getMonth();

## 정리


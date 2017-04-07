# Document

* 개요
* 구조
* 필드(field)
* 점표기법
  * Array
  * embeded Document
* 제한사항
  * Document 사이즈 제한
  * Document field  순서
  * _id field
* 추가리소스
* 정리

## 개요
이번장에선 몽고DB의 데이터 저장방식인 Document에 관해서 알아보도록 하겠습니다.

몽고디비는 데이터를 BSON 문서들로 저장합니다. BSON는 JSON의 바이너리 표현입니다. BSON 스팩에 대해서는 [여기](http://bsonspec.org/spec.html)를 참조 하시면 됩니다.


## 구조
몽고디비의 Document는 field와 value의 쌍으로 구성이 되며 다음과 같은 구조를 가집니다.

    {
       field1: value1,
       field2: value2,
       field3: value3,
       ...
       fieldN: valueN
    }

필드의 값은 다른 document나 array나 document의 array를 포함하며 BSON data 유형 중 하나 일 수도 있습니다. 예를 들어 아래의 예제 처럼 다양한 값이 들어갑니다.

    var mydoc = {
       _id: ObjectId("5099803df3f4948bd2f98391"),
       name: { first: "Alan", last: "Turing" },
       birth: new Date('Jun 23, 1912'),
       death: new Date('Jun 07, 1954'),
       contribs: [ "Turing machine", "Turing test", "Turingery" ],
       views : NumberLong(1250000)
    }

위 예제의 필드 값에는 다음과 같은 데이터 유형이 있습니다.
    
    _id는 ObjectId값이 들어 있습니다.
    name은 처음과 마지막 필드를 포함하는 embeded document값이 들어 있습니다.
    birth 및 death는 Date 유형의 값이 들어 있습니다.
    contribs는 문자열 배열값이 들어 있습니다.
    views에는 NumberLong 유형의 값이 들어 있습니다.
        
## field

    필드 이름은 문자열입니다.
    문서에는 필드 이름에 대해 다음과 같은 제한이 있습니다.
    1. 필드 이름 _id는 기본 키로 사용하기 위해 예약되어 있습니다. 그 값은 collection에서 유니크 해야하며 배열이 아닌 모든 타입이 들어올 수 있습니다..
    2. 필드 이름은 달러기호($)로 시작할 수 없습니다.
    3. 필드 이름에는 점(.)을 사용할 수 없습니다.
    4. 필드 이름에는 null문자를 사용할 수 없습니다.

BSON document에는 동일한 이름을 가진 필드가 두개 이상 있을 수 있습니다. 그러나 몽고디비 인터페이스는 중복된 필드 이름을 지원하지 않는 구조를 지향합니다. 만약 같은 이름의 필드가 두개 이상있는 Document를 제어할 경우 [driver document](https://docs.mongodb.com/manual/applications/drivers/)를 참고 하시면 됩니다.  

내부적인 몽고디비 프로세스에 의해서 생성된 일부 Document에도 중복 필드가 존재할 수 있지만 MongoDB의 프로세스는 사용자 Document에 중복 필드를 추가 하지 않습니다.

index된 collection 경우 index된 field값에는 최대 index key 길이 제한이 있습니다. 자세한 사항은 [여기](https://docs.mongodb.com/manual/reference/limits/#Index-Key-Limit)를 참조하시기 바랍니다.
        
## 점표기법 
### Array
몽고디비는 "."을 사용해서 array요소에 접근하고 Document의 field에 접근 할 수 있습니다.


Array형태의 값의 특정 위치를 엑세스 하려면 <array>.<index>로 사용할 수 있으며 ""(따옴표)로 묶으면 됩니다.

    "<array>.<index>"

예를 들어 아래와 같은 Document가 있을때 배열의 3번째요소 Turingery에 접근하려면 contribs.2을 사용하면 됩니다.        

    {
       ...
       contribs: [ "Turing machine", "Turing test", "Turingery" ],
       ...
    }
    
Array를 쿼리하는 예제는 아래를 참고 하시면 됩니다.

[Query an Array](https://docs.mongodb.com/manual/tutorial/query-arrays/)

[Query an Array of Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)

Array의 .사용에 관해서는 아래 항목에서 더 자세히 알 수 있습니다.
    
[$](https://docs.mongodb.com/manual/reference/operator/update/positional/#up._S_) positional operator for update operations,

update 실행을 위한 $ positional operator

array의 위치를 알수 없을때 $ projection operator

[Query an Array](https://docs.mongodb.com/manual/tutorial/query-arrays/#read-operations-arrays)는 array의 "."를 테스트 해볼 수 있습니다. 

### embeded Document
Document의 필드안의 값을 접근 하고 싶으면 "."을 Document.field로 연결하고 ""(따옴표)로 묶습니다
    
    "<embedded document>.<field>"

예를 들면 아래처럼 Document가 있다고 가정합시다.

    {
       ...
       name: { first: "Alan", last: "Turing" },
       contact: { phone: { type: "cell", number: "111-222-3333" } },
       ...
    }

name field의 first에 접근하려면 "name.first"를 사용할 수 있으며 "contract.phone.type"을 사용하면 contact의 phone의 type에 접근을 할 수 있습니다.

만약 테스트 해보고 싶으시면 아래의 예제를 참고 하시면 됩니다.

[Query on Embedded/Nested Documents](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)

[Query an Array of Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)

## 제한사항
  
### Document 사이즈 제한
DSON Document size는 최대 16MB까지 지원을 합니다.

size제한이 있는 이유는 과도한 양의 RAM을 사용할 수 없도록 하거나 전송 중에 과도한 대역폭을 사용할 수 없게 하기 위해서입니다.

만약에 16MB이상의 Document를 생성해야 한다면 GridFS API를 사용해야 합니다. GridFS의 자세한내용은 [여기](만약에 16MB이상의 Document를 생성해야 한다면 GridFS API를 사용해야 합니다. GridFS의 자세한내용은 
)를 참고하시기 바랍니다.

### Document field  순서
몽고디비는 아래와 같은 경우를 제외하고 입력한 순서에 따라 Document의 field 순서를 유지합니다.
 
    1. _id field는 항상 Document의 첫번째 필드입니다.
    2. field 이름을 변경할 경우 field의 순서가 변경이 될 수 있습니다.
    3. 몽고디비 2.6이상부터는 field의 순서를 최대한 보존하려고 시도를 합니다. 이전버전을 제멋대로였습니다.

### _id field        
몽고디비의 collection에 저장된 각 문서는 기본키 역할을 하는 _id field가 필요합니다. 삽입된 문서가 _id field가 존재하지 않는다면 몽고디비 드라이버에서 알아서 _id field 값을 넣어줍니다. 넣어주는 값은 ObjectId입니다. 이것은 수정시 옵션을 upsert:true로 줘서 삽입된 문서에도 적용이 됩니다.
 
upsert란 update의 옵션이며 upsert가 true일때 update조건에 맞는 document가 하나도 존재하지 않을 경우 새로 document를 생성합니다.

_id field는 몇몇의 제약사항이 있습니다.

    1. 몽고디비는 기본적으로 _id field를 인덱스 겁니다.
    2. _id field는 무조건 첫번째 field여야 합니다.
    3. _id field는 array가 아닌 BSON의 데이터를 가질 수 있습니다.
    4. _id field가 첫번째에 존재하지 않는 Document를 받으면 몽고디비가 알아서 첫번째 필드로 이동시킵니다.
    
만약에 몽고디비의 복제기능을 이용하려면 _id필드에 BSON 정규표현식을 넣으면 안됩니다. (중요)
    
아래는 _id field를 사용하는 방법입니다.

    1. ObjectId를 사용하기를 바랍니다.
    2. natural unique identifier를 사용하면 공간을 절약하고 추가 색인을 피할 수 있습니다.
    
        
## 정리

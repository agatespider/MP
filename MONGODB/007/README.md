# MongoDB Extended JSON

## <a name='synopsis'><a name='synopsis'>개요</a>
JSON은 오직 BSON이 지원하는 서브셋만을 표현할 수 있습니다. 그리고 Type의 정보를 유지하기 위해 몽고디비는 JSON포맷에 아래와 같은 모드를 제공합니다.

  1. Strict mode : BSON Type의 Strict mode는 [JSON RFC](http://www.json.org/)를 따름니다. JSON Parser는 이 strict Mode로 표현된 key/value 형태의 데이터를 파싱을 할 수 있습니다. 몽고디비 내부 JSON parser는 전달된 타입 정보로 타입을 인지합니다.
  1. Mongo Shell mode : 몽고디비의 내부 JSON parser와 몽고 shell은 몽고 shell의 JSON을 파싱을 할 수 있습니다.

다양한 데이터 유형에 사용되는 표현은 JSON이 구문 분석되는 컨텍스트에 따라 다릅니다.

## <a name='TOC'><a name='TOC'>목차</a>

  1. [Parsers and Supported Format](#parserandsupportedformat)  
  1. [BSON Data Types and Associated Representations](#bdtaar)

## <a name='parserandsupportedformat'><a name='parserandsupportedformat'>Parsers and Supported Format</a>

#### Strict 모드에서 입력
아래 항목은 strict mode에서 타입정보와 표현식을 구문분석 할 수 있습니다. 

  1. [REST Interfaces](https://docs.mongodb.com/ecosystem/tools/http-interfaces/)
  1. [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/#bin.mongoimport)
  1. --query 다양한 몽고디비 툴들의 --query 옵션
  1. [MongoDB Compass](https://www.mongodb.com/products/compass?_ga=1.161741439.2113225341.1491189642)

몽고쉘 이나 db.eval()을 비롯한 다른 JSON파서들은 strict mode에서 key/value형태의 표현은 파싱이 가능한데 타입은 인식을 하지 못합니다.

#### 몽고쉘 모드에서 입력
아래 항목은 몽고쉘 모드에서 표현식을 구문분석 할 수 있습니다.

  1. [REST Interfaces](https://docs.mongodb.com/ecosystem/tools/http-interfaces/)
  1. [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/#bin.mongoimport)
  1. --query 다양한 몽고디비 툴들의 --query 옵션
  1. Mongo Shell
  
#### Strict 모드에서 출력
[mongoexport](https://docs.mongodb.com/manual/reference/program/mongoexport/#bin.mongoexport)나 [Rest and Http Interfaces](https://docs.mongodb.com/ecosystem/tools/http-interfaces/)로 데이터를 출력합니다.   
   
#### 몽고쉘 모드에서 출력
[bsondump](https://docs.mongodb.com/manual/reference/program/bsondump/#bin.bsondump)를 사용해서 출력 할 수 있습니다.   

## <a name='bdtaar'><a name='bdtaar'>BSON Data Types and Associated Representations</a>
다음은 BSON 데이터 타입과 Strict 모드와 몽고쉘 모드에서의의 표현입니다.

#### Binary

    data_binary
    Strict모드 : { "$binary": "<bindata>", "$type": "<t>" }
    Mongo쉘모드 : BinData ( <t>, <bindata> )
    
* <bindata>는 base64기반의 바이너리 문자열입니다.
* <T>는 데이터 종류를 뜻하는 단일 바이트 표현입니다. strict모드에서 16진수의 문자열이고 몽고쉘모드에서는 정수입니다. 확장된 BSON 문서를 확인해보시기 바랍니다. http://bsonspec.org/spec.html
 
#### Date
 
    data_date
    Strict모드 : { "$date": "<date>" }
    Mongo쉘모드 : new Date ( <date> )

In Strict mode, <date> is an ISO-8601 date format with a mandatory time zone field following the template YYYY-MM-DDTHH:mm:ss.mmm<+/-Offset>.

* strict모드에서 <date>는 ISO-8601의 "YYYY-MM-DDTHH:mm:ss.mmm<+/-Offset>" 형태를 갖는 필수 시간 필드입니다. 
* JSON파서는 현재 로딩된 ISO-8601로 표현된 이전 UNIX epoch에 대해서 지원하지 않습니다. pre-epoch와 시스템의 time_t 타입의 과거시간대를 포맷팅 할때 아래와 같은 포맷을 사용합니다.

    "$date" : { "$numberLong" : "<dateAsMilliseconds>" } }

몽고쉘 모드에서는 64bit의 signed integer로 표현된 epoch UTC 이후의 milliseconds값으로 표현됩니다.    

#### Timestamp

    data_timestamp
    Strict모드 : { "$timestamp": { "t": <t>, "i": <i> } }
    Mongo쉘모드 : Timestamp( <t>, <i> )
    
* <T>는 epoch이후의 초를 위한 32bit의 unsigned integer형태의 millisecond 값으로 표현 합니다.
* <I>는 증가값을 위한 32bit의 unsigned integer 입니다.

#### Regular Expression

    data_regx
    Strict모드 : { "$regex": "<sRegex>", "$options": "<sOptions>" }
    Mongo쉘모드 : /<jRegex>/<jOptions>

* <sRegex>는 검증된 JSON 문자열들입니다.
* <jRegex>는 검증된 JSON문자열과 unescaped double quote(")를 포함한 문자열입니다. 그러나 slash(/) 문자는 포함하지 않습니다.
* <sOptions>는 알파벳으로 표현된 정규식 옵션값을 뜻합니다.
* <jOption>은 오직 'g','i','m','s' 만 포함된 문자열입니다.(버전 v1.9에 추가) 왜냐하면 Javascript와 몽고쉘은 옵션범위에 제한이 있고 잘못된 표현식경우 무시하고 표현식을 converting합니다.

#### OID

    data_oid
    Strict모드 : { "$oid": "<id>" }
    Mongo쉘모드 : ObjectId( "<id>" )

* <id>는 24 character 16진수 문자열 입니다.
        
#### DB Reference

    data_ref
    Strict모드 : { "$ref": "<name>", "$id": "<id>" }
    Mongo쉘모드 : DBRef("<name>", "<id>")

* <name>은 검증된 JSON 문자열입니다.
* <id>는 검증된 JSON type 확장입니다.

#### undefined type

    data_undefined
    Strict모드 : { "$undefined": true }
    Mongo쉘모드 : undefined

javascript/BSON의 undefined type을 위한 표현식입니다.

query document안에서 undefined를 사용할 수 없습니다. 아래 people collection에 insert한 document가 있다고 가정합니다.

    db.people.insert( { name : "Sally", age : undefined } )

아래 쿼리들은 오류를 반환합니다.

    db.people.find( { age : undefined } )
    db.people.find( { age : { $gte : undefined } } )

그러나 $type을 사용해서 undefined type을 질의 할 수 있습니다.

    >  db.people.find( { age : { $type : 6 } } )
    { "_id" : ObjectId("58ee01feb792fc112f4e1e9a"), "name" : "Sally", "age" : undefined }

위 쿼리는 age field에 undefined값을 갖는 모든 도큐먼트를 반환합니다.

#### MinKey

    data_minkey
    Strict모드 : { "$minKey": 1 }
    Mongo쉘모드 : MinKey
    
Minkey BSON data 타입의 표현은 다른 모든 타입에 비해서 가장 낮은 우선순위를 갖습니다. BSON 비교유형에 관해서는 (Comparison/Sort Order)[https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#faq-dev-compare-order-for-bson-types]를 참고 하세요.

#### MaxKey

    data_maxkey
    Strict모드 : { "$maxKey": 1 }
    Mongo쉘모드 : MaxKey

MaxKey BSON data 타입의 표현은 다른 모든 타입에 비해서 가장 높은 우선순위를 갖습니다. BSON 비교유형에 관해서는 (Comparison/Sort Order)[https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#faq-dev-compare-order-for-bson-types]를 참고 하세요.

#### NumberLong
2.6 버전에서 새로 추가가 되었습니다.

    data_numberlong
    Strict모드 : { "$numberLong": "<number>" }
    Mongo쉘모드 : NumberLong( "<number>" )

NumberLong은 64비트의 signed integer입니다. 당신은 반드시 ""(쌍따옴표)를 사용해서 나타내야하고 그렇지 않을경우 floating point숫자로 변경되어 정확도가 낮아 집니다.

예를 들면 아래는 9223372036854775807의 NumberLong값과 ""(쌍타옴표)로 감싼 값을 넣은 예제입니다.

    > db.json1.insert( { longQuoted : NumberLong("922337203685477580") } )
    > db.json1.insert( { longUnQuoted : NumberLong(922337203685477580) } )
    > db.json1.find()
    { "_id" : ObjectId("58ee0778d41ac54b19267884"), "longQuoted" : NumberLong("922337203685477580") }
    { "_id" : ObjectId("58ee077bd41ac54b19267885"), "longUnQuoted" : NumberLong("922337203685477632") }
    
아래 ""을 사용하지 않은 값은 값이 이상하게 변해서 들어가는 것을 확인 할 수 있습니다.    
    
## 정리

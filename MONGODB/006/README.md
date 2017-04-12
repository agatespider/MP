# 비교, 정렬 순서

* 개요
* 목차
* Numeric types
* String
* Arrays
* Date and timestaps
* 존재하지 않는 fields
* BinData
* 정리

## 개요
몽고디비는 서로 다른 BSON 유형의 값을 비교할때 아래의 비교 순서를 사용합니다. 이러한 BSON유형의 값에 대해서 상세하게 알아보도록 하겠습니다.

    1. MinKey(내부 타입)
    2. Null
    3. Numbers(int, longs, doubles, decimals)
    4. Symbol, String
    5. Object
    6. Array
    7. BinData
    8. ObjectId
    9. Boolean
    10. Date
    11. Timestamp
    12. Regular Expression
    13. MaxKey(내부 타입)

## <a name='TOC'><a name='TOC'>목차</a>

  1. [Numeric Types](#numerictypes)
  1. [String](#string)
  1. [Collection](#collation)
  1. [Array](#array)
  1. [Non-existent Fields](#nonexistentfields)
  1. [BinData](#binData)
  

## <a name='numerictypes'><a name='numerictypes'>Numeric Types</a> 
몽고디비는 일부 타입을 비교 목적으로 동등하게 취급합니다. 예를 들어 순서 형식은 비교하기 전에 변환됩니다.

## <a name='string'><a name='string'>String</a> 
몽고디비는 String을 간단한 바이너리 비교를 사용해서 비교합니다.

## <a name='collation'><a name='collation'>collation</a>
3.4버전에 새로 생겼습니다. collation을 사용하면 문자 비교 및 악센트 부호 비교등 문자열 비교에 대한 규칙을 설정 할 수 있습니다.
 
collaction 구문은 다음과 같습니다.

    {
       locale: <string>,
       caseLevel: <boolean>,
       caseFirst: <string>,
       strength: <int>,
       numericOrdering: <boolean>,
       alternate: <string>,
       maxVariable: <string>,
       backwards: <boolean>
    }

locale 필드는 필수이며 나머지 필드들은 옵션입니다. 필드에 대한 설명은 [여기](https://docs.mongodb.com/manual/reference/collation/#collation-document-fields)를 참조하십시요.

만약 collaction이나 연산을 위한 설정이 없는 경우 몽고디비는 문자열 비교를 위해 이전 버전에 사용된 간단한 binary 비교를 사용합니다.

## <a name='array'><a name='array'>Array</a>
Array의 소문자 비교나 오름차순 정렬은 배열의 가장 작은 요소를 비교하고 대문자 비교나 내림차순 정렬일 경우 Array에서 가장 큰 요소를 비교합니다.

만약 요소가 [ ]공백일 경우 Null또는 Empty필드보다 작은 요소로 간주합니다.

## <a name='datesandtimestamps'><a name='datesandtimestamps'>Dates and Timestamps</a>
3.0.0 버전에서 변경이 되었습니다. Date object는 Timestamp객체보다 먼저 정렬이 됩니다. 이전 날짜와 Timestamp 객체들은 함깨 정렬이 되었습니다.

## <a name='nonexistentfields'><a name='nonexistentfields'>Non-existent Fields</a>
{} 또는 {a: null} 같은 필드도 비교나 정렬시 BSON Object로 취급합니다. 즉 empty나 null위치로 인식을 하게 됩니다.

## <a name='binData'><a name='binData'>BinData</a>
몽고디비는 BinData를 아래와 같은 순서로 정렬합니다.

    1. 데이터의 길이 또는 크기로 정렬
    2. 그런 다음 BSON 1 바이트 하위 유형으로 정렬
    3. 마지막으로 데이터별로 바이트 단위 비교 수행.

## 정리


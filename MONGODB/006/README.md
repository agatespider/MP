# 비교, 정렬 순서

* 개요
* Numeric types
* String
* Arrays
* Date and timestaps
* 존재하지 않는 fields
* BinData
* 정리

## 개요
몽고디비는 서로 다른 BSON 유형의 값을 비교할때 아래의 비교 순서를 사용합니다.(?)

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

## Numeric Types
몽고디비는 일부 타입을 비교 목적으로 동등하게 취급합니다. 예를 들어 순서 형식은 비교하기 전에 변환됩니다.

## String
몽고디비는 String을 간단한 바이너리비교를 사용해서 비교합니다.

### 

## 정리


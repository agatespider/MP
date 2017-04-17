# 몽고디비 CRUD 연산 - Query Document

## <a name='synopsis'><a name='synopsis'>개요</a>
이번장에서는 몽고쉘에서 제공하는 쿼리 질의기능을 하는 db.collection.find()메소드를 사용해보도록 하겠습니다.

## <a name='toc'><a name='toc'>목차</a>

  1. [Insert a Single Document](#iasd)
  
## 샘플 등록
아래는 inventory collection에 데이터를 넣는 예제 입니다. 

    db.inventory.insertMany([
       { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
       { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
       { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
       { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
       { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
    ]);

## collection에서 모든 document를 select하기
아래는 collection에서 모든 document를 select합니다. find 메소드는 query filter parameter를 받습니다. 여기엔 {}를 넣었습니다. query filter parameter는 어떤 값을 select할지의 조건이 됩니다.

    > db.inventory.find({})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    ... 생략

이 행동은 다음의 SQL 문과 일치합니다.
    
    select * from inventory
          
[여기](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)에서 find()메소드에 대해서 더 자세히 알 수 있습니다.
          
## 비교조건의 정의
데이터를 비교하는 방법은 [query filter document](https://docs.mongodb.com/manual/core/document/#document-query-filter)의 <field>:<value>식을 사용하는 것입니다.

    { <field1>: <value1>, ... }
    
다음은 inventory collection에서 status 가 "D"인 모든 Document를 검색하는 예제입니다.
    
    > db.inventory.find({status: "D"})
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dba"), "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D" }

위 예제는 다음과 같은 SQL문과 동일합니다.
    
    select * from inventory where status = "D"    
    
## query operators를 사용한 조건 정의
query filter document는 다음과 같이 query operatorter를 사용해서 비교조건을 정의할 수 있습니다.
    
    { <field1>: { <operator1>: <value1> }, ... }
    
다음 예제는 inventory collection에서 status가 A 혹은 D인 모든 Document를 찾아오는 예제입니다.
    
    > db.inventory.find( { status: { $in: [ "A", "D" ] } } )
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    .. 생략
    
비록 [$or](https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or) operator를 사용해서 똑같이 기능을 사용할 수 있지만 같은 필드의 있는 데이터를 비교하는 거라면 [$in](https://docs.mongodb.com/manual/reference/operator/query/in/#op._S_in)을 사용하시기 바랍니다.    
    
위 예제는 다음과 같은 SQL문과 동일합니다.
    
    select * from inventory WHERE status in ("A", "D")

몽고디비의 쿼리 연산의 모든 리스트를 알아보려면 [Query and Projection Operatiors](https://docs.mongodb.com/manual/reference/operator/query/)장에서 알아 볼 수 있습니다.    
    
## AND 조건 정의
복합 쿼리는 collection의 document에서 더많은 필드를 비교할 수 있게 해줍니다. AND 연결은 복합 쿼리의 절을 연결해 쿼리가 모든 조건과 일치하는 Document를 반환하게 합니다.
    
아래 예제는 inventory collection에서 status가 "A"이고 qty가 [$lt](https://docs.mongodb.com/manual/reference/operator/query/lt/#op._S_lt) 30인 값을 질의 합니다.
 
$lt는 작다라는 뜻입니다. 즉 30보다 작은 값을 찾아라는 의미입니다.

    > db.inventory.find( { status: "A", qty: { $lt: 30 } } )
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }

이 연산은 아래 SQL문과 동일합니다.

    SELECT * FROM inventory WHERE status = "A" AND qty < 30

[여기](https://docs.mongodb.com/manual/reference/operator/query-comparison/#query-selectors-comparison)에서 또다른 비교연산자에 관해서 알 수 있습니다.

## OR 조건 정의
[$or](https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or)연산자를 사용해서 각각을 OR로 연결하는 복합 쿼리를 사용해 하나이상의 조건과 일치하는 Document를 질의 할 수 있습니다.

다음 예제는 collection안에서 status가 "A"이거나 30보다 작은 모든 Document를 검색하라는 예제입니다.

    > db.inventory.find({ $or: [{status: "A"}, {qty: {$lt: 30}}]})
    { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
    ... 생략
    
이 연산은은 아래 SQL문과 동일합니다.
     
    SELECT * FROM inventory WHERE status = "A" OR qty < 30

## AND와 OR의 조건식
다음 예제는 status가 A이고 qty가 30보다 작거나 item이 p로 시작하는 document를 collection안에서 질의하는 예제입니다.

    > db.inventory.find( {
    ...      status: "A",
    ...      $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
    ... } )
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dbb"), "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A" }

아래는 위 질의의 SQL 문입니다.

    SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
    
그리고 몽고디비는 문자를 검색할때 정규식을 지원합니다. 자세한건 [여기](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex)에서 볼 수 있습니다.



## 정리

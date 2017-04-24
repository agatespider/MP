# Query Document

## <a name='synopsis'>개요</a>
이번 장에서는 몽고디비에서 사용하는 여러 오퍼레이션에 관해서 알아보도록 하겠습니다. 
 
## <a name='insertSample'>샘플 데이터 저장</a>

    db.inventory.insertMany( [
       { title:"Whatever you do, make it pay.", item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, "tags" : [ "cotton", "red" ], status: "A", description: "My power flurries through the air into the ground", day: null, zipCode: "939374" },
       { title:"Step by step goes a long way.", item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, "tags" : [ "spring", "yellow" ], status: "A", description: "태양이 떠오를때에 나는 여기 서있을거야", day: 5, zipCode: 5783858},
       { title:"All fortune is to be conquered by bearing it.", item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, "tags" : [ ["yeah"], ["park"] ], status: "B", description: "No right, No wrong, No rules for me", zipCode: NumberLong(8939839)},
       { title:"To know is nothing at all to imagine is everything.", item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, "tags" : [ "pal", "black" ], status: "C", description: "사람들이 뭐라고 하든지", day: null, zipCode: NumberInt(93)},
       { title:"The winds and waves are always on the side of the ablest navigators.", item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, "tags" : [ "funny", "white" ], status: "D", description: "Conceal, don't feel, Don't let them know", day: null},
       { title:"The best and most beautiful things in the world cannot be seen of even touched. ", item: "mask", qty: 10, size: { h: 5, w: 2.4, uom: "cm" }, "tags" : [ "cold", "white" ], status: "C", description: "내 안에 휘몰아치는 바람은 폭풍처럼 울부짖어" }
    ]);
    
## <a name='search'>조회</a>

### 전체 데이터 조회
    
    사용법
    db.inventory.find({})
    db.inventory.find()
    사용예 - 모든 document를 찾는다.
    db.inventory.find({})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }

### "같다" 라는 질의 표현
":"를 사용해서 조건에 field와 value가 같은지 조건을 걸수 있습니다.

    사용법 
    <field1>: <value1>
    사용예 - qty 필드가 100인 모든 document를 찾는다.
    db.inventory.find({"qty": 100})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    
### 질의 연산자
질의 연산자는 { <field1>: {<operator1>:<value1>} ... } 형태를 가지고 있습니다.

#### 비교연산자
몽고디비는 아래와 같은 비교 연산자를 제공합니다. 
    
  1. $eq : 주어진값과 일치하는 값.
  1. $gt : 주어진 값보다 큰 값.
  1. $gte : 주어진 값보다 크거나 같은 값.
  1. $lt : 주어진 값보다 작은 값.
  1. $lte : 주어진 값보다 작거나 같은 값.
  1. $ne : 주어진 값과 틀린 값.
  1. $in : 주어진 배열에 속한 값.
  1. $nin : 주어진 배열에 속하지 않은 값.
    
#### $eq
    
    사용예 - status가 "D"인 모든 document를 찾는다.
    db.inventory.find({status: {$eq: "D"}})
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    { "_id" : ObjectId("58f594155ba58f30159359c8"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    사용예 - size필드안에 h필드안에 8.5인 모든 document를 찾는다.
    db.inventory.find({"size.h": 8.5}) or db.inventory.find({"size.h": {$eq: 8.5}})
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db8"), "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    사용예 - tags 배열값이 ["blank", "red"]인 모든 document를 찾는다. 
    db.inventory.find({"tags": ["cotton","red"]}) or db.inventory.find({"tags": {$eq: ["cotton","red"]}})
    { "_id" : ObjectId("58f746c93f669d1469b38375"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A" }
    사용예 - tags 배열값에 "cotton"이 존재하는 모든 document를 찾는다.
    db.inventory.find({"tags": "cotton"}) or db.inventory.find({"tags": {$eq: "cotton"}})
    { "_id" : ObjectId("58f746c93f669d1469b38375"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A" }
    { "_id" : ObjectId("58f746c93f669d1469b38376"), "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "cotton", "yellow" ], "status" : "A" }
    
#### $gt

    사용예 - qty가 50보다 큰 모든 document를 찾는다.
    db.inventory.find({"qty":{$gt: 50}})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267888"), "item" : "mat", "qty" : 85, "tags" : [ "gray" ], "size" : { "h" : 27.9, "w" : 35.5, "uom" : "cm" } }
    사용예 - qty가 15보다 큰 조건에 가장 가까운 하나의 Document의 item을 Knife로 변경한다.
    db.inventory.update({qty: {$gt: 15}}, {$set: {item: "Knife"}})
    사용예 - qty가 15보다 큰 모든 Document의 item을 Knife로 변경한다.
    db.inventory.update({qty: {$gt: 15}}, {$set: {item: "Knife"}}, {multi: true})
    
#### $gte
    
    사용예 - qty가 85보다 크거나 같은 모든 document를 찾는다.
    db.inventory.find({"qty":{$gte: 85}})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267888"), "item" : "mat", "qty" : 85, "tags" : [ "gray" ], "size" : { "h" : 27.9, "w" : 35.5, "uom" : "cm" } }
    사용예 - qty가 15보다 크거나 같은 조건에 가까운 하나의 Document의 item을 Cup으로 변경한다.
    db.inventory.update({qty: {$gte: 15}}, {$set: {item: "Cup"}})
    사용예 - qty가 15보다 큰 모든 Document의 item을 Cup으로 변경한다.
    db.inventory.update({qty: {$gte: 15}}, {$set: {item: "Cup"}}, {multi: true})
    
#### $lt

    사용예 - qty가 50보다 작은 모든 document를 찾는다.
    db.inventory.find({"qty": {$lt: 50}})
    { "_id" : ObjectId("58f594155ba58f30159359c6"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58f594155ba58f30159359ca"), "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A" }
    사용예 - qty가 75보다 작은 조건에 가장 가까운 하나의 Document의 item을 Rion으로 변경한다.
    db.inventory.update({qty: {$lt: 75}}, {$set: {item: "Rion"}})
    사용예 - qty가 75보다 작은 모든 Document의 item을 Rion으로 변경한다.
    db.inventory.update({qty: {$lt: 75}}, {$set: {item: "Rion"}}, {multi: true})

#### $lte
    
    사용예 - qty가 45보다 같거나 작은 모든 document를 찾는다.
    db.inventory.find({"qty": {$lte:45}})
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dbb"), "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A" }
    사용예 - qty가 75보다 같거나 작은 조건에 가장 가까운 하나의 Document의 item을 Tiger으로 변경한다.
    db.inventory.update({qty: {$lte: 75}}, {$set: {item: "Tiger"}})
    사용예 - qty가 75보다 같거나 작은 모든 Document의 item을 Tiger으로 변경한다.
    db.inventory.update({qty: {$lte: 75}}, {$set: {item: "Tiger"}}, {multi: true})

#### $ne

    사용예 - status가 "D"가 아닌 모든 document를 찾는다.
    db.inventory.find({"status": {$ne: "D"}})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    사용예 - qty가 75가 아닌 데이터중 하나의 Document의 item을 Mon으로 변경한다.
    db.inventory.update({qty: {$ne: 75}}, {$set: {item: "Mon"}})
    사용예 - qty가 75가 아닌 모든 Document의 item을 Mon으로 변경한다.
    db.inventory.update({qty: {$ne: 75}}, {$set: {item: "Mon"}}, {multi: true})
    
#### $in
    
    사용예 - status가 "A"나 "D"인 모든 document를 찾는다.
    db.inventory.find({"status": {$in: ["A","D"]}})
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    사용예 - tags배열에 cotton또는 red가 있는 단 1개의 document의 item을 "Jack"으로 변경한다. 
    db.inventory.update({tags: {$in: ["cotton", "red"]}}, {$set: {item: "Jack"}}, {multi: true})
    사용예 - tags배열에 cotton또는 red가 있는 모든 document의 item을 "Jack"으로 변경한다. 
    db.inventory.update({tags: {$in: ["cotton", "red"]}}, {$set: {item: "Jack"}}, {multi: true})
    사용예 - tags배열에 "on"으로 시작하는 문자열이거나 또는 "ed"로 시작하는 문자열 값이 있는 모든 document를 찾는다. (정규식 사용)
    db.inventory.find({tags: {$in: [/^cot/, /^re/]}})
       

#### $nin
    
    사용예 - status가 "A"나 "D"가 아닌 모든 document를 찾는다.
    db.inventory.find({"status": {$nin: ["A","D"]}})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267888"), "item" : "mat", "qty" : 85, "tags" : [ "gray" ], "size" : { "h" : 27.9, "w" : 35.5, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267889"), "item" : "mousepad", "qty" : 25, "tags" : [ "gel", "blue" ], "size" : { "h" : 19, "w" : 22.85, "uom" : "cm" } }
    사용예 - tags의 배열값중 어느 하나라도 cotton이나 red가 아닌 하나의 document의 item 값을 pray로 변경한다. 
    db.inventory.update({"tags": {$nin: ["cotton","red"]}}, {$set: {"item":"pray"}}) 
    사용예 - tags의 배열값 중 어느 하나라도 cotton이나 red가 아닌 모든 document의 item 값을 pray로 변경한다. 
    db.inventory.update({"tags": {$nin: ["cotton","red"]}}, {$set: {"item":"pray"}}, {multi: true})
    
#### 논리 연산자

  1. $or : 각각의 조건과 하나라도 일치하는 document를 반환합니다.
  1. $and : 모든 조건과 일치하는 document를 반환합니다.
  1. $not : 조건과 일치하지 않은 document를 반환합니다.
  1. $nor : 각각의 조건과 일치하지 않은 document를 반환합니다.
  
#### $or

    사용법
    { $or: [ { <expression1}, { <expression2}, ... , { <expressionN} ] }
    사용예 - qty가 30보다 작거나 또는 status가 "D"인 document를 반환합니다. 
    db.inventory.find({$or: [{"qty":{$lt:30}}, {"status": "D"}]})
    { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267889"), "item" : "mousepad", "qty" : 25, "tags" : [ "gel", "blue" ], "size" : { "h" : 19, "w" : 22.85, "uom" : "cm" } }
    
몽고디비는 보통 하나의 쿼리당 하나의 index를 사용하는데 $OR은 $or:[]안에 인덱스를 설정한 배열의 갯수만큼 인덱스를 이용하여 쿼리를 수행합니다. 예전에는 이렇게 질의된 Document를 합치는데 비용이 발생해서 최대한 $in으로 가라고 하는데 혹시나해서 explain()으로 in과 비교해본 바 별차이 없어보였습니다.

하지만 몽고디비 내부적으로 실행계획을 변경하는 것인지도 모르니까, $in을 써야할때는 $in을 써야 할거 같습니다. 
    
    사용예 - qty, status field 인덱스 생성
    db.inventory.createIndex( { qty: 1 } )
    db.inventory.createIndex( { status: 1 } )
    사용예 - $or을 사용해서 status가 "A"이거나 qty가 25인 쿼리의 실행계획표시 - 인덱스 2개를 사용하는 것을 확인 할 수 있습니다.
    db.inventory.find({$or:[{"status": "A"}, {"qty":25}]}).explain()
    사용예 - $or을 사용해서 status가 "A" 혹은 "D"인 쿼리의 실행계획 표시
    db.inventory.find({$or:[{"status": "A"}, {"status":"D"}]}).explain()
    db.inventory.find({"status": {$in: ["A","D"]}}).explain()
    
$or에서 $text를 사용하려면 $text는 기본적으로 text Index를 설정한 항목만 검색하므로 $or에서 질의하는 모든 대상에 text index를 걸어야 합니다.
    
    사용예 - description에 text index를 설정
    db.inventory.createIndex( { description: "text" } )
    사용예 - Conceal text를 가진 항목을 질의해옵니다. 질의됨 (index안걸면 검색 자체가 안되거나 아예 textindex가 없으면 오류나요)
    db.inventory.find({$text: {$search: "Conceal"}})
    사용예 - Conceal text를 가진 항목 또는 qty가 25인 값을 가진 document를 질의 합니다.
    db.inventory.find({$or: [{$text: {$search: "Conceal"}}, {qty: 25}]})
    사용예 - $text는 2개 이상 쓸 수 없습니다.
    db.inventory.find({$or: [{$text: {$search: "Conceal"}}, {$text: {$search: "nononono"}}]})

$or을 사용하는 질의문에 sort는 2.6이전엔 index를 타지 않았지만 2.6이후부터는 설정된 index를 사용해서 sort합니다.
    
    db.inventory.createIndex({qty: 1});
    사용예 - sort할때 index를 써서 sort하는 것을 어떻게 아는지 그것에 대해서는 방법을 잘...모르겟습니다.
    db.inventory.find({$or: [{qty: 25}]}).sort().explain();
    
#### $and
$and는 여러개의 식을 만족하는 Document를 질의 합니다. 그리고 short-circuit evaluation를 사용하는데 short-circuit evaluation란 A랑 B의 조건이 존재하는데 A가 false일 경우 b를 평가하지 않는 형태를 뜻합니다.

$and를 사용할 수 도 있지만 ","도 And를 뜻합니다.

    사용법
    { $and: [ { <expression1}, { <expression2}, ... , { <expressionN} ] }
    사용 예 - qty가 30보다 작거고 status가 "D"인 document를 반환합니다. qty가 30보다 작은 필드는 아예 status가 D인것에 대한 평가를 하지 않습니다. 
    db.inventory.find({$and: [{"qty":{$lt:30}}, {"status": "D"}]})
    { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267889"), "item" : "mousepad", "qty" : 25, "tags" : [ "gel", "blue" ], "size" : { "h" : 19, "w" : 22.85, "uom" : "cm" } }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dba"), "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D" }
    { "_id" : ObjectId("58f594155ba58f30159359c6"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    사용예 - qty가 25이고 status가 A인 document를 질의합니다.
    db.inventory.find({"qty":25, status:"A"})
    사용예 - item이 journal이거나 item이 paper이고 status가 D이거나 qty가 100보다 작은 document를 구합니다.
    db.inventory.find( {
        $and : [
            { $or : [ { item : "journal" }, { item : "paper" } ] },
            { $or : [ { status : "D" }, { qty : { $lt : 100 } } ] }
        ]
    } )
 
#### $not
$not은 <opterator-expression>에 맞지 않는 document를 검색합니다. 또한 <field>에 값이 존재 하지 않은 것도 검색합니다.

    사용법
    {<field>: {$not: {<operator-expression>}}}
    사용예 - status가 A가 아니고 그것의 NOT논리식에 해당하는 Document를 질의 합니다. (즉 status가 "A")인것을 질의하라 라는 뜻입니다.
    > db.inventory.find({status : {$not: {$ne: "A"}}})
    { "_id" : ObjectId("58f9b71172d589d168a5e11e"), "title" : "Whatever you do, make it pay.", "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A", "description" : "My power flurries through the air into the ground" }
    { "_id" : ObjectId("58f9b71172d589d168a5e11f"), "title" : "Step by step goes a long way.", "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "spring", "yellow" ], "status" : "A", "description" : "태양이 떠오를때에 나는 여기 서있을거야" }

$not은 $regex연산자를 지원하지 않습니다. 하지만 //를 사용해서 정규식에 해당하는 document를 가져 올 수 있습니다.
    
    > db.inventory.find( { item: { $not: /^p.*/ } } )
    { "_id" : ObjectId("58f9b71172d589d168a5e11e"), "title" : "Whatever you do, make it pay.", "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A", "description" : "My power flurries through the air into the ground" }
    { "_id" : ObjectId("58f9b71172d589d168a5e11f"), "title" : "Step by step goes a long way.", "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "spring", "yellow" ], "status" : "A", "description" : "태양이 떠오를때에 나는 여기 서있을거야" }
    { "_id" : ObjectId("58f9b71172d589d168a5e123"), "title" : "The best and most beautiful things in the world cannot be seen of even touched. ", "item" : "mask", "qty" : 10, "size" : { "h" : 5, "w" : 2.4, "uom" : "cm" }, "tags" : [ "cold", "white" ], "status" : "C", "description" : "내 안에 휘몰아치는 바람은 폭풍처럼 울부짖어" }

$not은 배열 비교시 문제가 발생 할 수 있다고 하는데 간단한 배열 비교는 이상없이 됩니다. 차후 문제되는 형태가 발생시 재 정리 하도록 하겠습니다.

    > db.inventory.find({"tags": {$not: {$ne: ["pal", "black"]}}})
    { "_id" : ObjectId("58f9b71172d589d168a5e121"), "title" : "To know is nothing at all to imagine is everything.", "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "tags" : [ "pal", "black" ], "status" : "C", "description" : "사람들이 뭐라고 하든지" }

#### $nor
$nor은 하나 이상의 쿼리식 배열에 논리식 NOR을 수행합니다.

    사용법
    {$nor: [{<expression1>}, {<expression2>}, ... {<expressonN}]}
    사용예 - item이 journal이 아닌 값을 가지고 qty가 100이 아닌 값을 가진 document, item이 journal이 아니면서 qty값이 없는 document, item이 없고 qty가 100이 아닌 document, item, qty가 존재하지 않는 document를 검색합니다.
    > db.inventory.find({$nor: [{item: "journal"}, {"qty": 100}]})
    { "_id" : ObjectId("58f9b71172d589d168a5e11f"), "title" : "Step by step goes a long way.", "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "spring", "yellow" ], "status" : "A", "description" : "태양이 떠오를때에 나는 여기 서있을거야" }
    { "_id" : ObjectId("58f9b71172d589d168a5e121"), "title" : "To know is nothing at all to imagine is everything.", "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "tags" : [ "pal", "black" ], "status" : "C", "description" : "사람들이 뭐라고 하든지" }
    { "_id" : ObjectId("58f9b71172d589d168a5e122"), "title" : "The winds and waves are always on the side of the ablest navigators.", "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "tags" : [ "funny", "white" ], "status" : "D", "description" : "Conceal, don't feel, Don't let them know" }
    { "_id" : ObjectId("58f9b71172d589d168a5e123"), "title" : "The best and most beautiful things in the world cannot be seen of even touched. ", "item" : "mask", "qty" : 10, "size" : { "h" : 5, "w" : 2.4, "uom" : "cm" }, "tags" : [ "cold", "white" ], "status" : "C", "description" : "내 안에 휘몰아치는 바람은 폭풍처럼 울부짖어" }

$nor에서 존재하지 않은 값을 검색하고 싶지 않다면 $exists를 사용할 수 있습니다.

    사용예 - Item이 journal이 아니고 qty가 100이 아닌 document를 검색합니다.
    > db.inventory.find({$nor: [{item: "journal"}, {item: {$exists: false}}, {"qty": 100}, {"qty": {$exists: false}}]})
    { "_id" : ObjectId("58f9b71172d589d168a5e11f"), "title" : "Step by step goes a long way.", "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "spring", "yellow" ], "status" : "A", "description" : "태양이 떠오를때에 나는 여기 서있을거야" }
    { "_id" : ObjectId("58f9b71172d589d168a5e121"), "title" : "To know is nothing at all to imagine is everything.", "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "tags" : [ "pal", "black" ], "status" : "C", "description" : "사람들이 뭐라고 하든지" }
    { "_id" : ObjectId("58f9b71172d589d168a5e122"), "title" : "The winds and waves are always on the side of the ablest navigators.", "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "tags" : [ "funny", "white" ], "status" : "D", "description" : "Conceal, don't feel, Don't let them know" }
    { "_id" : ObjectId("58f9b71172d589d168a5e123"), "title" : "The best and most beautiful things in the world cannot be seen of even touched. ", "item" : "mask", "qty" : 10, "size" : { "h" : 5, "w" : 2.4, "uom" : "cm" }, "tags" : [ "cold", "white" ], "status" : "C", "description" : "내 안에 휘몰아치는 바람은 폭풍처럼 울부짖어" }


#### Element 질의 연산자

#### $exists
Boolean값이 true일경우 null값을 포함한 필드가 존재하는 모든 도큐먼트를 검색합니다.

    사용법(문법)
    { field: { $exists: <boolean> } }
    사용예 - day 필드가 있는 모든 Document를 검색
    > db.inventory.find({day: {$exists: true}})
    { "_id" : ObjectId("58fdcf722ea9ef90ca0aac1f"), "title" : "Whatever you do, make it pay.", "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A", "description" : "My power flurries through the air into the ground", "day" : null }
    { "_id" : ObjectId("58fdcf722ea9ef90ca0aac20"), "title" : "Step by step goes a long way.", "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "spring", "yellow" ], "status" : "A", "description" : "태양이 떠오를때에 나는 여기 서있을거야", "day" : 5 }
    { "_id" : ObjectId("58fdcf722ea9ef90ca0aac22"), "title" : "To know is nothing at all to imagine is everything.", "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "tags" : [ "pal", "black" ], "status" : "C", "description" : "사람들이 뭐라고 하든지", "day" : null }
    { "_id" : ObjectId("58fdcf722ea9ef90ca0aac23"), "title" : "The winds and waves are always on the side of the ablest navigators.", "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "tags" : [ "funny", "white" ], "status" : "D", "description" : "Conceal, don't feel, Don't let them know", "day" : null }
    사용예 - day 필드가 존재하지 않는 Document를 모두 검색
    > db.inventory.find({day: {$exists: false}})
    { "_id" : ObjectId("58fdcfed205205343053a481"), "title" : "All fortune is to be conquered by bearing it.", "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ "cotton", "blue" ], "status" : "B", "description" : "No right, No wrong, No rules for me" }
    { "_id" : ObjectId("58fdcfed205205343053a484"), "title" : "The best and most beautiful things in the world cannot be seen of even touched. ", "item" : "mask", "qty" : 10, "size" : { "h" : 5, "w" : 2.4, "uom" : "cm" }, "tags" : [ "cold", "white" ], "status" : "C", "description" : "내 안에 휘몰아치는 바람은 폭풍처럼 울부짖어" }

#### $type
field의 $type의 값이 <BSON type number>인 모든 Document를 검색합니다. array같은 경우 현재 필드가 array인 것을 찾지 않습니다. 다만 하위에 array값을 갖는 항목만을 반환합니다.

<Bson type number>나 <String alias>는 [여기](https://docs.mongodb.com/manual/reference/operator/query/type/#document-type-available-types)를 참고하세요.


    사용법(문법)
    { field: { $type: <BSON type number> 또는 <String alias> } }
    사용예 - zipCode가 문자열인 모든 Document를 검색.
    > db.inventory.find({zipCode: {$type : 2}})
    { "_id" : ObjectId("58fdd13a6351a8ef68549e6c"), "title" : "Whatever you do, make it pay.", "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "tags" : [ "cotton", "red" ], "status" : "A", "description" : "My power flurries through the air into the ground", "day" : null, "zipCode" : "939374" }
    사용예 - tags에 array값이 존재하는 document를 검색합니다.
    > db.inventory.find({"tags": {$type: 4}})
    { "_id" : ObjectId("58fdd354c3e73bb82e97f5bd"), "title" : "All fortune is to be conquered by bearing it.", "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "tags" : [ [ "yeah" ], [ "park" ] ], "status" : "B", "description" : "No right, No wrong, No rules for me", "zipCode" : NumberLong(8939839) }
    >
    

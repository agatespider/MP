# Query Document

## <a name='synopsis'>개요</a>
이번 장에서는 몽고디비에서 사용하는 여러 오퍼레이션에 관해서 알아보도록 하겠습니다. 
 
## <a name='insertSample'>샘플 데이터 저장</a>

    db.inventory.insertMany( [
       { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, "tags" : [ "cotton", "red" ], status: "A" },
       { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, "tags" : [ "cotton", "yellow" ], status: "A" },
       { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, "tags" : [ "cotton", "blue" ], status: "B" },
       { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, "tags" : [ "cotton", "black" ], status: "C" },
       { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, "tags" : [ "cotton", "white" ], status: "D" }
    ]);
    
## <a name='search'>조회</a>

### 전체 데이터 조회
    
    표현식
    db.inventory.find({})
    db.inventory.find()
    사용예 - 모든 document를 찾는다.
    db.inventory.find({})
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }

### "같다" 라는 질의 표현
":"를 사용해서 조건에 field와 value가 같은지 조건을 걸수 있습니다.

    표현식 
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

    조건식
    { $or: [ { <expression1}, { <expression2}, ... , { <expressionN} ] }
    사용예 - qty가 30보다 작거나 또는 status가 "D"인 document를 반환합니다. 
    db.inventory.find({$or: [{"qty":{$lt:30}}, {"status": "D"}]})
    { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
    { "_id" : ObjectId("58ee0f9cd41ac54b19267889"), "item" : "mousepad", "qty" : 25, "tags" : [ "gel", "blue" ], "size" : { "h" : 19, "w" : 22.85, "uom" : "cm" } }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
    { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dba"), "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D" }
    { "_id" : ObjectId("58f594155ba58f30159359c6"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
    
#### $and

    조건식
        { $or: [ { <expression1}, { <expression2}, ... , { <expressionN} ] }
        사용예 - qty가 30보다 작거나 또는 status가 "D"인 document를 반환합니다. 
        db.inventory.find({$or: [{"qty":{$lt:30}}, {"status": "D"}]})
        { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
        { "_id" : ObjectId("58ee0f9cd41ac54b19267889"), "item" : "mousepad", "qty" : 25, "tags" : [ "gel", "blue" ], "size" : { "h" : 19, "w" : 22.85, "uom" : "cm" } }
        { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
        { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D" }
        { "_id" : ObjectId("58ef4d8d0b3b0e2580e62dba"), "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D" }
        { "_id" : ObjectId("58f594155ba58f30159359c6"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }

#### $not

#### $nor
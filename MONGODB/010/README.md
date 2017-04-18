# 몽고디비 CRUD 연산 - Query on Embedded / Nested(중첩) Document

## <a name='synopsis'><a name='synopsis'>개요</a>
이번 페이지에선 embedded/nested document를 db.collection.find()메소드를 몽고쉘에서 사용하는 예제를 제공합니다. 예제는 inventory clollction을 사용합니다. 아래 예제를 inventory collection에 등록 할 수 있습니다.
 
## 샘플 등록

    db.inventory.insertMany( [
       { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
       { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
       { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
       { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
       { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
    ]);
    
## Match an Embedded/Nested Document
embedded/nested document에서 필드가 같은지 조건을 정의하려면 {<field>:<value>}을 사용할 수 있습니다. <value>는 비교 대상 document입니다.
     
예를 들어 다음 쿼리는 size field가 {h:14, w:21, uom: "cm"}인 모든 document를 질의하는 예제입니다.
      
      > db.inventory.find( { size: { h: 14, w: 21, uom: "cm" } } )
      { "_id" : ObjectId("58ee0f9cd41ac54b19267887"), "item" : "journal", "qty" : 25, "tags" : [ "blank", "red" ], "size" : { "h" : 14, "w" : 21, "uom" : "cm" } }
      { "_id" : ObjectId("58ef4d8d0b3b0e2580e62db7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
      { "_id" : ObjectId("58f594155ba58f30159359c6"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A" }
      
equal 매칭은 <value>의 값이 되는 document의 필드 순서 및 이름이 동일 해야 합니다. 예를 들어 다음의 쿼리를 통해 매칭되는 데이터가 없는 것을 확인 할 수 있습니다. 

    > db.inventory.find(  { size: { w: 21, h: 14, uom: "cm" } }  )
    >

    
    
    
    
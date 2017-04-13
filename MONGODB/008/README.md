# 몽고디비 CRUD 연산 - INSERT

## <a name='synopsis'><a name='synopsis'>개요</a>
이번장에선 몽고디비안에서 insert에 대해서 알아보도록 하겠습니다.

참고로 collection이 존재하지 않더라고 insert 연산이 발생하는경우 자동으로 collection이 생성이 됩니다.

## <a name='toc'><a name='toc'>목차</a>

  1. [Insert a Single Document](#iasd)
  1. [Insert a Multiple Document](#iamd)
  1. [Insert Behiver](#ib)
  1. [Insert Method](#im)

## <a name='iasd'><a name='iasd'>Insert a Single Document</a>
db.collection.insertOne()은 collection에 하나의 document를 삽입합니다.

아래의 예제는 inventory collection에 새로운 도큐먼트를 insert하는 예제입니다. 만약 document에 _id필드가 정의되지 않으면, 몽고디비는 ObjectId 값을 새로운 도큐먼트에 _id필드에 넣습니다. 자세한건 [insert Behavior](https://docs.mongodb.com/manual/tutorial/insert-documents/#write-op-insert-behavior)를 참고하세요.

    db.inventory.insertOne({ item: "canvas", qty: 100, tags: ["cotton"], size: {h: 28, w: 35.5, uom: "cm"} });

[insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)은 새로운 _id필드가 들어있는 document를 반환합니다. 예제에선 document를 반환합니다.

방금 저장한 document는 검색할 수 있습니다.

    > db.inventory.find( { item: "canvas" } )
    { "_id" : ObjectId("58ee0c97d41ac54b19267886"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
    
## <a name='iamd'><a name='iamd'>Insert a Multiple Document</a>
db.collection.insertMany() collection안에 여러게의 document들을 삽입 할 수 있습니다. insertMany()안에 array형태의 값을 전달해서 사용할 수 있습니다.
   
아래 예제는 3개의 새로운 Document를 inventory collection에 저장하는 예제입니다. 만약 document에 _id field가 없으면 자동적으로 Object값으로 _id값을 추가해서 document를 삽입해줍니다.

    > db.inventory.insertMany([
       { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
       { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
       { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
    ])
    {
            "acknowledged" : true,
            "insertedIds" : [
                    ObjectId("58ee0f9cd41ac54b19267887"),
                    ObjectId("58ee0f9cd41ac54b19267888"),
                    ObjectId("58ee0f9cd41ac54b19267889")
            ]
    }

[insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)는 _id field를 가지고 있는 새로운 Document들을 반환 합니다.

삽입한 도큐먼트를 검색할 수 있습니다.

    db.inventory.find( {} )

## <a name='ib'><a name='ib'>Insert Behiver</a>

#### Collection Creation
만약 collection이 존재하지 않을때 insert 연산은 collection을 생성합니다.
 
#### _id Field
몽고디비안의 각각의 collection안의 Document들은 유니크한 _id field를 필수로 가지고 있어야 합니다. primary key같은 것입니다. 만약 _id field가 빠진 document가 삽입되었으면 몽고디비드라이버가 자동적으로 ObjectId값을 갖는 _id field를 생성합니다.

이것은 upsert:true를 사용하는 update 실행에서도 동일하게 동작합니다.

#### Atomicity
몽고디비 안에서 쓰는 모든 쓰는 작업은 Single Document의 레벨위에서 원자성을 가집니다. 몽고디비의 atomicity에 관해서는 [Atomicity and Transactions](https://docs.mongodb.com/manual/core/write-operations-atomicity/)를 참고하세요.

#### Write Acknowledgement
Write concerns을 사용하면 몽고디비에서 쓰기 요청에 대한 작업의 보장 레벨을 정할 수 있습니다. [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/)
 
관련항목

  1. [db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)
  1. [db.collection.insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)
  1. [Additional Methods for Inserts](https://docs.mongodb.com/manual/reference/insert-methods/#additional-inserts)

## <a name='im'><a name='im'>Insert Method</a>
몽고디비는 collection안에 document를 저장하는것을 위한 메소드를 다음과 같이 제공합니다.
 
  1. db.collection.insertOne() : single document를 collection에 insert합니다.
  1. db.collection.insertMany() : multiple document를 collection에 insert합니다.
  1. db.collectino.insert() : single or multiple document를 collection에 insert합니다.

#### Insert를 위해 추가된 메소드
다음과 같은 메소드도 Collection에 새로운 Document를 삽입할 수 있습니다.
 
  1. db.collection.update() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.updateOne() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.updateMany() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.findAndModify() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.findOneAndUpdate() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.findOneAndReplace() upsert:true 옵션 사용시 insert합니다.
  1. db.collection.save().
  1. db.collection.bulkWrite().
 
## 정리

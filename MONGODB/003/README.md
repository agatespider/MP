# Capped Collection

* 개요
* 특징
* capped collection 생성하기
* capped collection 쿼리
* capped collection 확인 방법
* collection을 capped collection으로 변환하기
* 설정한 기간 후 자동으로 데이터 제거
* tailable cursor
* 정리

## 개요
몽고디비의 일반적인 Collection은 동적으로 생성이 되고 추가적인 데이터 크기에 맞춰서 자동으로 크기가 늘어 납니다. 하지만 Capped Collection이라는게 있는데 이것은 미리 생성을 해야하며 크기도 고정이 됩니다.

만약 가득찬 Capped Collection에 Document를 삽입하면 어떤 결과가 발생할까요? Capped Collection은 Circular queue처럼 용량이 꽉 찾는데 거기에 Document를 삽입시 가장 오래된 Document를 덮어 씁니다.

즉 Capped Collection은 삽입순서에 따라 Document를 삽입하고 삽입순서대로 검색하는 업무가 많은 작업에 특화된 고정크기를 갖는 Collection이라고 볼 수 있습니다.
        
## 특징

1. Capped Collection은 Insert순서대로 Document반환하기 때문에 별도 순서를 지정하는 Index가 필요 없습니다.        

2. 자동으로 가장 오래된 Document를 제거 합니다.

3. 기본적으로 _id와 _id index가 존재합니다.

4. 만약에 capped collection에 document를 수정하려고 한다면 update가 collection scan이 필요하지 않도록 index를 작성해야 합니다.(?)

5. update나 replacement작업으로 document size가 변경되면 오류를 발생시킵니다.

6. capped collection의 document는 삭제가 불가능합니다. document를 제거하려면 drop으로 collection을 완전 삭제하고 다시 삭제할 document를 제외한 값을 가진 collection을 새로 만들어야 합니다.

7. cappend collection은 샤딩을 할 수 없습니다.

8. natural ordering을 사용하면 가장 최근에 삽입된 요소를 효율적으로 검색이 가능합니다. log파일의 tail과 유사합니다.

9. aggration pipeline의 $out은 cappend collection에서 사용이 불가능 합니다.

10. capped collection을 생성시 크기나, Document갯수를 설정 할 수는 있지만 데이터가 오래된 순서로 지워지는 것은 제어가 불가능하다.

## capped collection 생성하기
db.createCollection()메소드를 사용해서 명시적으로 capped collection을 생성 할 수 있습니다.

capped collection을 생성할때 미리 할당할 collection의 최대크기를 바이트단위로 지정해야 합니다. 그리고 설정한 collection의 크기는 내부 오버헤드를 위한 공간이 추가적으로 포함이 됩니다.

    //log라는 collection을 100000바이트 + @크기만큼 생성합니다.
    db.createCollection( "log", { capped: true, size: 100000 } )
    {"ok" : 1}
    
만약 크기가 4096byte이하이면 그냥 4096 바이트로 설정합니다. 또한 max속성을 통해서 document의 최대수를 지정할 수도 있습니다. max는 보통 최근 10개 기사를 보관하거나 특정 문서의 갯수를 제한 할때 사용 할 수 있습니다.

    db.createCollection("log", { capped : true, size : 5242880, max : 5000 } )
    {"ok" : 1}
    
Capped Collection의 size인수는 필수 입니다. 만약 document 최대수에 도달하기전에 최대 크기 제한에 도달하면 이전 document를 제거하고 덮어 씁니다.    

## capped collection 쿼리
정렬을 하겟다고 선언을 하지 않고 find를 수행해도 capped collection은 삽입 순서대로 검색합니다.
        
삽입순서의 반대로 문서를 검색하려면 .sort( { $natural: -1 } )를 넣어주면 됩니다.

    db.cappedCollection.find().sort( { $natural: -1 } )
    
## capped collection 확인 방법
capped collection인지 확인하려면 isCapped()메서드를 사용하면 됩니다.   
    
    > db.my_collection.isCapped();
    true    
    
## collection을 capped collection으로 변환하기
convertToCapped 명령을 사용하여 capped되지 않은 collection을 capped collection으로 변환 할 수 있습니다.
    
    > db.runCommand({"convertToCapped": "mycollection", size: 100000});
    
        
참고로 이 변환작업은 전역적으로 쓰기 lock을 걸어버립니다. 즉 작업이 끝날때 까지 모든 작업을 중지 시킵니다.
        
## 설정한 기간 후 자동으로 데이터 제거
TTL인덱스를 통해서 데이터의 만료 정책을 설정 할 수 있습니다. 

## tailable cursor
capped collection과 함께 tailable cursor를 사용 할 수 있습니다.
 
linux나 unix의 tail -f 명령어처럼 이 tailable cursor는 capped collection의 마지막을 바라보고 있습니다.

만약 새로운 document가 capped collection에 삽입이 되면 tailable cursor를 사용해서 새로 추가된 document를 검색 할 수 있습니다.
        
## 정리

capped collection에 관해서 알아보았습니다. 고정형사이즈에 자동으로 index를 걸어주며 특징은 큐처럼 삽입한 데이터를 순서대로 출력할때 가장 빠른 성능을 보입니다.

아마도 큐처럼 사용하기 위해서 만들었나? 생각이 듭니다.

다음장은 Document에 관해서 설명하도록 하겠습니다.
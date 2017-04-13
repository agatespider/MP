/**
 * Created by Administrator on 2017/04/13.
 */

// mongoDB 모듈의 mongoClient 요청 및 MongoClient에 할당
var MongoClient = require('mongodb').MongoClient;

// 접속할 mongodb 설정 정보 변수에 할당
var connectionUrl = 'mongodb://localhost:27017/myproject',  // db 접속정보
    sampleCollection = 'chapters';  // collection 정보

// mongodb에 삽입할 데이터
var chapters = [{
    'Title': 'Snow Crash',
    'Author': 'Neal Stephenson'
},{
    'Title': 'Snow Crash',
    'Author': 'Neal Stephenson'
}];

// 정보를 통해 몽고디비 접속
MongoClient.connect(connectionUrl, function(err, db) {
    console.log("Connected correctly to server");

    // collection을 구해서 할당한다.
    var collection = db.collection(sampleCollection);

    collection.insertMany(chapters, function(error, result) {
        // 삽입 완료된 데이터를 받아서 출력
        if(!error) {
            console.log("Success :"+result.ops.length+" chapters inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        db.close();
    });
});
# 초기 작업

## 1. DB 생성 및 유저 생성/권한

### 1.1 DB생성
    create database DB_EXAMPLE001;

### 1.2 유저생성
    create user 'mp'@'%' identified by '1234';

### 1.3 모든 권한 설정 
    grant all privileges on *.* to 'mp'@'%';

### 1.4 DB 사용 권한 설정
    grant all privileges on DB_EXAMPLE001.* to 'mp'@'%';


# 화면 응답시간 분석 및 HTTP 이해, 모니터링 도구

웹기반 시스템에서 HTML, CSS, JS, IMAGE등 웹 구성요소를 다운로드해서 화면을 구성하는데 어플리케이션 수행 시간외에 응답시간에 영향을 끼치는 요소들이 많다.

예를 들자면 동일한 화면이라도 브라우저의 종류, PC의 사양, 사용하는 네트워크의 종류, 서버와의 물리적인 거리에 따라서 응답시간 차이가 발생하게 된다.

즉 응답시간을 분석을 하려면 한가지가 아닌 전체적인 상황을 보고 분석을 해야한다.

그리고 웹기반시스템에서 가장 기본적인 HTTP에 대해서 알아야 한다.
 
## 1. 화면 응답시간 분석 중점 항목
 
### 1.1 처리시간 상세 분석
1. 화면 렌더링: 화면을 그리거나 화면 구성 컨텐츠를 로딩하는데 얼마나 걸리는지 확인.
2. 로컬 로직: 화면 렌더링 외에 Javascript에서 수행되는 로직은 얼마나 걸리는지 확인.
3. 서버 처리: 서버 Application의 수행시간은 얼마나 걸리는지 확인.
4. 네트워크: 네트워크 전송 품질은 양호한지 확인. 리소스(HTML, JS, CSS등)크기들이 커서 전송시간에 오래 걸리는지 확인.
5. 리소스: HTML, CSS, JS등 리소스들의 콘텐츠 수를 줄일 수 있는지 확인.
6. 캐시: 어떤 종류의 캐시를 사용하는지 확인하고 캐시가 잘 동작하는지 확인.
7. 병렬/비동기: 서버 요청의 구조를 변경이 가능한지 확인.
8. 사용환경: 사용자들의 PC환경이 다양한지 확인, 로컬 로직에 logging이 있는지 확인.

## 2. HTTP(HyperText Transfer Protocol) 이해
HTTP는 WWW(World Wide Web)상에서 데이터를 주고 받을 수 있도록 개발된 프로토콜이며 1999년에 개발된 1.1버전이 많이 사용되고 있다.

현재는 클라이언트화면과 서버간의 통신에 많이 사용되는데 통신전문이 HTML이 아니더라도 HTTP를 사용하는 경우가 흔하다. 그래서 응답시간을 분석하려면 HTTP의 기본 동작 방식을 이해해야 한다.
 
### 2.1 HTTP 구조
HTTP는 클라이언트(브라우저)와 서버(웹 서버)간의 요청/응답 구조를 띈 프로토콜이다. 즉 1:1 구조를 띄고 있어서 한 화면을 구성하는 컨텐츠가 100개면 요청/응답이 100번이 일어나는 것이 된다.
 
HTTP 요청/응답은 모두 Header와 Body로 구성되어 있다. Header는 HTTP정의에 따른 처리 대상, 처리 결과 코드, 브라우저, 웹 서버 정보, 데이터 처리를 위한 각종 속성정보가 있다. 그리고 요청시 POST가 아닌 GET일 경우 Body는 없다.

Header의 속성 구분자로 CRLF를 사용한다. 2Byte를 차지하며 \r(16진수: 0D)와 \n(16진수: 0A)로 구성 되어 있다. 그리고 Header가 끝나는 부분은 CRLF가 2번 사용되서 4Byte로 구성이 된다.

![fiddlerHex](https://github.com/agatespider/MP/blob/master/PERFORMANCE/006/img/httphex.PNG)

### 2.2 HTTP 요청
요청은 크게 Header와 body로 나뉘고 Header는 Request Header와 MIME Header로 나뉘어 진다.

#### 2.2.1 Request Header
Request Header는 요청 대상(URI)정보가 들어가 있다.

    POST /board/list.html HTTP/1.1
    ------------------------------
    POST: 요청방식
    /board/list.html: URI
    HTTP/1.1: HTTP 버전
    
##### 2.2.1.1 요청방식
요청방식으로는 8가지가 있는데 GET과 POST가 주로 사용이 된다.

GET, POST, HEAD, DELETE, TRACE, OPTIONS, PUT, CONNECT

##### 2.2.1.2 URI
URI(Uniform Resource Identifier)는 웹 서버에서 대상을 유일하게 식별 할 수 있는 주소로써 보통 컨텐츠 위치와 명칭을 가르킨다. 위치는 서버 파일시스템의 절대 경로가 아닌 웹 서버 Document Root를 기준으로 한 상대 위치이다.

##### 2.2.1.3 사용 HTTP 버전
1.1버전을 사용하며 1.0과 1.1의 차이는 검색해서 살펴보기 바란다. 이젠 1.1을 사용하기에 차이를 알 필요는 없을지 모르지만 알아둬서 나쁠 것은 없다고 생각을 한다.

##### 2.2.1.4 MIME Header
MIME(Multipurpose Internet Mail Extensions)은 원래 전자 우편의 인코딩 방식을 설명하는 표준 포맷이다. 이것이 생긴 이유는 전자 우편 전송 프로토콜인 SMTP는 7bit의 ASCII문자만을 지원한다. 즉 7bit ASCII문자가 아닌 다른 문자들은 제대로 전송 할 수 없다는 뜻이 된다.

MIME은 7bit이상의 ASCII문자들이 아닌 다른 문자로된 전자 우편을 보내기 위해서 만들어지게 되었다. 이제는 전자우편뿐만 아니라 HTTP를 통해 여러 형태의 파일을 전송하는데에 MIME이 사용되고 있다.

MIME 헤더 정보는 "명칭:값" 형태로 이루어져 있다.

    Accept-Encoding: gzip, deflate
    ---------------  -------------
    명칭              값
    
##### 2.2.1.5 HTTP MIME 헤더
참고: [MIME List of HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)

##### 2.2.1.7 쿠키
Cookie는 HTTP표준은 아니지만 대부분의 브라우저가 지원을 한다. 서버 요청간에 공유해야할 정보를 쿠키를 통해 브라우저에 저장하면 해당 브라우저는 해당 도메인에 요청을 보낼 때마다 쿠키정보를 함께 보낸다.
 
대신 브라우저단 쿠키의 갯수나 크기 제약이 있으니 확인을 해야하며 만약 쿠키 정보가 브라우저가 지원하는 용량을 초과 할 경우 정보가 잘려서 요청이 가게 되므로 생각지 못한 오류가 발생할 수 있다.

### 2.3 HTTP 응답
HTTP 응답은 Header와 Body로 나뉘고 Header는 Response Line과 Mime헤더로 나뉜다.

#### 2.3.1 응답 라인

    HTTP/1.1 200 OK
    ---------------
    HTTP/1.1: HTTP 버전
    200 OK: 응답 코드 및 코드명
    
참고: [응답코드](https://ko.wikipedia.org/wiki/HTTP_%EC%83%81%ED%83%9C_%EC%BD%94%EB%93%9C)

참고: [MIME List of HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)

### 2.4 데이터 송수신
HTTP를 사용하고 본문이 없는 요청/응답일경우 CRLF가 2번 연속 반복될 때까지 전문을 읽으면 된다. 만약 본문이 있을 경우는 Context-Length나 Chunked 방식에 따라 본문 크기를 확인하고 데이터를 읽는다.
 
#### 2.4.1 Context-Length 방식
헤더의 Context-Length에 본문의 크기를 바이트 단위로 기록해서 수신 측에서 본문의 크기를 알 수 있게 하는 방식이다. 이 방식은 정적 컨텐츠와 같이 HTTP 헤더 정보를 만드는 시점에 본문 전체 크기를 알 수 있을때 사용한다.
 
    [Context-Lenght 방식 예]
    Content-Encoding: gzip
    Content-Length: 21021
    Connection: close
    
#### 2.4.2 Chunked 방식
Chunked방식은 헤더의 Transfer-Encoding이 chunked값을 가지고 있으며 HTTP 헤더 생성 시점에 본문의 크기를 알 수 없을 경우에 사용한다.
    
JSP경우 어플리케이션이 수행되면서 HTTP응답이 생성되는데 송신버퍼 8KB크기가 채워지면 네트워크로 응답을 보낸다. 그런데 이 시점에도 어플리케이션이 계속 수행 중이면 응답이 더 만들어지는데 이럴 경우 Chunked 방식이 사용된다.

    HTTP/1.1 200 OK
    Server: nginx
    Date: Mon, 20 Mar 2017 07:31:59 GMT
    Content-Type: text/html; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Content-Encoding: gzip
    
    14
    fsdafsadfsfas                
    0

수신측은 블록 크기가 0일때까지 반복하고 블록의 크기는 16진수이며 뒤에 CRLF가 붙어 있는 형태다
    
### 2.5 모니터링 도구

#### 2.5.1 Fiddler
Proxy방식으로 HTTP모니터링을 수행한다. 따라서 네트워크를 거치지 않는 브라우저 캐시 처리는 모니터링 되지 않는다.

#### 2.5.2 Dynatrace AJAX Edition
브라우저 응답시간 분석도구로서 Javascript, 렌더링, HTTP 요청/응답을 분석 가능한 도구.(IE, Firefox)

#### 2.5.3 Visual Round Trip Analyzer
MS에서 제공하는 웹페이지 성능 분석 도구, 네트워크 패킷 기반의 분석을 제공하며 wireShark와 함께 사용 가능하다. 사용시 .net framework와 netmon도 함께 설치 해야한다.

#### 2.5.4 HttpWatch
브라우저 plug-in형태로 HTTP를 모니터링 한다. 브라우저 내부 캐시동작도 모니터링한다. 브라우저 내부동작과 컨텐츠에 대한 세부적인 정보는 상용도구에서만 사용이 가능하다.

#### 2.5.5 FireBug
Firefox전용 툴로 애드온 형태로 동작하며 스크립트 디버그, DOM탐색등 여러 추가 기능을 제공한다.

#### 2.5.6 IE 개발자 도구
IE9이후부터 내장된 도구로 HTTP네트워크 모니터링과 디버그, DOM탐색등의 기능을 제공한다.

#### 2.5.7 Chrome 개발자 도구
크롬에 내장된 도구로 Firebug나 IE개발자 도구랑 비슷한 역할을 한다.

### 2.6 HTTP 분석 방안

#### 2.6.1 화면응답시간이 Timeline내에서 표시된 요청의 시간과 같은지 확인.
Javascript나 화면 랜더링 로직등 다른 이유로 응답시간이 저하되는 원인을 찾고 Javascript, HTML 구성을 최적화 해야한다.

#### 2.6.2 TimeLine중 특별히 처리시간이 긴 요청이 존재하는지 확인.
요청시간이 길다면 일반적으로 어플리케이션 처리나 대용량인 컨텐츠에 대한 요청일 가능성이 높다. 이 경우 어플리케이션 로직 또는 대용량 컨텐츠의 제거나 압축방식을 고려해야한다.

#### 2.6.3 각 요청들의 처리시간은 짧지만 요청수 자체가 많은지 확인.
요청수로 인해서 응답시간이 오래 걸린다면 화면 구성이나 JS, CSS의 불필요한 요소를 제거하거나 통합또는 요청한 컨텐츠를 일정 시간동안 요청하지 않도록 캐시를 사용 할 수 있다.

#### 2.6.4 Timeline상에서 요청 처리 중간 중간 비어있는 긴 시간이 있는지 확인한다.
중간의 빈 시간은 javascript로딩하거나 수행하는 시간이거나 embed object를 로딩하는 케이스인데 이것을 최적화 해야한다.

#### 2.6.5 요청 목록에서 응답코드가 200 OK인지 304 Not Modified인지 확인한다.
캐쉬가 정상적으로 동작하는지 확인한다.

#### 2.6.6 전체가 200 OK일 때 전체 페이즈 크기와 개별 요청의 컨텐츠 크기를 확인한다.
화면의 전체 페이지 크기를 모두 구하고 다른 사이트나 비교 대상인 사이트와의 크기를 비교해서 왜 틀린지 체크하고 개선방안을 마련한다. 
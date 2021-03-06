# 성능 분석

성능 저하가 발생할 경우 "왜? 성능저하가 발생하지?" 이것이 가장 중요 포인트다. 이것을 알면 고칠 수 있기 때문이다.
 
보통 웹서비스인경우 요청하나에 대해서 클라이언트 > 웹서버 > 어플리케이션서버 > 디비서버 등등 여러 서버들을 거치게 된다. 우선적으로 해야 할 것은 각각의 서버에서 서비스처리 응답시간을 체크한다.

경유하는 서버가 매우 많을 경우 각 서버의 응답시간을 모두 측정하긴 힘들다. 그럼 초기엔 어플리케이션 서버와 클라이언트 두곳을 중심으로 분석을 시작한다.

그리고 보통 클라이언트나 네트워크보다는 어플리케이션서버쪽인 경우가 많으므로 이쪽부터 검증해보는게 옳다고 생각한다.

## 1. 어플리케이션 서버 분석
어플리케이션은 내부적으로 웹 서버 처리시간, 어플리케이션의 비지니스 로직 처리시간, DB 처리시간이 존재하고 외부적 연계 처리시간은 ESB를 통한 대내연계 처리시간, FEB를 통한 대외연계 처리시간 등이 존재하며 이런 각각의 내부, 외부의 처리 시간을 분석하기 위해선 3가지 방식이 존재한다.

### 1.1 APM
APM동구를 활용해서 직관적인 데이터를 수집하고 확인할 수 있다. DB이외의 연계 서버에 대한 인터페이스 처리 응답시간을 모니터링 할때는 추가 프로파일링 설정이 필요하기도 하다. 너무 많은 설정이 있으면 APM자체가 성능 저하를 발생하니 주의가 필요하다.

### 1.2 스택수집
주기적인 스택을 수집해 분석한다. 통신 소캣을 사용하거나 스택 하위의 연계 인터페이스 메서드들의 각 구성요소 간의 응답시간을 체크한다.

### 1.3 어플리케이션 로깅
어플리케이션이나 프레임워크에서 각 메소드나 서비스에 대해 로깅을 하고 그것을 분석한다. (java는 Thread local을 사용해서 쉽게 구현 가능)

## 2. 클라이언트 분석
클라이언트는 클라이언트 로직 처리시간, 네트워크 처리시간, 서버 로직 처리시간, DNS룩업 처리시간 4가지며 각각의 처리시간을 통해 어디서 응답시간이 느린지 체크한다.

클라이언트는 실제 문제가 발생하는 클라이언트 PC에서 체크를 해야 확실하며 그렇기에 클라이언트의 환경에 대한 조사나 이해가 필요하다.


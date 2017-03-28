# 통신과 파일의 상태 파악

## 1. File Descriptor
유닉스와 리눅스는 소텟이나 파일을 사용할 때 FD(File Descriptor)라는 것을 사용한다. 이 FD를 조회하면 프로세스가 어떤 서버와 네트워크로 연결 되어있고 어떤 파일을 사용하는지 알 수 있다.

FD는 POSIX계열의 운영체제에서 사용하는 것으로 파일을 접근할때 사용하는 추상 키 같은 역할을 하는 C의 정수(int)형 데이터다.
각 프로세스는 오픈된 파일을 관리하기 위해서 자체적인 파일 지시자 테이블을 관리하고 있으며, 파일 I/O를 발생시킬 때 커널 시스템 콜이 발생햇을때 FD값을 넘겨서 작업을 수행한다.
FD는 파일뿐만아니라 디렉토리, 블록/문자 디바이스, 파이프, 네트워크 소켓, 유닉스 도메인 소켓등에 접근시에도 사용한다. MS윈도우에선 Handle이라는 용어를 사용한다.

    일반적인 OS에 설정된 FD
    STDIN (표준입력): 값은 0
    STDOUT(표준출력): 값은 1
    STDERR(표준오류): 값은 2

### 1.1 FD 정보 수집
유닉스 프로세스의 FD정보는 pfile, lsof명령을 통해서 알 수 있다.

    pfiles 10000
    ...
    - 오픈된상태 -
    100(FD): S_ISREG mode:664 dev:64, 131073 ino:8636 uid:401(파일소유자) gid:400 size:141015(파일크기)
         flags = O_WRONLY|O_LARGEFILE(파일 오픈 모드)
         file  = /logs/weblogic/domain01/was100/nohup/was108.log (파일명)
    ...
    - 네트워크 연결된 소켓 정보 -
    500(FD): S_ISSOCK type=SOCK_STREAM family=AF_INET protocol=PROTO_TCP(프로토콜 종류)
        flags = O_RDWR (소켓 오픈 모드)
        localaddr/port = wasapp01/17008(리스닝포트) (listening)
    ...             
    600(FD): S_ISSOCK type=SOCK_STREAM family=AF_INET protocol=PROTO_TCP(프로토콜 종류)
        flags = O_RDWR (소켓 오픈 모드)
        localaddr/port = wasapp01/33333(로컬서버포트) remaddr/port = DBTEST/1533(원격서버/포트)         
    

### 1.2 통신/파일상태 정보 수집

    lsof -p [pid]를 사용해서 프로세스의 FD목록을 조회 할 수 있다.
    netstat -pan | grep [pid] 를 사용해서 통신 상태 정보를 조회 할 수 있다.
    
### 1.3 FD 설정 확인
운영체제 내부에서 관리하는 파일자 설정 값은 두가지가 존재한다. root가 설정하는 전체 프로세스가 영향을 받는 Hard limit와 사용자별로 언제든지 설정가능한 Soft limit로 나뉜다.

Soft limit값이 무한이라도 Hard limit값이 256이면 프로세스당 파일 지시자는 256개를 넘길 수 없다.

일반적으로 파일지시자를 확인할때 쓰는 명령어 ulimit -a는 Soft limit을 보여주는 명령어이다. 위에 제약사항으로 Hard Limit값을 넘어갈수 없으니 HardLimit값도 확인을 해야한다. 아래는 확인 방법이다.

    명령어
    [Hard limit]
    AIX: ulimit -aH
    HP-UX: ulimit -aH or sysdef, grep maxfiles
    솔라리스: ulimit -aH
    리눅스: sysctl -a | grep fs.file-max
    ------------------------------------------
    [Soft limit]
    AIX: ulimit -aS
    HP-UX: ulimit -aS or sysdef, grep maxfiles_lim
    솔라리스: ulimit -aS
    리눅스: ulimit -a
    
설정 방법은 아래와 같다.
   
    [AIX]
    <전체사용자>
        /etc/security/lmits 파일 안에 noFiles값을 설정 
        OPEN_MAX
        nofiles=<값>
    <사용자별>
        ulimit -n <value>
    [HP-UX]
        sam 도구 사용 - sam이라고 친다
    [솔라리스]
    <전체 사용자>      
        /etc/system 파일
        set rlim_fd_max=<value>
        set rlim_fd_cur=<value>
    <사용자별>
        ulimit -n <value>
    [리눅스]
        /etc/security/limits.conf 파일
        hard nofile <value>
        soft nofile <value>
        
## 2. 통신/파일 간 동작        
앞에서 프로세스가 어떤 함수를 실행하고, 어떤 파일을 열고, 어떤 서버와 연결하고 있는지 확인 하는 방법에 관해서 알아보았다. 하지만 이것만으로는 많이 부족하다.

스택과 통신/파일 상태 정보는 시점에 대한 정보이기 때문에 파일을 계속 열고 있지 않고 순간적으로 여닫는 경우는 잡히지 않을 수도 있고, 읽고 쓰는 횟수와 양도 알 수 없다.

이러한 정보를 얻기 위해선 통신/파일 간에 발생하는 시스템 콜을 모니터링 해야한다.

    시스템콜이란?
    운영체제 커널이 제공하는 서비스를 호출하는 API를 말한다. 운영체게가 제공하는 시스템 콜 서비스 유형은 아래와 같다.
    
    1. 프로세스 제어(Process control)
        프로세스 생성/로드/실행/제거, 메모리 할당/제거, 프로세스 속성 읽기/설정, 시간/신호/대기 이벤트 처리
    2. 파일 조작(File management)
        파일 생성/열기/닫기/삭제, 파일 읽기/쓰기, 파일 속성 읽기/설정
    3. 통신(Communication)
        연결 리스닝/열기/닫기, 데이터 송수신, 연결 제어
    4. 장치 관리(Device management)
        디바이스 열기/닫기, 디바이스 읽기/쓰기, 디바이스 속성 읽기/설정, 디바이스 제어
    5. 정보 관리(Infomation maintenance)
        시간 정보 읽기/설정, 시스템 정보 읽기/설정, 프로세스/디바이스/파일 정보 읽기/설정
    시스템 콜이 수행될때는 user mode에서 kernel mode로 전환되어 수행되고, 끝나면 다시 유저 모드로 전환된다.
    서버 자원 사용량
    
     


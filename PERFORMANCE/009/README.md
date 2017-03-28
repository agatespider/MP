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
    서버 자원 사용량 확인 시 프로세스(CPU) 사용률을 보면 System, User, IO Wait로 나뉘는데, 이때 System이 시스템 콜이 수행되면서 소요된 Processor 사용율에 해당한다.
    
시스템 콜 모니터링하는 방법은 OS마다 틀리다. 하지만 HP-UX에서 tusc와 거의 비슷비슷 하다.
    
    시간정보            PID      스레드ID   함수 및 함수 매개변수                                  수행결과           
    -------------------------------------------------------------------------------------------------
    1364450111.186167 [17031]  [5122472]  write(582, "021d| F  , 20130328 cor".., 181) ..... = 181
    
시스템 콜을 분석할때 아래 사항을 중심으로 분석한다.
    
    스레드 프로그램인 경우 스레드 ID별로 분류해서 분석.
    통신과 파일에 대한 모니터링에서는 FD를 중심으로 분석.
    장애 분석시에는 함수 반환값에 에러가 발생했는지 여부를 확인하고 분석.
    
### 2.1 통신/파일 상태와 동작 연계 분석
통신/파일 I/O를 할경우 FD를 가지고 작업을 한다. 시스템콜에서 FD를 통해 파일의 상태와 동작의 연계 분석을 할 수 있다.

시스템콜을 모니터링하기 전에 연 파일들은 모니터링 결과에서 FD값만 보이기 때문에 어떤 파일인지 알 수 없다. 이때 pfiles같은 명령(linux는 lsof)으로 프로세스의 통신/파일 상태를 조회하면 해당 FD값의 파일명과 추가 정보를 확인 할 수 있다. 물론 소켓 통신도 마찬가지이다.

아래는 nginx가 access.log파일을 엑세스 하고 잇는 정보이며 더 아래 정보는 5번 FD를 시스템 콜 모니터링 화면에서 write를 통해서 작성하고 있는 시스템 콜 모니터링 화면이다.

    lsof -a -p 2580 (2580 프로세스가 액세스 하는 파일 정보
    COMMAND  PID  USER   FD      TYPE             DEVICE SIZE/OFF   NODE NAME
    --------------------------------------------------------------------------------------------
    ... 생략
    nginx   2580 nginx    0u      CHR                1,3      0t0     12 /dev/null
    nginx   2580 nginx    1u      CHR                1,3      0t0     12 /dev/null
    nginx   2580 nginx    2w      REG              253,0     1294 681590 /var/log/nginx/error.log
    nginx   2580 nginx    4w      REG              253,0     1294 681590 /var/log/nginx/error.log
    nginx   2580 nginx    5w      REG              253,0     1773 681589 /var/log/nginx/access.log <-- 5번 FD가 access.log를 참고 한다.
    nginx   2580 nginx    6u     IPv4              21538      0t0    TCP *:http (LISTEN)
    nginx   2580 nginx    7u     unix 0xffff8800d12f6800      0t0  21033 socket
    nginx   2580 nginx    8u  a_inode                0,9        0   5806 [eventpoll]
    nginx   2580 nginx    9u  a_inode                0,9        0   5806 [eventfd]
    nginx   2580 nginx   10u  a_inode                0,9        0   5806 [eventfd]
    ... 생략
    --------------------------------------------------------------------------------------------
    starace -ttf -p 2580
    {{EPOLLIN, {u32=3509961184, u64=140586379493856}}}, 512, 35741) = 1
    17:20:50.952423 recvfrom(3, "GET / HTTP/1.1\r\nHost: 192.168.56"..., 1024, 0, NULL, NULL) = 504
    17:20:50.953376 stat("/usr/share/nginx/html/index.html", {st_mode=S_IFREG|0644, st_size=612, ...}) = 0
    17:20:50.954906 open("/usr/share/nginx/html/index.html", O_RDONLY|O_NONBLOCK) = 11 <-- 11은 FD를 뜻함.
    17:20:50.955123 fstat(11, {st_mode=S_IFREG|0644, st_size=612, ...}) = 0
    17:20:50.955693 writev(3, [{"HTTP/1.1 304 Not Modified\r\nServe"..., 180}], 1) = 180  <-- 3번 FD가 가르키는곳에 write를 한다.
    17:20:50.956130 write(5, "192.168.56.1 - - [28/Mar/2017:17"..., 193) = 193  <-- 5번 FD가 가르키는 곳에 Write한다.
    17:20:50.956282 close(11)               = 0
    17:20:50.956680 recvfrom(3, 0x7fdcd2ff87a0, 1024, 0, 0, 0) = -1 EAGAIN (Resource temporarily unavailable)
    17:20:50.957302 epoll_wait(8,
    
### 2.2 스택 정보와 통신/파일 간 동작 연계 분석
스택에도 스레드 ID(LWP_ID)정보가 있고, 시스템 콜에서도 스레드 ID정보가 있어서 파일/통신 간 동작과 스택 정보를 같이 사용해서 분석을 할 수 있다.

예를 들어 CPU를 과도하게 사용하는 스레드가 발생할때 시스템 콜 모니터링에서는 해당 스레드가 무슨 일을 하는지 확인할 수 있고, 스텍은 이 스레드의 역할은 무엇인지 어떤 코드를 수행 중인지 확인할 수 있다.

### 2.3 통신/파일 간 동작 모니터링 방법
시스템콜을 모니터링 할때 유의점은 스레드별로 성능 측정이 가능하도록 스레드 ID와 시간 정보는 꼭 출력해야한다. 또한 모니터링은 root계정이나 대상 프로그램을 기동한 계정에서 수행해야 한다.

#### 2.3.1 IBM AIX/Oracle 솔라리스
    
    명령어: truss -dl -o [outfile] -p [pid]
    d - 시간출력(D - 각 시스템 콜 명령 줄 사이에 소요된 델타 시간 출력)
    I - 스레드 ID(LWP ID)출력
    o - 모니터링된 시스템 콜을 outfile에 저장
    p - 모니터링 대상이 되는 PID
    f - 모니터링 프로세스에서 fork된 자식 프로세스에 대한 모니터링도 수행
    -------------------------------------------------------------
    예제 - 모니터링하는 동안 시스템 콜 명령별 호출 횟수와 소요시간 통계 조회 (System CPU사용률이 높을때 주로 어떤 시스템 콜이 발생하는지 유용하다) 
    truss -c -p [pid]
    -------------------------------------------------------------
    AIX와 솔라리스의 truss는 시스템 콜 이외에 일반 라이브러리 함수 호출을 모니터링 할 수 있다.
    예제 - lib.a에 있는 m으로 시작하는 함수와 free함수 그리고 libcurses.a의 refresh 함수 호출을 모니터링 하는 명령.
    truss -u libc.a::m*,free - u libcurses.a::refresh -p [pid]
    -------------------------------------------------------------
    HP-UX: tusc -T "" -o [outfile] -lp [pid]
    T - 시간 정보 출력 (""은 1970년 1월 1일 이후 경과한 초 단위(ms포함) 표시)
    I - 스레드 ID(LWP_ID) 출력
    o - 모니터링된 시스템 콜을 outfile에 저장
    D - 시스템 콜의 실행시간 출력
    p - 모니터링 대상이 되는 PID
    -------------------------------------------------------------
    tusc말고 Glance에서도 L(프로세스 시스템콜) 메뉴를 이용해 시스템 콜 통계를 볼수 있다.
    
### 2.3.2 Linux
    
    명령어: strace -ttf -o [outfile] -p [pid]
    tt - ms를 포함한 시간 출력
    f - 모든 스레드에 대한 시스템 콜 출력
    o - 모니터링된 시스템 콜을 outfile에 저장
    T - 시스템 콜의 실행 시간 출력
    p - 모니터링 대상이 되는 PID 지정
    
    리눅스는 strace말고 라이브러리 호출을 모니터링하는 ltrace도 제공한다.
    --------------------------------------------------------------
    {{EPOLLIN, {u32=3509961184, u64=140586379493856}}}, 512, 35741) = 1
    17:20:50.952423 recvfrom(3, "GET / HTTP/1.1\r\nHost: 192.168.56"..., 1024, 0, NULL, NULL) = 504
    17:20:50.953376 stat("/usr/share/nginx/html/index.html", {st_mode=S_IFREG|0644, st_size=612, ...}) = 0
    17:20:50.954906 open("/usr/share/nginx/html/index.html", O_RDONLY|O_NONBLOCK) = 11 <-- 11은 FD를 뜻함.
    17:20:50.955123 fstat(11, {st_mode=S_IFREG|0644, st_size=612, ...}) = 0
    17:20:50.955693 writev(3, [{"HTTP/1.1 304 Not Modified\r\nServe"..., 180}], 1) = 180
    17:20:50.956130 write(5, "192.168.56.1 - - [28/Mar/2017:17"..., 193) = 193
    17:20:50.956282 close(11)               = 0
    17:20:50.956680 recvfrom(3, 0x7fdcd2ff87a0, 1024, 0, 0, 0) = -1 EAGAIN (Resource temporarily unavailable)
    17:20:50.957302 epoll_wait(8,

## 3. java dump
예전에 java stack을 실시간으로 수집하는 방법을 설명했다. 하지만 비정상적으로 종료되거나 프로세스가 비정상적인 경우 jstack이나 jdump를 사용하지 못할 경우에 바이너리 코어 덤프에서 java stack이나 heap정보를 뜰 수 있다.
 
    - 프로세스에 대한 java heap dump
    예> jdump -dump:format=b, file=dump.hprof 12333
     
    - 바이너리 코어에 대한 java heap dump
    예> jdump =dump:format=b, file=dump.hprof /opt/java/bin/java core.12333
     
    - 프로세스에 대한 java stack
    예> jstack 12333
    
    - 바이너리 코어에 대한 java stack
    예> jstack /opt/java/bin/java core.12333
    
IBM JVM은 jdk의 bin안에 jextract이나 jdmpview를 사용해 코어파일에서 heap과 thread정보를 추출할 수 있다. 주의점은 코어 덤프를 남긴 자바 버전과 버그 패치까지 동일한 환경에서 수행해야 한다는 점이다. 안그러면 문제 생긴다.

    - 코어파일에서 덤프, 실행파일, 관련 라이브러리 압축파일로 묶여서 만들어진다.
    jextract [corefile] [output zip file]
     
    - 생성된 zip파일을 기반으로 jdmpview 명령어를 통해 heap dump 추출
    jdmpview -zip [output zip file]
     
    - 코어 파일이 발생한 동일 서버에서 추출
    jdmpview -core [core file] heapdump   <-- PHD형식의 heapdump출력
    jdmpview -core [core file] info class   <-- 클래스 히스토그램 추출
    jdmpview -core [core file] info thread   <-- java 모든 스레드에 대한 상태와 stack 추출
    
그런데 이런 코어 파일을 일반적으로 남기질 않는다. 왜냐하면 java에서 1gb메모리를 쓰면 코어덤프는 보통 수십기가의 덤프 파일을 남기기 때문이다. 만약 덤프파일을 남긴다면 아래와 같은 명령어를 이용하자.

남기려면 unlimited를 주던가 아님 kb의 파일 용량을 써준다.

    덤프 확인
    ulimit -a
    core file size          (blocks, -c) 0  <-- 0은 안남긴다는 뜻
    ... 생략
    -------------------
    ulimit -c unlimited <-- 남기겟다는 명령어 
    ulimit -c 1048576 (1gb)
    
Disk가 꽉찰 수 있으니 주의 하면서 사용해야하며 java.core는 보통 java/bin아래에 생기는데 core_pattern을 통해서 경로를 수정 할 수 있다.
    
만약 core를 강제로 남기려면 아래와 같이 한다.
    
    AIX: gencore [pid] [core filename]
    HP-UX, 솔라리스, linux: gcore -o [core filename][pid]
    Window: 윈도우 작업관리자 > 프로세스 선택 > 마우스 우클릭 > 덤프파일 만들기
    
## 4. 프로세스 작업 디렉토리 확인
현재 실행되는 프로세스의 작업 디렉토리를 확인 할 수 있다.
    
    AIX: procwdx [pid]
    HP-UX, 솔라리스, linux: pwdx [pid]
    
## 5. 프로그램에서 사용하는 공유 라이브러리 확인
현재 수행중인 프로세스나 실행 파일에서 사용하는 공유 라이브러리를 확인 할 수 있다.
    
### 5.1 프로세스
    
    AIX: procldd [pid], genld -l
    HP-UX, 솔라리스, linux: pldd [pid]
    --------------------------------
    [root@localhost nginx]# pldd 2580
    2580:   /usr/sbin/nginx
    linux-vdso.so.1
    /lib64/libdl.so.2
    /lib64/libpthread.so.0
    ... 생략
    
### 5.2 실행파일
    
    AIX, HP-UX, 솔라리스, linux : ldd[executable file]    
    -------------------------------------------------
    [root@localhost nginx]# ldd /bin/ls
    linux-vdso.so.1 =>  (0x00007ffc7bddb000)
    libselinux.so.1 => /lib64/libselinux.so.1 (0x00007fa059a69000)
    libcap.so.2 => /lib64/libcap.so.2 (0x00007fa059864000)
    libacl.so.1 => /lib64/libacl.so.1 (0x00007fa05965a000)
    libc.so.6 => /lib64/libc.so.6 (0x00007fa059299000)
    ... 생략
    
## 6. 프로세스 생성 관계
프로세스가 한 서버내에서 실행 되는 경우 동작 방식을 이해하기 위해 프로세스간 생성관계를 분석 하는 경우가 있는데, deamon 프로세스가 아니면 프로세스간의 생성 관계는 PID와 PPID를 보면서 확인 할 수 있다.

    AIX: proctree [pid]
    HP-UX, 솔라리스: ptree [pid]
    리눅스: pstree [pid]
    --------------------------
    [root@localhost bin]# pstree 2580
    nginx

만약 설치를 안했다면 yum install psmisc로 설치 하고 사용하면 된다.

## 7. 프로세스의 수행 환경 확인
현재 계정 환경설정 확인은 env로 할 수 있다. 현재 수행 중인 프로세스가 가진 환경 설정 값은 아래와 같이 확인 할 수 있다.

    AIX: ps eww [pid] | tr ' ' '\012' | grep =
    리눅스: cat /proc/[pid]/environ | tr \\0 \\n 또는 ps eww [pid] 또는 ps eww 630 | tr ' ' '\012' | grep =
    솔라리스: /usr/ucb/ps -wwwe [pid]
    HP-UX: gdb를 실행 후 해당 프로세스를 붙여 p ((char**)_environ)[0]@30 수행 (30은 갯수)
    --------------------------------------------------------------------------------
    ps eww 630 | tr ' ' '\012' | grep =
    LANG=ko_KR.UTF-8
    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
    

    
    
    
    
    
     


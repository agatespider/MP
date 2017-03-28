# 프로세스
서버 어플리케이션의 처리시간이 높다면 어플리케이션의 코드, DB쿼리, 내부/외부 시스템간의 연계 중 어디가 느린지 판단 할 수 있어야 한다.

CPU사용율이 높다면 CPU증설도 생각해볼 수 있지만 어플리케이션에서 CPU 사용률을 높이는 코드가 먼지 찾아서 개선 할 줄도 알아야 한다.
근데 어떤 프로세스가 CPU 사용률이 높은지 어떤 함수를 호출하는지 알 수 있어야 하지 않을까?

걱정 마라 아래 3가지의 기본 지식만 이해하면 어떤 프로세스를 접근할지 알 수 있다.

    수행중인 코드: 프로세스가 현재 어떤 함수(기능)을 수행하고 있는가?
    통신/파일 상태: 프로세스가 통신으로 연계된 서버는 어디고, 어떤 파일을 열고 있는가?
    통신/파일간 동작: 연계 서버 또는 파일에 입출력이 얼마나 자주 그리고 오래 이루어지는가?
    
일반적으로 업무 처리 코드들은 코드만 수행하고 끝나는 경우는 거의 없다. DB나 레거시시스템 연동등 데이터를 주고 받고 데이터 처리 결과를 로그로 남기고 전달하는 작업들을 한다.
    
이러한 작업들을 모니터링을 통해 흐름을 파악하면 성능 개선을 위한 프로세스 이해도나 개선점을 파악하기도 쉬워진다. 보통 어플리케이션 서버 내부 성능에 문제가 있는 경우 아래 명령만으로 70%정도 개선 대상을 식별을 할 수 있다.

    기본지식            unix               linux                   window                   
    ---------------------------------------------------------------------------------------------
    수행중인 코드(스택): jstack, pstack     jstack, pstack          jstack, procexp, processhacker
    통신/파일 상태:     pfiles, lsof       /proc/[pid]/fd, lsof    procexp, processhacker, tcpview
    통신/파일간 동작:   truss, tusc        strace                  procmon
    
## 1. 수행중인 코드
현재 수행중인 프로그램이 어떤 코드의 어디를 실행하고 있는지 알고 싶을 때는 해당 프로그램의 Stack 정보를 획득하면 알 수 있다.
    
    "main" #1 prio=5 os_prio=0 tid=0x0000000001d08000 nid=0x13e8 waiting on condition [0x00000000025fe000]  <-- 스레드 정보
       java.lang.Thread.State: TIMED_WAITING (sleeping)
    	at java.lang.Thread.sleep(Native Method)
    	at PERFORMANCE.code008.User.getName(User.java:17)
    	at PERFORMANCE.code008.ProcessMain.main(ProcessMain.java:9)
    	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    	at java.lang.reflect.Method.invoke(Method.java:498)
    	at com.intellij.rt.execution.application.AppMain.main(AppMain.java:147)
    	
위 스택정보는 아래 코드를 Intellij에서 실행했을때 나오는 정보다.

    public class ProcessMain {
        public static void main(String[] args) {
            User user1 = new User("poo", "earth 001");
            user1.getName();
            user1.getAddr();
    
            System.out.println("End processMain");
        }
    }
    
    public class User {
        private String name;
        private String addr;
    
        public User(String name, String addr) {
            this.name = name;
            this.addr = addr;
        }
    
        public String getName() {
            try {
                Thread.sleep(20000);
            } catch (InterruptedException e) { }
            return this.name;
        }
    
        public String getAddr() {
            try {
                Thread.sleep(20000);
            } catch (InterruptedException e) { }
            return this.addr;
        }
    }
    
스택은 아래서 위로 쌓인다. 즉 가장 최초의 실행 코드는 아래로 최신 실행 코드는 위에 있게 된다. 분석시 아래서 위로 분석해 가면 된다. 그리고 아래와 같이 분석 할 수 있다.

    java.lang.Thread.State: TIMED_WAITING (sleeping)              4. 현재 TIMED_WAITING중이다.
    at java.lang.Thread.sleep(Native Method)                      3. getName 17번째 thread.sleep을 실행 하고 있다
    at PERFORMANCE.code008.User.getName(User.java:17)             2. User클래스의 getName을 실행하고 
    at PERFORMANCE.code008.ProcessMain.main(ProcessMain.java:9)   1. ProcessMain 9번째 줄을 실행하고
    
### 1.1 스택 분석
스택 정보는 성능저하나 멈춤상태에서 프로세스를 분석하는 핵심 정보이다. 보통 일정시간(10초 내외)간격으로 수십 또는 수백번에 걸쳐 스택 정보를 수집해서 분석하면 매우 좋은 자료가 된다.
 
#### 1.1.1 스택 대기 분석
어플리케이션이 코드를 수행하려 하지만 어떠한 이유로 멈춰있는 상태를 대기라고 말하며 성능 저하를 발생시키는 한 유형이다.
락(Lock)은 가장 대표적인 대기이고, 스레드풀 자원을 다 사용해서 큐에서 기다리는것도 대기이다.

성능 분석에서 프로세스 스택을 분석시 중요하게 바라보는중 하나가 정상적으로 작업을 진행 못하고 대기하고 있는 비율이 얼마나 높은지 체크하는 것이다.

서비스 요청이 없어서 작업 스레드가 대기하면 모르겟지만 다른 서버나 내부 락에 의해 대기가 발생하면 줄이거나 제거하기 위한 방안을 마련해야 한다.

##### 1.1.1.1 Lock 대기
Lock을 구현하는 대표적인 방법인 synchronized와 notify/wait로 락 대기를 설명 할 수 있다.
아래 스택은 5개의 쓰레드를 만들어서 동시에 실행 시켯지만 synchronized로 인해서 Lock걸려서 대기하고 있는 모습을 확인 할 수 있다.

스택에 "- locked"라고 써있으면 락을 잡고 있다는 뜻이고 "- waiting to lock"은 다른 쓰레드에서 사용해야할 것을 lock을 잡고 있어서 대기 하고 있다는 의미이다.

lock이 왜걸렷는지 어디서 걸렷는지 정보가 다 나오니 관련 코드와 프로세스를 찾아서 완화 하는 방법을 찾을 수 있다.

    [스택정보]
    "Thread-4" #16 prio=5 os_prio=0 tid=0x000000001b30e000 nid=0x1a04 waiting for monitor entry [0x000000001da4f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam1.SyncObj.outIdx(SyncObj.java:17)
    	- waiting to lock <0x00000007807e2138> (a PERFORMANCE.code008.exam1.SyncObj)    <-- 락객체 0x00000007807e2138를 사용하는데 락을 잡고 있어서 대기
    	at PERFORMANCE.code008.exam1.SyncObj.run(SyncObj.java:12)
    	at java.lang.Thread.run(Thread.java:745)
    --------------
    "Thread-3" #15 prio=5 os_prio=0 tid=0x000000001b300000 nid=0x11a4 waiting for monitor entry [0x000000001d93f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam1.SyncObj.outIdx(SyncObj.java:17)
    	- waiting to lock <0x00000007807e2138> (a PERFORMANCE.code008.exam1.SyncObj)    <-- 락객체 0x00000007807e2138를 사용하는데 락을 잡고 있어서 대기
    	at PERFORMANCE.code008.exam1.SyncObj.run(SyncObj.java:12)
    	at java.lang.Thread.run(Thread.java:745)
    --------------
    "Thread-2" #14 prio=5 os_prio=0 tid=0x000000001b2ff000 nid=0x1768 waiting for monitor entry [0x000000001d77f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam1.SyncObj.outIdx(SyncObj.java:17)
    	- waiting to lock <0x00000007807e2138> (a PERFORMANCE.code008.exam1.SyncObj)    <-- 락객체 0x00000007807e2138를 사용하는데 락을 잡고 있어서 대기, 객체 클래스명을 표시
    	at PERFORMANCE.code008.exam1.SyncObj.run(SyncObj.java:12)
    	at java.lang.Thread.run(Thread.java:745)
    --------------
    "Thread-1" #13 prio=5 os_prio=0 tid=0x000000001b30a800 nid=0x72c waiting on condition [0x000000001d5cf000]
       java.lang.Thread.State: TIMED_WAITING (sleeping)
    	at java.lang.Thread.sleep(Native Method)
    	at PERFORMANCE.code008.exam1.SyncObj.outIdx(SyncObj.java:17)
    	- locked <0x00000007807e2138> (a PERFORMANCE.code008.exam1.SyncObj)   <-- 락을 잡고 있다. 다른 쓰레드들은 대기한다. 락객체 주소는 : 0x00000007807e2138
    	at PERFORMANCE.code008.exam1.SyncObj.run(SyncObj.java:12)
    	at java.lang.Thread.run(Thread.java:745)
    --------------
    "Thread-0" #12 prio=5 os_prio=0 tid=0x000000001b30a000 nid=0x17dc waiting for monitor entry [0x000000001ce1f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam1.SyncObj.outIdx(SyncObj.java:17)
    	- waiting to lock <0x00000007807e2138> (a PERFORMANCE.code008.exam1.SyncObj)    <-- 락객체 0x00000007807e2138를 사용하는데 락을 잡고 있어서 대기
    	at PERFORMANCE.code008.exam1.SyncObj.run(SyncObj.java:12)
    	at java.lang.Thread.run(Thread.java:745)    
  
    --------------
    [코드]
    public class ProcessMain {
        public static void main(String[] args) {
            System.out.println("Start Thread");
    
            Runnable r = new SyncObj();
    
            for(int i=0; i<5; i++) {
                Thread t = new Thread(r);
    
                t.start();
            }
    
            System.out.println("End Thread");
        }
    }
    --------------
    public class SyncObj implements Runnable{
    
        private int idx = 0;
    
        @Override
        public void run() {
            outIdx();
        }
    
        private synchronized void outIdx() {
            try {
                Thread.sleep(20000);
            } catch (InterruptedException e) { }
            idx++;
            System.out.println("idx = " + idx);
        }
    }
    
##### 1.1.1.2 소켓 대기
lock 대기처럼 흔하고 중요한 소켓 대기라는게 있다. 아래는 쿼리를 실행후 데이터를 Fetch해 오는 과정에서 DB의 응답을 기다리는 스택 정보다.

오래걸리는 소켓 읽기 상태에 있는 스택은 수신한 데이터를 읽고 있을 가능 성도 있지만 대부분 대기 I/O를 통해 다른 서버나 프로세스에서 처리가 끝나기를 기다리고 있는 상태이다.
 
즉 어플리케이션은 다른곳에 데이터를 요청이후 처리 결과를 받기 위해 socketRead함수를 호출하는데 이 과정에서 응답이 올때까지 sockettRead함수에서 대기하게 된다. 

따라서 이런 소켓읽기 상태에 있는 프로세스나 스레드가 많은경우 상대방 프로세스나 서버에서 처리시간이 오래 걸리거나 인터페이스 호출이 빈번하다는 것을 의미 한다.  
    
    "http-nio-18080-exec-7" #31 daemon prio=5 os_prio=0 tid=0x000000001de4c800 nid=0x19fc runnable [0x0000000026dab000]
       java.lang.Thread.State: RUNNABLE
    	at java.net.SocketInputStream.socketRead0(Native Method)            <-- 네트워크에서 데이터를 수신 대기
    	at java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
    	at java.net.SocketInputStream.read(SocketInputStream.java:170)
    	at java.net.SocketInputStream.read(SocketInputStream.java:141)
    	at com.mysql.jdbc.util.ReadAheadInputStream.fill(ReadAheadInputStream.java:101)
    	at com.mysql.jdbc.util.ReadAheadInputStream.readFromUnderlyingStreamIfNecessary(ReadAheadInputStream.java:144)
    	at com.mysql.jdbc.util.ReadAheadInputStream.read(ReadAheadInputStream.java:174)
    	- locked <0x000000078c722fb0> (a com.mysql.jdbc.util.ReadAheadInputStream)
    	at com.mysql.jdbc.MysqlIO.readFully(MysqlIO.java:3001)
    	at com.mysql.jdbc.MysqlIO.reuseAndReadPacket(MysqlIO.java:3462)
    	at com.mysql.jdbc.MysqlIO.reuseAndReadPacket(MysqlIO.java:3452)
    	at com.mysql.jdbc.MysqlIO.checkErrorPacket(MysqlIO.java:3893)
    	at com.mysql.jdbc.MysqlIO.sendCommand(MysqlIO.java:2526)
    	at com.mysql.jdbc.MysqlIO.sqlQueryDirect(MysqlIO.java:2673)
    	at com.mysql.jdbc.ConnectionImpl.execSQL(ConnectionImpl.java:2549)
    	- locked <0x000000078c7190b0> (a com.mysql.jdbc.JDBC4Connection)
    	at com.mysql.jdbc.PreparedStatement.executeInternal(PreparedStatement.java:1861)
    	- locked <0x000000078c7190b0> (a com.mysql.jdbc.JDBC4Connection)
    	at com.mysql.jdbc.PreparedStatement.execute(PreparedStatement.java:1192)
    	- locked <0x000000078c7190b0> (a com.mysql.jdbc.JDBC4Connection)
    	at net.sf.log4jdbc.sql.jdbcapi.PreparedStatementSpy.execute(PreparedStatementSpy.java:443)
    	at org.apache.ibatis.executor.statement.PreparedStatementHandler.query(PreparedStatementHandler.java:63)
    	at org.apache.ibatis.executor.statement.RoutingStatementHandler.query(RoutingStatementHandler.java:79)
    	at org.apache.ibatis.executor.SimpleExecutor.doQuery(SimpleExecutor.java:63)
    	at org.apache.ibatis.executor.BaseExecutor.queryFromDatabase(BaseExecutor.java:324)
    	at org.apache.ibatis.executor.BaseExecutor.query(BaseExecutor.java:156)
    	at org.apache.ibatis.executor.CachingExecutor.query(CachingExecutor.java:109)
    	at org.apache.ibatis.executor.CachingExecutor.query(CachingExecutor.java:83)
    	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:148)
    	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:141)
    	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectOne(DefaultSqlSession.java:77)
    	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    	at java.lang.reflect.Method.invoke(Method.java:498)
    	at org.mybatis.spring.SqlSessionTemplate$SqlSessionInterceptor.invoke(SqlSessionTemplate.java:433)
    	at com.sun.proxy.$Proxy67.selectOne(Unknown Source)
    	at org.mybatis.spring.SqlSessionTemplate.selectOne(SqlSessionTemplate.java:166)
    	at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:82)
    	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:59)
    	at com.sun.proxy.$Proxy68.findUserById(Unknown Source)
    	at com.ddaigong.service.impl.UserServiceImpl.findUserById(UserServiceImpl.java:27)
    	at com.ddaigong.service.impl.UserServiceImpl$$FastClassBySpringCGLIB$$8d81b32d.invoke(<generated>)
    	at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)
    	at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720)
    	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)
    	at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:99)
    	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:280)
    	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)
    	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)
    	at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655)
    	at com.ddaigong.service.impl.UserServiceImpl$$EnhancerBySpringCGLIB$$d83d5c9.findUserById(<generated>)
    	at com.ddaigong.support.security.core.userdetail.UserDetailsServiceImpl.loadUserByUsername(UserDetailsServiceImpl.java:45)
    	at com.ddaigong.support.security.core.userdetail.UserDetailsServiceImpl$$FastClassBySpringCGLIB$$b95fed58.invoke(<generated>)
    	at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)
    	... 생략
    	
##### 1.1.1.3 sleep 대기
sleep대기는 비동기나 비대기 I/O에서 수신할 데이터가 도착하지 않았거나 수행조건이 되는 상태가 아니라서 기다렷다가 다시 호출 할때 발생한다.
    	
예를 들면 데이터를 받는데 비동기 방식으로 처리하고 있었다. 그런데 동기방식처럼 처리하기 위해서 처리가 완료될때까지 1초당 sleep후 반복적으로 체크해서 데이터를 받는 로직으로 만들었다. 하지만 실제 데이터는 200ms만에 수신이 되는데 이경우 불필요하게 800ms시간을 지연 시키고 있던 것이였다.

이렇게 응답 도착 여부를 파악하기 위해서 빈번하고 부하를 발생시키거나 불필요하게 대기하는것을 sleep대기라 한다.


##### 1.1.1.4 교착상태(Deadlock)
Deadlock은 서로 다른 둘이상의 프로세스나 스레드가 상대 프로세스가 점유하는 자원을 기다리는 무한 대기 상태이다.

아래와 같이 각자의 스레드가 각자의 스레드의 객체를 점유하고 대기하고 있어서 무한 적인 대기 상태로 남게 된다.

보통 Deadlock상태에 걸릴경우 아래와 같이 deadlock이라고 표시를 해주기 때문에 어떤곳에서 어떻게 데드락이 발생하는지 찾아내서 수정을 해야 한다.
 
    "Thread-1" #13 prio=5 os_prio=0 tid=0x000000001b0e7800 nid=0x18c0 waiting for monitor entry [0x000000001d13f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam2.ProcessMain$Friend.bowBack(ProcessMain.java:20)
    	- waiting to lock <0x00000007807e2300> (a PERFORMANCE.code008.exam2.ProcessMain$Friend) <-- 0x00000007807e2300 객체락 대기 (thread 0에서 lock)
    	at PERFORMANCE.code008.exam2.ProcessMain$Friend.bow(ProcessMain.java:17)
    	- locked <0x00000007807e2348> (a PERFORMANCE.code008.exam2.ProcessMain$Friend)
    	at PERFORMANCE.code008.exam2.ProcessMain$2.run(ProcessMain.java:33)
    	at java.lang.Thread.run(Thread.java:745)
    
    "Thread-0" #12 prio=5 os_prio=0 tid=0x000000001b0e7000 nid=0x19c8 waiting for monitor entry [0x000000001d41f000]
       java.lang.Thread.State: BLOCKED (on object monitor)
    	at PERFORMANCE.code008.exam2.ProcessMain$Friend.bowBack(ProcessMain.java:20)
    	- waiting to lock <0x00000007807e2348> (a PERFORMANCE.code008.exam2.ProcessMain$Friend) <-- 0x00000007807e2348 객체락 대기 (thread 1에서 lock)
    	at PERFORMANCE.code008.exam2.ProcessMain$Friend.bow(ProcessMain.java:17)
    	- locked <0x00000007807e2300> (a PERFORMANCE.code008.exam2.ProcessMain$Friend)
    	at PERFORMANCE.code008.exam2.ProcessMain$1.run(ProcessMain.java:29)
    	at java.lang.Thread.run(Thread.java:745)
         	
    생략...
    
    Found one Java-level deadlock:
    =============================
    "Thread-1":
      waiting to lock monitor 0x000000001a11f228 (object 0x00000007807e2300, a PERFORMANCE.code008.exam2.ProcessMain$Friend),
      which is held by "Thread-0"
    "Thread-0":
      waiting to lock monitor 0x000000001a11c788 (object 0x00000007807e2348, a PERFORMANCE.code008.exam2.ProcessMain$Friend),
      which is held by "Thread-1"
      
DB같은 경우는 스스로 판단해서 Deadlock을 해제하는 경우도 있지만 JVM은 오랜 시간이 지나도 현재 상태를 유지할 뿐 lock을 해제 하지 않는다.
      

#### 1.1.2 스택 성능 분석
스택을 이용한 성능 분석은 비중 분석을 의미한다. APM에서 "A서비스 시간이 총 5초인데 내부에서 수행하는 B쿼리가 4초이다. 따라서 B쿼리를 수정해야한다."라고 한다면 스택 분석은 "A서비스에서 수행되는 B쿼리가 응답시간대비 80%이므로 수정해야한다."라고 생각할 수 있다.

스택은 처리시간에 대한 정보가 전혀 없다. 단지 수집하는 시점의 스택 정보만 가지고 있을 뿐이다. 몇백번 수집해서 동일 스레드에 동일한 업무 서비스가 연속해서 호출 되더라도 업무가 계속 수행된다고 할수는 없다.

몇백번 수집하고 수집한 정보에 특정 업무에 대해 특정 쿼리 수행을 하는 비중이 80%였다면 이는 업무가 대부분 쿼리를 수행하는데 시간을 쓰고 있다고 예상 할 수 있다.


#### 1.1.3 스택 수집

.. 스택편은 현제 몇개 도구를 정리중에 있으니 차후 재정리 함
# NPM

* 개요
* NPM
* 설치
* 명령어
  * init
* 정리

## 개요
현재 Front쪽 기술 발전에 있어서 Build Package도구인 npm에 관해서 간략히 정리를 해보려고 합니다.

## NPM
NPM이란 Node Package Modules의 약자입니다. NPM이란 무엇이냐면 Node.js에서 사용가능한 모듈들을 패키지화시켜 모아놓은 곳 즉 repository라고 할 수 있습니다.
 
이 NPM을 통해서 우리가 필요로 하는 기능들을 NPM에서 찾아서 적용하고 사용 할 수 있습니다. 이 NPM은 모듈에 대한 버전관리 부터 다운로드, dependency관리를 해줍니다. 이런 좋은 기능을 제공하다보니 Node.js에서는 필수로 자리를 잡은 기능 입니다.

[Npm사이트주소](https://docs.npmjs.com/getting-started/what-is-npm)

## 설치
과거 Node.js와 NPM은 각각 설치를 했었는데 현재는 Node.js를 설치하면 자동으로 같이 설치가 됩니다. 물론 개별 설치도 가능합니다.

## 명령어

### init
입력을 통해 npm project를 초기화 한다 보통 package.json을 자동 생성해줍니다.

### install
install 명령어는 설치하고자 하는 package와 해당 package가 의존하는 package를 설치 합니다. 사용법은 아래와 같습니다.

    npm install (with no args, in package dir)
    npm install [<@scope>/]<name>
    npm install [<@scope>/]<name>@<tag>
    npm install [<@scope>/]<name>@<version>
    npm install [<@scope>/]<name>@<version range>
    npm install <tarball file>
    npm install <tarball url>
    npm install <folder>

package는 아래와 같은 정보로 설치를 할 수 있습니다.

    1. 설치한 패키지에 대한 정보를 담고 있는 package.json이 패키지 파일은 폴더안에 존재.
    2. tar 파일.
    3. URL.
    4. <name>@<version>.
    5. <name>@<tag>.
    6. <name>은 마지막 버전을 가르킵니다.
    7. <git remote url>.
    
패키지를 공개하지 않더라도 특정 프로그램을 사용하고 싶을때 npm을 사용할 수 있고 다른곳에 쉽게 설치하고자 하면 tar로 압축해서 사용합니다.     

옵션은 아래와 같습니다.

1. --save, -S : 패키지를 당신의 dependencies에 등록합니다.

2. --save-dev, -D : 패키지를 당신의 devDependencies에 등록합니다.


## 정리    


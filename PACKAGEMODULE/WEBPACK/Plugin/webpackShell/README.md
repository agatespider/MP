# Webpack Shell Plugin

* 개요
* 주소
* 정리

## 개요
해당 플러그인은 항상 웹팩빌드가 싱행되기 전이나 실행한 수에 쉘을 실행 할 수 있는 기능을 제공 합니다.

## 주소
https://www.npmjs.com/package/webpack-shell-plugin

## 설치

    npm install --save-dev webpack-shell-plugin

## 설정
    
    const WebpackShellPlugin = require('webpack-shell-plugin');
     
    module.exports = {
      ...
      ...
      plugins: [
        new WebpackShellPlugin({onBuildStart:['echo "Webpack Start"'], onBuildEnd:['echo "Webpack End"']})
      ],
      ...
    }
    
## 예제     

    const WebpackShellPlugin = require('webpack-shell-plugin');
    const path = require('path');
     
    var plugins = [];
     
    plugins.push(new WebpackShellPlugin({
      onBuildStart: ['echo "Starting"'],
      onBuildEnd: ['python script.py && node script.js']
    }));
     
    var config = {
      entry: {
        app: path.resolve(__dirname, 'src/app.js')
      },
      output: {
        path: path.resolve(__dirname, 'dist'), // regular webpack 
        filename: 'bundle.js'
      },
      devServer: {
        contentBase: path.resolve(__dirname, 'src') // dev server 
      },
      plugins: plugins,
      module: {
        loaders: [
          {test: /\.js$/, loaders: 'babel'},
          {test: /\.scss$/, loader: 'style!css!scss?'},
          {test: /\.html$/, loader: 'html-loader'}
        ]
      }
    }
     
    module.exports = config;

## 정리    


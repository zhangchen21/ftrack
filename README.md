# ftrack
用于追踪查找项目中的某些函数，运行生成查找结果可完全自定义使用，包括函数所在位置、函数名、携带参数、注释以及提交者等，需要项目根目录的 ftrack.conf 配置文件

## 使用方法
下载：
```
npm install ftrack
```
使用：
```
./node_modules/.bin/track
```
注意，使用前需要先进行配置
## 配置方法
### 手动配置
手动在您的项目根目录新建文件：ftrack.conf.js，其配置项数据格式如下：
```javascript
module.exports = {
  TargetPath: string,
  TargetFileExtname: string[],
  functionName: string[],
  callback: (data: codeInfo[]) => void,
};
```
以下是一个示范内容，这将会在代码分析结束后将提取到的代码信息打印出来：
```javascript
module.exports = {
  TargetPath: 'src/',
  TargetFileExtname: ['.js', '.ts', '.tsx'],
  functionName: ['getHotData'],
  callback: (data) => {
    console.log(data);
  },
};
```
配置项中，各个属性的含义是：
| 配置项 | 默认值 | 含义 |
|---|---|---|
|TargetPath|/(即所有目录)|要检测的目录，可以是文件也可以是文件夹，根据目录是否以"/"或"\\"结尾区分
|TargetFileExtname|[]|要检测的文件的后缀
|functionName|必填|要检测的函数名
|callback|null|函数，要对检测到的数据进行的操作，将会在整个过程结束后自行调用


### 自动配置
使用本包提供的 --init 指令，按照 QA 的方式引导您生成配置文件（暂不支持）

## 输出数据格式
输出数据将是一个数组，也是处理输出数据的方法的入参，您可以自定义回调函数来使用它，也就是在配置文件的 callback 进行配置，其数据格式如下：
```javascript
data: codeInfo[];
```
codeInfo 是输出数据的单元的格式：
```javascript
type codeInfo = {
  fileName: string,
  functionName: string,
  params: string[],
  owner?: string,
}
```
其中，各个属性的含义是:
| 配置项 | 含义 |
|---|---|
|fileName|函数调用所在文件
|functionName|函数调用名
|params|函数携带参数
|owner|代码提交者


## 注意事项
* 您的项目代码规范中最好是包含 "必须分号结尾" 的，在此情景下，本项目将使用分号进行语句断句，否则只能使用正则表达式加栈的方式判断函数调用的结尾，这会增加代码分析开销
* 您的函数调用携带参数最好是语义化命名的变量，不然参数字面所携带的模糊意思可能价值不大

# ftrack
用于追踪查找项目中的某些函数，运行生成查找结果可完全自定义使用，包括函数所在位置、函数名、携带参数、注释以及提交者等，需要项目根目录的 ftrack.conf 配置文件

## 使用方法
下载包：
```
npm install ftrack
```
使用：
```
ftrack
```
注意，使用前需要先进行配置
## 配置方法
### 手动配置
手动在您的项目根目录新建文件： ftrack.conf.js, 以下是一个示范内容：
```javascript
module.exports = {
	TargetPath: 'src/',
	TargetFileExtname: ['.js', '.ts', '.tsx'],
	functionName: ['getHotData'],
	callback: (data) => {console.log(data);},
};
```
这将会在代码分析结束后将提取到的代码信息打印出来

### 自动配置
使用本包提供的 --init 指令，按照 QA 的方式引导您生成配置文件（尚在开发中）

## 输出数据格式
输出数据将是一个数组，其数据格式如下：
```javascript
type data = codeInfo[];
```
codeInfo 是输出数据的单元的格式，也是处理输出数据的方法的入参，您可以自定义回调函数来使用它，也就是在配置文件的 callback 进行配置：
```javascript
type codeInfo = {
  fileName: string,
  functionName: string,
  params: string[],
  owner?: string,
}
```
callback 函数将会在整个过程结束后自行调用

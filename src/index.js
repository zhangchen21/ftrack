const fs = require('fs');  
const path = require('path');
const xlsx = require('node-xlsx');
const child_process = require('child_process');
const { Regex, outputFile, myData, CodeDescribeIndexNumber } = require('../constant');
const { ftrack } = require('../ftrack.conf.js')
const { analyzeCodeByAst } = require('../helperFunction/ast');

const { TargetFileName, TargetPath } = ftrack;
const filePath = path.resolve(TargetPath);

const excelData = [];
const promises = [];
// 调用文件遍历方法
fileDisplay(filePath);

// 文件遍历方法
function fileDisplay(filePath){
	//根据文件路径读取文件，返回文件列表
	fs.readdir(filePath, function(err, files) {
		if(err){
			console.log(err)
		} else {
			//遍历读取到的文件列表
			files.forEach(function(fileName) {
				//获取当前文件的绝对路径
				const filedir = path.join(filePath, fileName);
				promises.push(readFilePromise(filedir));
			});
		}
		Promise.all(promises).then(() => {
			writeResult(excelData);
		})
	});
}

// 转化为 promise 的 fs.stat 方法
function readFilePromise(filedir) {
	return new Promise((resolve, reject) => {
		//根据文件路径获取文件信息，返回一个fs.Stats对象
		fs.stat(filedir,function(eror, stats) {
			if(eror){
				console.warn(error);
				reject();
			} else {
				const isFile = stats.isFile();
				const isDir = stats.isDirectory();
				if(isFile && TargetFileName.includes(path.extname(filedir))) {
					// todo
					const text = fs.readFileSync(filedir, 'utf-8').toString();
					// 获取捕获组, 共四个，详见 Regex 的定义
					const regexResult = getCaptures(text, Regex);
					if(regexResult) console.log(filedir)
					for(const item of regexResult) {
						// 将 文件名数据 添加进去
						item.splice(CodeDescribeIndexNumber.fileName, 0, filedir);
						// 初始的 item 整个函数调用都放在 第三位（捕获组3），为了后续代码易读性第三位被命名为了 functionName， 故这里写的 functionName
						let codeDescribe = analyzeCodeByAst(item[CodeDescribeIndexNumber.functionName]);
						// 使用 AST 分析
						// 将函数名提取出来
						item.splice(CodeDescribeIndexNumber.functionName, 0, codeDescribe.functionName);
						// 将函数参数拆出来
						item.splice(CodeDescribeIndexNumber.params, 0, JSON.stringify(codeDescribe));
					}
					// 将读取到的数据传给 excelData
					regexResult.forEach((item) => {
						let dataItem = [];
						for(let i = 1; i <= 4; i++) {
							dataItem.push(item[i]);
						}
						excelData.push(dataItem);
					})
					resolve();
				} else if(isDir) {
					fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
					resolve();
				} else {
					resolve();
				}
			}
		})
	})
}

// 从 string 中进行正则匹配，得到捕获组
function getCaptures(text, regex) {
	const regexResult = [];
	while(1) {
		const tmp = regex.exec(text);
		if(tmp !== null)
			regexResult.push(tmp)
		else
			break;
	}
	return regexResult;
}

// 写入 excel 文件
/** @param excelData 是一个数组，数组内元素为 捕获组 格式再加上 fileName  */
function writeResult(excelData) {
	// 构建表格
	const data = myData[0].data.concat(excelData);
	const excelModel = {...myData[0], data: data};
	// console.log(excelModel.data)

	const buffer = xlsx.build([excelModel]);
	// 将数据写入write.xlsx
	fs.writeFile(outputFile, buffer, err => {
		if (err) {
			console.log(err);
		}
	});
}

// 获取 git 提交者
// function getOwner() {
// 	child_process.exec(`git blame -L ${}`)
// }


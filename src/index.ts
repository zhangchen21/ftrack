import fs from 'fs';
import path from 'path';
import { Regex } from './regexDefinition';
import { ftrack } from '../ftrack.conf';
import { analyzeCodeByAst } from './ast';
import type { funcionCallInfo } from './ast';

const { TargetFileName, TargetPath, callback } = ftrack;

const Output: Array<codeInfo> = [];

type codeInfo = {
	fileName: string,
} & funcionCallInfo

// 调用文件遍历方法
beginWork(TargetPath);

// 文件遍历方法
function beginWork(filePath: string): void{
	const promises: Array<Promise<void>> = [];
	//根据文件路径读取文件，返回文件列表
	fs.readdir(path.resolve(TargetPath), (err, fileList: Array<string>) => {
		//遍历读取到的文件列表
		fileList.forEach(fileName => {
			//获取当前文件的绝对路径
			const file = path.join(filePath, fileName);
			promises.push(readFilePromise(file));
		});
		Promise.all(promises).then(() => {
			if (!callback) {
				console.log('Precession is done. But no callback function is detected.');
				return;
			}
			callback(Output);
		});
	});
}

function readFilePromise(filedir: string): Promise<void> {
	return new Promise(resolve => {
		//根据文件路径获取文件信息，返回一个fs.Stats对象
		fs.stat(filedir, (err, stats) => {
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();
			if(
				isFile && 
				TargetFileName.includes(path.extname(filedir))
			) {
				const text = fs.readFileSync(filedir, 'utf-8').toString();
				const regexResult = getCaptures(text, Regex) ?? [];
				for(const item of regexResult) {
					// Use AST to analyze code
					const astReult = analyzeCodeByAst(item[0]);
					const codeInfoList: codeInfo[] = astReult.map(el => {
						return {
							fileName: filedir,
							...el,	
						};
					});
					Output.push(...codeInfoList);
				}
			}
			if(isDir) {
				beginWork(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
			}
			resolve();
		});
	});
}

// 从 string 中进行正则匹配，得到捕获组
function getCaptures(text: string, regex: RegExp): any[] {
	const regexResult: any[] = [];
	let match;
	while((match = regex.exec(text)) !== null) {
		regexResult.push(match);
	}
	return regexResult;
}


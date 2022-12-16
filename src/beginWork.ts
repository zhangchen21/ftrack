import fs from 'fs';
import path from 'path';
import { getRegex } from './regexDefinition';
import { analyzeCodeByAst } from './codeAnalyze';
import type { funcionCallInfo } from './codeAnalyze';

export type codeInfo = {
	fileName: string,
} & funcionCallInfo;
export type Callback = (data: codeInfo[]) => void;

const Output: Array<codeInfo> = [];
let targetExtname: string[];
let Callback: Callback;
const promises: Array<Promise<void>> = [];

// Input function
export function beginWork(
	filePath: string,
	fileExtname?: string[],
	callback?: Callback,
): void {
	fileExtname && setTargetExtname(fileExtname);
	callback && setCallback(callback);
	console.log('Begin to work!');

	if (checkIsDir(filePath)) {
		handleDir(filePath);
	} else {
		handleFile(filePath);
		ensureWorkIsDone();
	}
}

function setTargetExtname(extname: string[]) {
	targetExtname = extname;
}

function setCallback(callback: Callback) {
	Callback = callback;
}

function checkIsDir(filePath: string): boolean {
	return filePath.endsWith('/') || filePath.endsWith('\\');
} 
	
function handleDir(filePath: string) {
	// Read direction
	fs.readdir(path.resolve(filePath), (err, fileList: Array<string>) => {
		// Walk the file list
		fileList.forEach(fileName => {
			handleFile(filePath + fileName);
		});
		ensureWorkIsDone();
	});	
}

function handleFile(filePath: string) {
	if (
		!targetExtname?.length ||
		targetExtname.includes(path.extname(filePath))
	) {
		// Sign a new work
		promises.push(
			readFilePromise(path.resolve(filePath))
		);
	}	
}

function ensureWorkIsDone() {
	Promise.all(promises).then(() => {
		if (!Callback) {
			console.log('Precession is done. But no callback function is detected.');
			return;
		}
		Callback(Output);
	});
}

function readFilePromise(filedir: string): Promise<void> {
	return new Promise(resolve => {
		fs.stat(filedir, (err, stats) => {
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();
			if(isFile) {
				const text = fs.readFileSync(filedir, 'utf-8').toString();
				const regexResult = getCaptures(text, getRegex()) ?? [];
				// console.log('regexResult: '.toUpperCase(), regexResult);
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
				// Recursion. If it is a folder, continue to walk the files under the folder
				beginWork(filedir, targetExtname, Callback);
			}
			resolve();
		});
	});
}

// Run RegExp.exec in string
function getCaptures(text: string, regex: RegExp): RegExpExecArray[] {
	const regexResult: RegExpExecArray[] = [];
	let match;
	while((match = regex.exec(text)) !== null) {
		regexResult.push(match);
	}
	return regexResult;
}


import fs from 'fs';
import path from 'path';
import { getRegex } from './regexDefinition';
import { analyzeCodeByAst } from './codeAnalyze';
import type { funcionCallInfo } from './codeAnalyze';
import { ProgressBar } from './commandLineTools/progress-bar';

export type codeInfo = {
	fileName: string,
} & funcionCallInfo;
export type Callback = (data: codeInfo[]) => void;

const Output: Array<codeInfo> = [];
let targetExtname: string[];
let Callback: Callback;
// Used to show process bar
let taskCompleted: number;
let taskTotal: number;
const promises: Array<Promise<void>> = [];

// Input function
export function beginWork(
	filePath: string,
	fileExtname?: string[],
	callback?: Callback,
): void {
	fileExtname && setTargetExtname(fileExtname);
	callback && setCallback(callback);

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
		// display progress bar
		initProgressBar(fileList.length * 2);
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
		if(taskCompleted < taskTotal) {
			taskCompleted = taskTotal;
		}
		setTimeout(() => {
			if(!Callback) {
				console.log('Precession is done. But no callback function is detected.');
				return;
			}
			Callback(Output);					
		}, 501);
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

function initProgressBar(total: number) {
	taskCompleted = 0;
	taskTotal = total;
	const pb = new ProgressBar('tracking', 30);

	function downloading() {
		if (taskCompleted <= total) {
			pb.render({ completed: taskCompleted, total: taskTotal });

			taskCompleted ++;
			setTimeout(function () {
				downloading();
			}, 500);
		}
	}
	downloading();
}


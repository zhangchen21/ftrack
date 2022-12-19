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
let hasRegisterHandler: boolean;
// Used to show process bar
let hasProcessBar: boolean;
let taskCompleted: number;
let taskTotal = 0;
const taskLists: Array<Promise<string>> = [];

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
	}

	// Display a progress bar
	initProgressBar();

	ensureWorkIsDone();
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
	// Read dir
	const pathList = fs.readdirSync(
		path.resolve(filePath), 
		{ withFileTypes: true }
	);

	// Walk the file list
	pathList.forEach(path => {
		if (path.isFile()) {
			handleFile(`${filePath}${path.name}`);
		} else {
			// Recursion. If it is a folder, continue to walk the files under the folder
			beginWork(`${filePath}${path.name}/`);
		}
	});	
}

function handleFile(filePath: string) {
	if (
		!targetExtname?.length ||
		targetExtname.includes(path.extname(filePath))
	) {
		// Register a new work
		readFile(filePath);
	}	
}

// Register new work
async function readFile(filedir: string) {
	const task = fs.promises.readFile(filedir, 'utf-8');

	// push it into queue
	taskLists.push(task);
	taskTotal++;

	const text = await task;
	const regexResult = getCaptures(text, getRegex()) ?? [];
	for (const data of regexResult) {
		// Use AST to analyze code
		const astReult = analyzeCodeByAst(data[0]);
		const codeInfoList: codeInfo[] = 
			astReult.map(el => (
				{
					fileName: filedir,
					...el,
				}
			));
		// collect the result in Output
		Output.push(...codeInfoList);
	}
}

function ensureWorkIsDone() {
	if (hasRegisterHandler) {
		// If already register a handler, just return
		return;
	}

	hasRegisterHandler = true;
	Promise.all(taskLists).then(() => {
		if(taskCompleted < taskTotal) {
			// If the process hasn't be 100%, make it be
			taskCompleted = taskTotal;
		}
		// Make sure the bar goes to 100% before we run callback
		setTimeout(() => {
			if(!Callback) {
				console.log('Precession is done. But no callback function is detected.');
				return;
			}
			Callback(Output);					
		}, 501);
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

function initProgressBar() {
	if(hasProcessBar) {
		return;
	}

	hasProcessBar= true;
	taskCompleted = 0;
	const pb = new ProgressBar('tracking', 30);

	function downloading() {
		if (taskCompleted <= taskTotal) {
			pb.render({ completed: taskCompleted, total: taskTotal });

			taskCompleted ++;
			setTimeout(function () {
				downloading();
			}, 500);
		}
	}
	downloading();
}


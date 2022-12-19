'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.beginWork = void 0;
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const regexDefinition_1 = require('./regexDefinition');
const codeAnalyze_1 = require('./codeAnalyze');
const progress_bar_1 = require('./commandLineTools/progress-bar');
const Output = [];
let targetExtname;
let Callback;
// Used to show process bar
let taskCompleted;
let taskTotal;
const promises = [];
// Input function
function beginWork(filePath, fileExtname, callback) {
	fileExtname && setTargetExtname(fileExtname);
	callback && setCallback(callback);
	if (checkIsDir(filePath)) {
		handleDir(filePath);
	}
	else {
		handleFile(filePath);
		ensureWorkIsDone();
	}
}
exports.beginWork = beginWork;
function setTargetExtname(extname) {
	targetExtname = extname;
}
function setCallback(callback) {
	Callback = callback;
}
function checkIsDir(filePath) {
	return filePath.endsWith('/') || filePath.endsWith('\\');
}
function handleDir(filePath) {
	// Read direction
	fs_1.default.readdir(path_1.default.resolve(filePath), (err, fileList) => {
		// display progress bar
		initProgressBar(fileList.length * 2);
		// Walk the file list
		fileList.forEach(fileName => {
			handleFile(filePath + fileName);
		});
		ensureWorkIsDone();
	});
}
function handleFile(filePath) {
	if (!(targetExtname === null || targetExtname === void 0 ? void 0 : targetExtname.length) ||
        targetExtname.includes(path_1.default.extname(filePath))) {
		// Sign a new work
		promises.push(readFilePromise(path_1.default.resolve(filePath)));
	}
}
function ensureWorkIsDone() {
	Promise.all(promises).then(() => {
		if (taskCompleted < taskTotal) {
			taskCompleted = taskTotal;
		}
		setTimeout(() => {
			if (!Callback) {
				console.log('Precession is done. But no callback function is detected.');
				return;
			}
			Callback(Output);
		}, 501);
	});
}
function readFilePromise(filedir) {
	return new Promise(resolve => {
		fs_1.default.stat(filedir, (err, stats) => {
			var _a;
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();
			if (isFile) {
				const text = fs_1.default.readFileSync(filedir, 'utf-8').toString();
				const regexResult = (_a = getCaptures(text, (0, regexDefinition_1.getRegex)())) !== null && _a !== void 0 ? _a : [];
				for (const item of regexResult) {
					// Use AST to analyze code
					const astReult = (0, codeAnalyze_1.analyzeCodeByAst)(item[0]);
					const codeInfoList = astReult.map(el => {
						return Object.assign({ fileName: filedir }, el);
					});
					Output.push(...codeInfoList);
				}
			}
			if (isDir) {
				// Recursion. If it is a folder, continue to walk the files under the folder
				beginWork(filedir, targetExtname, Callback);
			}
			resolve();
		});
	});
}
// Run RegExp.exec in string
function getCaptures(text, regex) {
	const regexResult = [];
	let match;
	while ((match = regex.exec(text)) !== null) {
		regexResult.push(match);
	}
	return regexResult;
}
function initProgressBar(total) {
	taskCompleted = 0;
	taskTotal = total;
	const pb = new progress_bar_1.ProgressBar('tracking', 30);
	function downloading() {
		if (taskCompleted <= total) {
			pb.render({ completed: taskCompleted, total: taskTotal });
			taskCompleted++;
			setTimeout(function () {
				downloading();
			}, 500);
		}
	}
	downloading();
}

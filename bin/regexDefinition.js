"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTargetFunctionName = exports.getRegex = void 0;
let RegexString;
const getRegex = () => new RegExp(RegexString, 'gs');
exports.getRegex = getRegex;
function setTargetFunctionName(functionNames) {
    RegexString = `(?<funcName>${functionNames.join('|')}).*?;`;
}
exports.setTargetFunctionName = setTargetFunctionName;

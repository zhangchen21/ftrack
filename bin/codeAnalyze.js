"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCodeByAst = void 0;
const acorn_1 = require("acorn");
const estraverse_1 = require("estraverse");
function analyzeCodeByAst(code) {
    let ast;
    try {
        ast = (0, acorn_1.parse)(code, {
            ecmaVersion: 2020,
        });
    }
    catch (e) {
        return [];
    }
    const funcionCallInfoList = [];
    (0, estraverse_1.traverse)(ast, {
        enter: function (node) {
            if (node.type === 'CallExpression' &&
                node.callee.type === 'Identifier') {
                const funcionCallInfo = {
                    functionName: '',
                    params: [],
                };
                funcionCallInfo.functionName = node.callee.name,
                    node.arguments.forEach((param) => {
                        switch (param.type) {
                            case 'Identifier':
                                funcionCallInfo.params.push(param.name);
                                funcionCallInfoList.push(funcionCallInfo);
                                break;
                            default:
                                console.log(`Detected a ${param.type}.`, 'Use complex expression in buried function is not good to read,', 'pleased named a readable variable to it');
                        }
                    });
            }
        }
    });
    return funcionCallInfoList;
}
exports.analyzeCodeByAst = analyzeCodeByAst;

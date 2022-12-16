import { parse } from 'acorn';
import { traverse } from 'estraverse';
import * as ESTree from 'estree';
import { ftrack } from '../ftrack.conf';
const { functionName } = ftrack;

export type funcionCallInfo = {
	functionName: string,
	params: string[],
	owner?: string,
}

export function analyzeCodeByAst(code: string): funcionCallInfo[] { 
	let ast: acorn.Node;
	try {
		ast = parse(code, { 
			ecmaVersion: 2020,
		});		
	} catch(e) {
		return [];
	}
	
	const funcionCallInfoList: funcionCallInfo[] = [];

	traverse(ast as ESTree.Node, {
		enter: function (node) {  
			if (node.type === 'CallExpression' && 
				node.callee.type === 'Identifier' &&
				functionName.includes(node.callee.name)
			) {
				
				const funcionCallInfo: funcionCallInfo = {
					functionName: '',
					params: [],
				};
				funcionCallInfo.functionName = node.callee.name,
				node.arguments.forEach((param) => {
					switch(param.type) {
					case 'Identifier':
						funcionCallInfo.params.push(param.name);
						funcionCallInfoList.push(funcionCallInfo);
						break;
					default:
						console.log(
							`Detected a ${param.type}.`,
							'Use complex expression in buried function is not good to read,',
							'pleased named a readable variable to it'
						);
					}
				});
			}    
		}
	});

	return funcionCallInfoList;
}

const fs = require('fs');  
const esprima = require('esprima');
const estraverse = require('estraverse');
const path = require('path');
const { ftrack } = require('../ftrack.conf.js')

/** 
	codeDescribe数据结构如下： 对于每一个参数，如果是对象类型，则返回对象类型，属性名为递增生成，属性值为原属性名；对于其他类型，直接返回原属性名作为属性值
	{
		functionName: '',
		param1: '',
		param2: {
			key1: {
				name: '',
				keyword1: '',
				...
			},
			key2: ''
		},
		params: '...(*)...' 插值语法
		...
	}
*/
const { functionName } = ftrack;
exports.analyzeCodeByAst = function(code) {  
	const ast = esprima.parse(code); 
	const codeDescribe = {};
	estraverse.traverse(ast, {  
		enter: function (node) {  
			if (node.type === 'CallExpression' && 
				node.callee.type === 'Identifier' &&
				functionName.includes(node.callee.name)
			) { 
				codeDescribe.functionName = node.callee.name,
				node.arguments.forEach((arg, index) => {
					let param = {};
					if(arg.type === "ObjectExpression") {
						arg.properties.forEach((property, index) => {
							if(property.value.type === "ObjectExpression") {
								// 按顺序动态生成 属性名
								param[`key${index + 1}`] = {
									name: property.key.name,
								};
								// todo
								for( let key of property.value.properties) {
									param[`key${index + 1}`][`keyword${index + 1}`] = key.key.name;
								}
							} else {
								param[`key${index + 1}`] =  property.key.name;
							}
						})
					} 
					// 特殊处理 插值语法 的写法，将变量用 * 替换
					else if(arg.type === "TemplateLiteral") {
						param = arg.quasis.map((el) => {
							return el.value.cooked
						}).join('(*)')
					}
					else {
						param = arg.value;
					}
					codeDescribe[`param${index + 1}`] = param;
				})
			}    
		},
		leave() {}
	});
	return codeDescribe;
}

// console.log(analyzeCodeByAst(fs.readFileSync('./test/1.js').toString()));


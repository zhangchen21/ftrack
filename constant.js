const { ftrack } = require('./ftrack.conf.js');

exports.CodeDescribeIndexNumber = {
    fileName: 1,
    explain: 2,
    functionName: 3,
    params: 4
}

const { functionName } = ftrack;
// 两个捕获组
// 1. (\/\/(.*)\n)* 匹配注释
const regex1 = '(\/\/.+\n)*?';
// .* 匹配可能的条件语句
const regex2 = '.*?';
// 2. (getInsightStat|getHotTagData|reportInsightInfo) 匹配上报数据函数， [\s\S]*? 匹配函数参数和函数体, ; 匹配函数调用结束
const regex3 = `((${functionName.join('|')})[\\s\\S]*?;)`;
// 注意上面的写法会产生第四个捕获组： 函数名，不过不需要

// Regex = /(\/\/.+\n).*(getInsightStat|getHotTagData|reportInsightInfo[\s\S]*?;)/g;
exports.Regex = new RegExp(regex1 + regex2 + regex3, 'g');


exports.outputFile = './test.xlsx';

exports.myData = [{
    name: '我的表格',
    data: [
        ["fileName", "explain", "functionName", "functionContent", "owner"],
    ]
}]
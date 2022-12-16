/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
exports.ftrack = {
	TargetPath: './tests/',
	TargetFileExtname: ['.js', '.ts', '.tsx'],
	functionName: ['getHotData',],
	callback: (data) => {console.log(data);},
};
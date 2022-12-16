export const ftrack = {
	TargetPath: './tests',
	TargetFileName: ['.js', '.ts', '.tsx'],
	functionName: ['getHotData',],
	outputFile: './fresult.js',
	callback: (data: any) => {console.log(data);},
};
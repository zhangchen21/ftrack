import { codeInfo } from '../src/beginWork';

declare module '.trackconf' {
	interface ftrack {
		TargetPath: string,
		TargetFileExtname: string[],
		functionName: string[],
		callback: codeInfo
	}
	export const ftrack: ftrack;
}
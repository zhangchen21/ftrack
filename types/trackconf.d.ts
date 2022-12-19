import { codeInfo } from '../src/beginWork';

declare module 'ftrack.config' {
	interface ftrack {
		TargetPath: string,
		TargetFileExtname: string[],
		functionName: string[],
		callback: codeInfo
	}
	export const ftrack: ftrack;
}
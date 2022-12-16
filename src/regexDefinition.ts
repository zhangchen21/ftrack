let RegexString: string;

export const getRegex = () => new RegExp(RegexString, 'gs');

export function setTargetFunctionName(functionNames: string[]): void {
	RegexString = `(?<funcName>${ functionNames.join('|') }).*?;`;
}
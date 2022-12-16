import { ftrack } from '../ftrack.conf';

const { functionName } = ftrack;

const RegexString = `(?<funcName>${ functionName.join('|') }).*?;`;

export const Regex = new RegExp(RegexString, 'gs');
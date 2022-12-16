import { program } from 'commander';
import { beginWork } from './beginWork';
import { setTargetFunctionName } from './regexDefinition';
import { argv } from 'process';
import { ftrack } from '/trackconf';

program
	.version('1.0.0', '-v, --version')
	// Informations
	.usage('<file ...> [options], omit to use config')
	// Options
	.option('-f, --file', 'just check some specific files')
	.option('-init', 'TODO-generate config file from some questions')
	.parse(argv);

function track(program: any) {
	const {
		TargetPath,
		TargetFileExtname,
		functionName,
		callback,
	} = ftrack;

	if (!functionName?.length) {
		console.log('No target function name detected, checkout your config please.');
		return;
	}

	setTargetFunctionName(functionName);
	const { file } = program;
	if (file) {
		// If specific file is selected
		beginWork(file, TargetFileExtname, callback);
		return;
	}
	beginWork(TargetPath, TargetFileExtname, callback);
}

track(program);

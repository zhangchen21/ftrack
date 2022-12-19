#!/usr/bin/env node
/* eslint-disable no-undef */
const { program } = require('commander');
const { beginWork } = require('./beginWork');
const { setTargetFunctionName } = require('./regexDefinition');
const process = require('process');
const config = require(`${process.cwd()}/ftrack.config`);

program
	.version('1.0.0', '-v, --version')
	// Informations
	.usage('<file ...> [options], omit to use config')
	// Options
	.option('-f, --file', 'just check some specific files')
	.option('-init', 'TODO-generate config file from some questions')
	.parse(process.argv);

function track(program) {
	if(!config) {
		console.log('No ftrack.config detected.');
	}
	if (!config.functionName.length) {
		console.log('No target function name detected, checkout your ftrack.config.');
		return;
	}

	setTargetFunctionName(config.functionName);
	const { file } = program;
	if (file) {
		// If specific file is selected
		beginWork(file, config.TargetFileExtname, config.callback);
		return;
	}
	beginWork(config.TargetPath, config.TargetFileExtname, config.callback);
}

track(program);

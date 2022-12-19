"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const beginWork_1 = require("./beginWork");
const regexDefinition_1 = require("./regexDefinition");
const process_1 = require("process");
const _trackconf_1 = require("../../.trackconf");
commander_1.program
    .version('1.0.0', '-v, --version')
    // Informations
    .usage('<file ...> [options], omit to use config')
    // Options
    .option('-f, --file', 'just check some specific files')
    .option('-init', 'TODO-generate config file from some questions')
    .parse(process_1.argv);
function track(program) {
    if (!(_trackconf_1.functionName === null || _trackconf_1.functionName === void 0 ? void 0 : _trackconf_1.functionName.length)) {
        console.log('No target function name detected, checkout your config please.');
        return;
    }
    (0, regexDefinition_1.setTargetFunctionName)(_trackconf_1.functionName);
    const { file } = program;
    if (file) {
        // If specific file is selected
        (0, beginWork_1.beginWork)(file, _trackconf_1.TargetFileExtname, _trackconf_1.callback);
        return;
    }
    (0, beginWork_1.beginWork)(_trackconf_1.TargetPath, _trackconf_1.TargetFileExtname, _trackconf_1.callback);
}
track(commander_1.program);

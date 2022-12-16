"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const beginWork_1 = require("./beginWork");
const regexDefinition_1 = require("./regexDefinition");
const process_1 = require("process");
const trackconf_1 = require("/trackconf");
commander_1.program
    .version('1.0.0', '-v, --version')
    // Informations
    .usage('<file ...> [options], omit to use config')
    // Options
    .option('-f, --file', 'just check some specific files')
    .option('-init', 'TODO-generate config file from some questions')
    .parse(process_1.argv);
function track(program) {
    const { TargetPath, TargetFileExtname, functionName, callback, } = trackconf_1.ftrack;
    if (!(functionName === null || functionName === void 0 ? void 0 : functionName.length)) {
        console.log('No target function name detected, checkout your config please.');
        return;
    }
    (0, regexDefinition_1.setTargetFunctionName)(functionName);
    const { file } = program;
    if (file) {
        // If specific file is selected
        (0, beginWork_1.beginWork)(file, TargetFileExtname, callback);
        return;
    }
    (0, beginWork_1.beginWork)(TargetPath, TargetFileExtname, callback);
}
track(commander_1.program);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
const single_line_log_1 = require("single-line-log");
class ProgressBar {
    constructor(desc, len) {
        this.description = desc;
        this.length = len;
    }
    render(opts) {
        const percent = Number((opts.completed / opts.total).toFixed(4));
        const cellNum = Math.floor(percent * this.length);
        let cell = '';
        for (let i = 0; i < cellNum; i++) {
            cell += '■';
        }
        let empty = '';
        for (let i = 0; i < this.length - cellNum; i++) {
            empty += '.';
        }
        const cmdText = `${this.description}: ${(100 * percent).toFixed(2)}% [${cell}${empty} ${opts.completed}/${opts.total}]\n`;
        (0, single_line_log_1.stdout)(cmdText);
    }
}
exports.ProgressBar = ProgressBar;

import { stdout } from 'single-line-log';

type rate = {
	completed: number,
	total: number,
}

export class ProgressBar {
	description: string;
	length: number;
	constructor(desc: string, len: number) {
		this.description = desc;
		this.length = len;
	}
	render(opts: rate) {
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

		stdout(cmdText);
	}
}
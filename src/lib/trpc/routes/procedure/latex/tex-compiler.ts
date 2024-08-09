/* Load dependencies */

import { spawn } from 'child_process';
import path from 'path';

/**
 * Compiles a tex file one or more times.
 *
 * @param {string} file - path to the tex file
 * @param {string} [engine=pdflatex] - which engine to use to compile the file
 * @param {Object[]} runs - An array specifying the runs
 * @param {number} runs[].runs how many times the file should be compiled with the corresponding arguments
 * @param {Object[]} runs[].options arguments used to run the engine
 *
 * @return {Object} a promise for the output file name
 */

export function compileTex(file: string) {
	var parsedFile = path.parse(file),
		outputFile = path.join(parsedFile.dir, path.basename(file, path.extname(file)) + '.pdf'),
		defaultOptions = ['-f', '-interaction=nonstopmode', '-shell-escape'];
	let engine = 'latexmk';
	let runs = [
		{
			runs: 1,
			options: defaultOptions //.concat(["-draftmode"]),
		},
		{
			runs: 2,
			options: defaultOptions
		}
	];

	var optionsForMapping: any[] = [];
	runs.map(function (currentValue) {
		for (var i = 0; i < currentValue.runs; i++) {
			optionsForMapping.push(currentValue.options);
		}
	});

	function texPromise(options: any) {
		if (!Array.isArray(options)) {
			options = options !== undefined ? [options] : defaultOptions;
		}
		options.push(file.substring(parsedFile.dir.length + 1));

		var texSpawn = spawn(engine, options, { cwd: parsedFile.dir });

		var texPromise = new Promise(function (resolve, reject) {
			var stdrerrMessage = '',
				stdoutMessage = '';
			texSpawn.stderr.on('data', function (data: any) {
				stdrerrMessage += data.toString();
			});
			texSpawn.stdout.on('data', function (data: any) {
				stdoutMessage += data.toString();
			});
			texSpawn.on('error', function (data: any) {
				console.log('error: ' + data);
			});
			texSpawn.on('exit', function (data: any) {});
			texSpawn.on('close', function (code: any) {
				resolve(outputFile);
			});
		});
		return texPromise;
	}

	var resultPromise = texPromise(optionsForMapping[0]);

	for (var i = 1; i < optionsForMapping.length; i++) {
		resultPromise = resultPromise.then(function () {
			return texPromise(optionsForMapping[i]);
		});
	}

	return resultPromise;
}

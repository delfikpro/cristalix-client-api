#!/usr/bin/env node

const runCLI = require('webpack-cli/lib/bootstrap.js');
const fs = require('fs');
const process = require('process');

const [, , ...rawArgs] = process.argv;

if (!rawArgs.length) {
	console.log('Usage: cristalix-jsc [Entry files]');
	return
}

const entry = rawArgs[0]
var entryFile;

try {
	entryFile = fs.lstatSync(entry);
} catch (error) {
	console.log(`Unable to find entry point '${entry}'.`);
	return
}
var args = entryFile.isDirectory() ?
	fs.readdirSync(entry).map(file => './' + entry + (entry.endsWith("/") ? "" : "/") + file) :
	['./' + entry];

//args = args.map(arg => ['--entry', arg]).flat()

console.log(...args);

fs.copyFileSync(__dirname + '/tsconfig.json', './tsconfig.json')

runCLI([
	'-c', __dirname + '/webpack.config.js',
	...args
]);
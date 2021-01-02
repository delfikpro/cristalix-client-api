#!/usr/bin/env node

const runCLI = require('webpack-cli/lib/bootstrap.js');
const fs = require('fs');
const process = require('process');

const [, , ...rawArgs] = process.argv;

if (!rawArgs.length) {
	console.log('Usage: cristalix-bundler [Entry files]');
	return
}

var webpackArgs = [];
var files = [];

function resolveEntryPoint(entry) {

	var entryFile;

	try {
		entryFile = fs.lstatSync(entry);
	} catch (error) {
		console.log(`Unable to resolve entry point '${entry}'.`);
		throw error;
		return
	}

	if (entryFile.isDirectory()) {
		if (!entry.endsWith('/')) entry += '/';
		for (let file of fs.readdirSync(entry)) {
			resolveEntryPoint(entry + file)
		}
		return
	}

	let webpackArg = './' + entry;

	if (!webpackArgs.includes(webpackArg)) {
		files.push(webpackArg);
		webpackArgs.push('--entry', webpackArg);
	}

}

rawArgs.forEach(resolveEntryPoint);

if (!process.env.CRISTALIX_BUNDLER_MODULE_NAME) {
	let moduleName = rawArgs[0].replace(/(.+[\/\\\\]|\.ts$|[^A-Za-z0-9_-]+)/g, '');
	process.env.CRISTALIX_BUNDLER_MODULE_NAME = moduleName;
}

console.log('Files to bundle:', ...files);

let tsConfigPath = require.resolve('./cristalix-tsconfig.json');
let webpackConfigPath = require.resolve('./cristalix-webpack.config.js');

// console.log(webpackConfigPath);

fs.copyFileSync(tsConfigPath, './tsconfig.json')

// First two arguments correspond to nodejs executable and the script file respectively
let args = ['', '', '--config', webpackConfigPath, ...webpackArgs];

runCLI(args);

#! /usr/bin/env node

var shell = require('shelljs');
// var open = require('open');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
const branchinfo = shell.exec('git br');
if(branchinfo.code !== 0) {
  shell.echo('Error: git branch failed');
  shell.exit(1);
}
const branchname = branchinfo.stdout.match(/\*\s([\S]+)/)[1];
 
const commander = `git push origin HEAD:refs/for/${branchname}`;
//git push origin HEAD:refs/for/rel/8.0.2_ttd
console.log(`Current branch name: ${branchname};\nand commander is ${commander}`);
//reviewer name
const pushaction = shell.exec(commander);
if(pushaction.code !== 0) {
  shell.echo('Error: push failed');
  shell.exit(1);
}else {
  // console.log('log:');
  // console.log(pushaction.stdout);
  // const url = pushaction.stdout.match(/http[\S]+/)[0];
  console.log('push success');
  // open(url,'chrome');
}
//push
#! /usr/bin/env node

const { Command, Argument } = require("commander");
const boot = require("../boot");
const program = new Command();

program
  .addArgument(new Argument("filepath", "Filepath"))
  .option("-d, --watchdir <char>")
  .action(boot);

program.parse();

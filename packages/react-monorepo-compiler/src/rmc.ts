#!/usr/bin/env node
import { startDevServer } from "./start";
import { buildApplication } from "./build";
import { runTests } from "./test";

const [_firstArg, _secondArg, task] = process.argv;

switch (task) {
  case "build":
    buildApplication();
    break;
  case "start":
    startDevServer();
    break;
  case "test":
    runTests();
    break;
  default:
    console.log("No task specified.");
    console.log("Available tasks are");
    console.log("build - start - test");
}
